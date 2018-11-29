export const LOCAL_DATE_FORMAT = 'MM/DD/YYYY'
export const ISO_DATE_FORMAT = 'YYYY-MM-DD'
export const DEFAULT_AUTO_HIDE_TIMEOUT = 3000
export const TIMEOUT_EVENT = 'TIMEOUT_EVENT'
export const SESSION_EXPIRATION_WARNING_TIME = 300000 // 5 minutes

export const navigation = Object.freeze({
  CHILD_LIST: 'CHILD_LIST',
  CHILD_PROFILE: 'CHILD_PROFILE',
  CHILD_PROFILE_EDIT: 'CHILD_PROFILE_EDIT',
  CHILD_PROFILE_ADD: 'CHILD_PROFILE_ADD',
  ASSESSMENT_ADD: 'ASSESSMENT_ADD',
  ASSESSMENT_EDIT: 'ASSESSMENT_EDIT',
  ASSESSMENT_CHANGELOG: 'ASSESSMENT_CHANGELOG',
  CLIENT_SEARCH: 'CLIENT_SEARCH',
  STAFF_LIST: 'STAFF_LIST',
  STAFF_READ: 'STAFF_READ',
})

export const ClientStatus = Object.freeze({
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  NO_PRIOR_CANS: 'No prior CANS',
})

export const permissions = Object.freeze({
  SUBORDINATES_READ: 'CANS-staff-person-subordinates-read',
  CLIENTS_READ: 'CANS-staff-person-clients-read',
  CLIENT_SEARCH: 'CANS-client-search',
})

export const dashboards = Object.freeze({
  CHILD_LIST: 'CHILD_LIST',
  CLIENT_SEARCH: 'CLIENT_SEARCH',
  STAFF_LIST: 'STAFF_LIST',
})
