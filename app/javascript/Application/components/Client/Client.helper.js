import { ClientStatus } from '../../util/constants'

export function formatClientName({ first_name: firstName, middle_name: middleName, last_name: lastName, suffix }) {
  let result = `${lastName}, ${firstName}`
  if (middleName) {
    result += ` ${middleName}`
  }
  if (suffix) {
    result += `, ${suffix}`
  }
  return result
}

export function formatClientStatus(status) {
  return !ClientStatus.hasOwnProperty(status) ? 'Unknown' : ClientStatus[status]
}

export const failedFetching = { message: 'Fail to fetch data from server side!' }

export function clientCaseReferralNumber(serviceSource) {
  let caseReferralNumber = ''
  if (serviceSource === 'CASE') {
    caseReferralNumber = 'Case Number'
  } else if (serviceSource === 'REFERRAL') {
    caseReferralNumber = 'Referral Number'
  } else {
    caseReferralNumber = 'Case/Referral Number'
  }
  return caseReferralNumber
}

export const recordsMode = Object.freeze({
  HISTORY: 'history',
  COMPARISON: 'comparison',
})

export const shouldRenderRecordsSwitch = assessments => {
  if (!assessments) {
    return false
  }
  const completedAssessments = assessments.filter(el => {
    return el.status === 'COMPLETED'
  })
  return completedAssessments.length > 1 // have at least two COMPLETED assessments
}

export const activeSwitchDetector = isComparisonShown => {
  return isComparisonShown ? recordsMode.HISTORY : recordsMode.COMPARISON
}

export const viewNameSwitch = isComparisonShown => {
  return isComparisonShown ? 'Assessment Comparison' : 'Assessment History'
}
