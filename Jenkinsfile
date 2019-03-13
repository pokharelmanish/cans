@Library('jenkins-pipeline-utils') _

def app
DOCKER_REGISTRY_CREDENTIALS_ID = '6ba8d05c-ca13-4818-8329-15d41a089ec0'
GITHUB_CREDENTIALS_ID = '433ac100-b3c2-4519-b4d6-207c029a103b'
GITHUB_URL = 'git@github.com:ca-cwds/cans.git'
DE_ANSIBLE_GITHUB_URL = 'git@github.com:ca-cwds/de-ansible.git'
JENKINS_MANAGEMENT_DOCKER_REGISTRY_CREDENTIALS_ID = '3ce810c0-b697-4ad1-a1b7-ad656b99686e'

switch(env.BUILD_JOB_TYPE) {
  case "master": buildMaster(); break;
  case "hotfix": buildHotfix(); break;
  case "acceptance": jobTypeHandledByMasterBuild(); break;
  case "regression": jobTypeHandledByMasterBuild(); break;
  case "regressionStaging": buildRegression('staging','--env CANS_WEB_BASE_URL=https://staging.cwds.ca.gov/cans'); break;
  case "regressionPreprod": buildRegression('preprod','--env CANS_WEB_BASE_URL=https://preprod.cwds.ca.gov/cans'); break;
  case "release": releasePipeline(); break;
  default: buildPullRequest();
}

def jobTypeHandledByMasterBuild() {
  currentBuild.result = "FAILURE"
  throw new Exception("BUILD_JOB_TYPE=${env.BUILD_JOB_TYPE} no longer used, triggered from master build now, please delete this job")
}

def buildPullRequest() {
  node('cans-slave') {
    def triggerProperties = githubPullRequestBuilderTriggerProperties()
    properties([
      githubConfig(),
      pipelineTriggers([triggerProperties]),
      buildDiscarderDefaults()
    ])
    try {
      checkoutStage()
      checkForLabel() // shared library
      buildDockerImageForTest()
      lintAndUnitTestStages()
      regressionDevTestStage()
      a11yLintStage()
    } catch(Exception exception) {
      currentBuild.result = "FAILURE"
      throw exception
    } finally {
      cleanupStage()
    }
  }
}

def buildMaster() {
  node('cans-slave') {
    triggerProperties = pullRequestMergedTriggerProperties('cans-master')
    properties([
      githubConfig(),
      pipelineTriggers([triggerProperties]),
      buildDiscarderDefaults('master')
    ])
    try {
      checkoutStage()
      incrementTag() // shared library
      buildDockerImageForTest()
      lintAndUnitTestStages()
      regressionDevTestStage()
      a11yLintStage()
      buildDockerImageStage()
      tagRepo() // shared library
      publishImageStage()
      triggerReleasePipeline()  
    } catch(Exception exception) {
      currentBuild.result = "FAILURE"
      throw exception
    } finally {
      cleanupStage()
    }
  }
}

def buildHotfix() {
  node('cans-slave') {
    properties([buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '5')), disableConcurrentBuilds(), [$class: 'RebuildSettings', autoRebuild: false, rebuildDisabled: false],
      parameters([
        string(defaultValue: '1.0.0-hotfix1', description: 'Use current release version as a base for hotfix version (example: 1.0.0-hotfix1) ', name: 'hotfix_version')
    ])])
    try {
      checkoutBranchStage('1.0.0-hotfix')
      buildDockerImageStage()
      lintAndUnitTestStages()
      acceptanceTestStage()
      a11yLintStage()
      tagRepo() // shared library
      publishImageStage()
    } catch(Exception exception) {
      currentBuild.result = "FAILURE"
      throw exception
    } finally {
      cleanupStage()
    }
  }
}

def buildRegression(nodeName, url) {
  node(nodeName) {
    try {
      checkoutStage()
      regressionTestStage(url)
    } catch(Exception exception) {
      currentBuild.result = "FAILURE"
      throw exception
    } finally {
      cleanupStage()
    }
  }
}

def checkoutStage() {
  stage('Checkout') {
    sh "sudo rm -rf *"
    checkout scm
  }
}

def checkoutBranchStage(branch) {
  stage('Checkout') {
    sh "sudo rm -rf *"
    checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: branch]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: GITHUB_CREDENTIALS_ID, url: GITHUB_URL]]]
    newTag = "$hotfix_version"
  }
}

def checkForLabel() {
  stage('Verify SemVer Label') {
    checkForLabel('cans')
   } 
}

def incrementTag() {
  stage('Increment Tag') {
    newTag = newSemVer()
  }
}

def buildDockerImageForTest() {
  stage('Build Docker Image For Test') {
    app = buildDockerImageForTest('./docker/web/Dockerfile')
  }
}

def buildDockerImageStage() {
  stage('Build Docker Image') {
    app = docker.build("cwds/cans:${env.BUILD_ID}", "-f docker/web/Dockerfile .")
  }
}

def lintAndUnitTestStages() {
  app.withRun("-e CI=true") { container ->
    lintStage()
    unitTestStage(container)
  }
}

