# frozen_string_literal: true

module LoginHelper
  def login(login_config = default_json)
    visit '/'
    return unless need_login?

    enter_credentials login_config
  end

  def enter_credentials(login_config = default_json)
    js_script = 'arguments[0].focus();' \
                 'arguments[0].setAttribute("value", arguments[1]);' \
                 'arguments[0].blur();'
    input_field = find('input#username')
    page.execute_script(js_script, input_field.native, JSON.generate(login_config))
    click_button 'Sign In'
  end

  def logout
    visit '/'
    click_logout
  end

  def click_logout
    find('.fa-user').click
    find('span[role="menuitem"]').click
  end

  private

  def need_login?
    ENV.fetch('CANS_AUTHORIZATION_ENABLED', true) && !page.has_content?('CANS', wait: 5)
  end

  def default_json
    {
      'user': 'REGREQD',
      'first_name': 'QA02',
      'last_name': 'Regression',
      'email': 'regressioncares+qa02@gmail.com',
      'roles': [
        'CWS-worker',
        'SocialWorker'
      ],
      'staffId': 'agn',
      'county_name': 'Sacramento',
      'county_code': '34',
      'county_cws_code': 1101,
      'privileges': [
        'Resource Mgmt Placement Facility Maint',
        'Countywide Read/Write',
        'Officewide Read',
        'Program Management Reports',
        'County License Case Management',
        'LIS',
        'Non-CWD',
        'CWS Case Management System',
        'Merge Client',
        'Create Service Provider',
        'Sealed',
        'Statewide Read',
        'Resource Management',
        'System Administration',
        'Closed Case/Referral Update',
        'Sensitive Persons',
        'Countywide Read',
        'Adoptions',
        'Officewide Read/Write',
        'CANS-staff-person-clients-read',
        'CANS-client-read',
        'CANS-client-search',
        'CANS-assessment-read',
        'CANS-assessment-create',
        'CANS-assessment-in-progress-update',
        'CANS-assessment-in-progress-delete',
        'CANS-assessment-completed-delete',
        'CANS-assessment-complete',
        'CANS-rollout'
      ],
      'authorityCodes': [
        'B'
      ],
      'userName': 'd0108753-54cf-4e28-9d3f-1817903f24ad'
    }
  end

  def supervisor_json
    {
      'user': 'REGREQC',
      'first_name': 'QA01',
      'last_name': 'Regression',
      'email': 'regressioncares+qa01@gmail.com',
      'roles': [
        'Supervisor',
        'CWS-worker'
      ],
      'staffId': 'agm',
      'county_name': 'Sacramento',
      'county_code': '34',
      'county_cws_code': 1101,
      'privileges': [
        'Resource Mgmt Placement Facility Maint',
        'Countywide Read/Write',
        'Officewide Read',
        'Program Management Reports',
        'County License Case Management',
        'LIS',
        'Non-CWD',
        'CWS Case Management System',
        'Create Service Provider',
        'Merge Client',
        'Statewide Read',
        'Sealed',
        'Resource Management',
        'System Administration',
        'Closed Case/Referral Update',
        'Sensitive Persons',
        'Countywide Read',
        'Adoptions',
        'Officewide Read/Write',
        'CANS-staff-person-clients-read',
        'CANS-client-read',
        'CANS-client-search',
        'CANS-assessment-read',
        'CANS-assessment-create',
        'CANS-assessment-in-progress-update',
        'CANS-assessment-in-progress-delete',
        'CANS-assessment-completed-delete',
        'CANS-assessment-complete',
        'CANS-staff-person-subordinates-read',
        'CANS-staff-person-read',
        'CANS-rollout'
      ],
      'authorityCodes': [
        'S'
      ],
      'userName': 'a1d7c9af-20ab-4cc3-82fd-aaf6f1cf9d5e'
    }
  end

  def non_caseworker_json
    {
      'user': 'REGREQE',
      'first_name': 'QA03',
      'last_name': 'Regression',
      'email': 'regressioncares+qa03@gmail.com',
      'roles': [
        'CWS-worker',
        'SocialWorker'
      ],
      'staffId': 'agp',
      'county_name': 'Sacramento',
      'county_code': '34',
      'county_cws_code': 1101,
      'privileges': [
        'Resource Mgmt Placement Facility Maint',
        'Countywide Read/Write',
        'Officewide Read',
        'Program Management Reports',
        'County License Case Management',
        'LIS',
        'Non-CWD',
        'CWS Case Management System',
        'Create Service Provider',
        'Merge Client',
        'Statewide Read',
        'Sealed',
        'Resource Management',
        'System Administration',
        'Closed Case/Referral Update',
        'Sensitive Persons',
        'Adoptions',
        'Countywide Read',
        'Officewide Read/Write',
        'CANS-client-read',
        'CANS-client-search',
        'CANS-assessment-read',
        'CANS-assessment-create',
        'CANS-assessment-in-progress-update',
        'CANS-assessment-in-progress-delete',
        'CANS-assessment-completed-delete',
        'CANS-assessment-complete',
        'CANS-rollout'
      ],
      'authorityCodes': [
        'N'
      ],
      'userName': 'a05d1517-dafb-4122-9716-d3a0ebac251f'
    }
  end
end