def lintStage() {
  stage('Lint') {
    lint()
  }
}

def unitTestStage(container) {
  stage('Unit Test') {
    sh "docker exec -t ${container.id} bash -c 'yarn test:coverage'"
    sh "docker exec -t ${container.id} yarn test:rspec"
  }
}

def acceptanceTestStage() {
  stage('Acceptance Test') {
    hostname = sh(returnStdout: true, script: '/sbin/ifconfig eth0 | grep "inet addr:" | cut -d: -f2 | cut -d " " -f1').trim()
    withEnv(["HOST=${hostname}"]) {
      withDockerRegistry([credentialsId: DOCKER_REGISTRY_CREDENTIALS_ID]) {
        sh "docker-compose -f docker-compose.ci.yml build"
        sh "docker-compose -f docker-compose.ci.yml run cans-test-all"
        runAcceptanceTests()
      }
    }
  }
}

def runAcceptanceTests() {
  try {
    sh "docker-compose -f docker-compose.ci.yml exec -T --env TZ=US/Pacific cans-test bundle exec rspec spec/acceptance --format html --out regression-report/index.html"
  } finally {
    publishHTML([
              allowMissing         : true,
              alwaysLinkToLastBuild: true,
              keepAll              : true,
              reportDir            : 'regression-report',
              reportFiles          : 'index.html',
              reportName           : 'Acceptance Tests',
              reportTitles         : 'Acceptance Tests'
    ])
  }
}

def regressionDevTestStage() {
  stage('Regression Test') {
    hostname = sh(returnStdout: true, script: '/sbin/ifconfig eth0 | grep "inet addr:" | cut -d: -f2 | cut -d " " -f1').trim()
    withEnv(["HOST=${hostname}"]) {
      withDockerRegistry([credentialsId: DOCKER_REGISTRY_CREDENTIALS_ID]) {
        sh "docker-compose -f docker-compose.ci.yml build"
        sh "docker-compose -f docker-compose.ci.yml run cans-test-all"
        runRegressionDevTests('')
      }
    }
  }
}

def runRegressionDevTests(environmentVariables, smokeTest = false) {
  try {
    command = "docker-compose -f docker-compose.ci.yml exec -T ${environmentVariables} --env TZ=US/Pacific cans-test bundle exec rspec spec/regression"
    if( smokeTest ) {
      command = "${command} --tag smoke"
    } else {
      command = "${command} --format html --out regression-report/index.html"
    }
    sh command
  } finally {
    if ( !smokeTest ) {
      publishHTML([
                allowMissing         : true,
                alwaysLinkToLastBuild: true,
                keepAll              : true,
                reportDir            : 'regression-report',
                reportFiles          : 'index.html',
                reportName           : 'Regression Tests Dev',
                reportTitles         : 'Regression Tests Dev'
      ])
    }
  }
}

def a11yLintStage() {
  stage('Accessibility Lint') {
    hostname = sh(returnStdout: true, script: '/sbin/ifconfig eth0 | grep "inet addr:" | cut -d: -f2 | cut -d " " -f1').trim()
    withEnv(["HOST=${hostname}"]) {
      withDockerRegistry([credentialsId: DOCKER_REGISTRY_CREDENTIALS_ID]) {
        sh "docker-compose -f docker-compose.ci.yml exec -T cans-test bundle exec rspec spec/a11y"
      }
    }
  }
}

def tagRepo() {
  stage('Tag Repo'){
    tagGithubRepo(newTag, GITHUB_CREDENTIALS_ID)
  }
}

def acceptanceTestPreintStage(stageName, smokeTest = false) {
  stage(stageName) {
    withDockerRegistry([credentialsId: JENKINS_MANAGEMENT_DOCKER_REGISTRY_CREDENTIALS_ID]) {
      sh "docker-compose -f docker-compose.ci.yml up -d --build cans-test"
      runRegressionDevTests('--env CANS_WEB_BASE_URL=https://cans.preint.cwds.io/cans', smokeTest)
    }
  }
}

def regressionTestStage(environmentVariables, stageName = 'Regression Test', smokeTest = false) {
  stage(stageName) {
    withDockerRegistry([credentialsId: JENKINS_MANAGEMENT_DOCKER_REGISTRY_CREDENTIALS_ID]) {
      withCredentials([
        string(credentialsId: 'cans-supervisor-username', variable: 'SUPERVISOR_USERNAME'),
        string(credentialsId: 'cans-supervisor-password', variable: 'SUPERVISOR_PASSWORD'),
        string(credentialsId: 'cans-supervisor-verification-code', variable: 'SUPERVISOR_VERIFICATION_CODE'),
        string(credentialsId: 'cans-caseworker-username', variable: 'CASEWORKER_USERNAME'),
        string(credentialsId: 'cans-caseworker-password', variable: 'CASEWORKER_PASSWORD'),
        string(credentialsId: 'cans-caseworker-verification-code', variable: 'CASEWORKER_VERIFICATION_CODE'),
        string(credentialsId: 'cans-non-caseworker-username', variable: 'NON_CASEWORKER_USERNAME'),
        string(credentialsId: 'cans-non-caseworker-password', variable: 'NON_CASEWORKER_PASSWORD'),
        string(credentialsId: 'cans-non-caseworker-verification-code', variable: 'NON_CASEWORKER_VERIFICATION_CODE'),
        ]) {        
        sh "docker-compose -f docker-compose.ci.yml up -d --build cans-test"
        try {
          command = "docker-compose -f docker-compose.ci.yml exec -T --env NON_CASEWORKER_USERNAME=$NON_CASEWORKER_USERNAME --env NON_CASEWORKER_PASSWORD=$NON_CASEWORKER_PASSWORD --env NON_CASEWORKER_VERIFICATION_CODE=$NON_CASEWORKER_VERIFICATION_CODE --env SUPERVISOR_USERNAME=$SUPERVISOR_USERNAME --env SUPERVISOR_PASSWORD=$SUPERVISOR_PASSWORD --env SUPERVISOR_VERIFICATION_CODE=$SUPERVISOR_VERIFICATION_CODE --env CASEWORKER_USERNAME=$CASEWORKER_USERNAME --env CASEWORKER_PASSWORD=$CASEWORKER_PASSWORD --env CASEWORKER_VERIFICATION_CODE=$CASEWORKER_VERIFICATION_CODE --env PROD_LOGIN=true ${environmentVariables} cans-test bundle exec rspec spec/regression"
          if( smokeTest ) {
            command = "${command} --tag smoke"
          } else {
            command = "${command} --format html --out regression-report/index.html"
          }
          sh command
        } finally {
          if( !smokeTest ) {
            publishHTML([
                    allowMissing         : true,
                    alwaysLinkToLastBuild: true,
                    keepAll              : true,
                    reportDir            : 'regression-report',
                    reportFiles          : 'index.html',
                    reportName           : 'Regression Tests Prod',
                    reportTitles         : 'Regression Tests Prod'
            ])
          }
        }
      }
    }
  }
}

def publishImageStage() {
  stage('Publish to Dockerhub') {
    withDockerRegistry([credentialsId: DOCKER_REGISTRY_CREDENTIALS_ID]) {
      app.push(newTag)
      app.push('latest')
    }
  }
  stage('Trigger Security scan') {
    build job: 'tenable-scan', parameters: [
        [$class: 'StringParameterValue', name: 'CONTAINER_NAME', value: 'cans'],
        [$class: 'StringParameterValue', name: 'CONTAINER_VERSION', value: newTag]
    ]
  }
}

def triggerReleasePipeline() {
  stage('Trigger Release Pipeline') {
    withCredentials([usernameColonPassword(credentialsId: 'fa186416-faac-44c0-a2fa-089aed50ca17', variable: 'jenkinsauth')]) {
      sh "curl -u $jenkinsauth 'http://jenkins.mgmt.cwds.io:8080/job/PreInt-Integration/job/deploy-cans/buildWithParameters?token=trigger-cans-deploy&APP_VERSION=${newTag}'"
    }
  }
}

def cleanupStage() {
  stage('Cleanup') {
    sh "ls -la"
    sh "docker-compose -f docker-compose.ci.yml down -v"
    cleanWs()
  }
}

def releasePipeline() {
  parameters([
    string(name: 'APP_VERSION', defaultValue: '', description: 'App version to deploy')
  ])
  
  try {
    releaseToEnvironment('preint')
    releaseToEnvironment('integration')
  } catch(Exception exception) {
    currentBuild.result = "FAILURE"
    throw exception
  }
}

def releaseToEnvironment(environment) {
  node(environment) {
    checkoutStage()
    deployToStage(environment, env.APP_VERSION)
    updateManifestStage(environment, env.APP_VERSION)
    smokeTestStage(environment)
    switch(environment) {
      case "preint": acceptanceTestPreintStage('Regression Test Preint'); break;
      case "integration": regressionTestStage('--env CANS_WEB_BASE_URL=https://web.integration.cwds.io/cans'); break;
      default: echo "No tests for run for $environment"
    }
  }
}

def deployToStage(environment, version) {
  stage("Deploy to $environment") {
    ws {
      git branch: "master", credentialsId: GITHUB_CREDENTIALS_ID, url: DE_ANSIBLE_GITHUB_URL
      sh "ansible-playbook -e NEW_RELIC_AGENT=true -e APP_VERSION=$version -i inventories/$environment/hosts.yml deploy-cans.yml --vault-password-file ~/.ssh/vault.txt "
    }
  }
}

def updateManifestStage(environment, version) {
  stage("Update $environment Manifest Version") {
    updateManifest("cans", environment, GITHUB_CREDENTIALS_ID, version)
  }
}

def smokeTestStage(environment) {
  if (environment == 'preint') {
    acceptanceTestPreintStage('Smoke Test Preint', true);
  } else {
    regressionTestStage('--env CANS_WEB_BASE_URL=https://web.integration.cwds.io/cans', 'Smoke Test Integration', true);
  }
}

def githubConfig() {
  githubConfigProperties('https://github.com/ca-cwds/cans')
}
