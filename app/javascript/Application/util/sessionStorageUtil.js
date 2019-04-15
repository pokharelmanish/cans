export const ASSESSMENT_CHANGELOG_PAGE_SIZE_KEY = 'ASSESSMENT_CHANGELOG_PAGE_SIZE_KEY'
export const ASSESSMENT_HISTORY_PAGE_SIZE_KEY = 'ASSESSMENT_HISTORY_PAGE_SIZE_KEY'
export const CLIENT_LIST_PAGE_SIZE_KEY = 'CLIENT_LIST_PAGE_SIZE_KEY'
export const STAFF_LIST_PAGE_SIZE_KEY = 'STAFF_LIST_PAGE_SIZE_KEY'
const CANS_PREFIX = 'CANS_'

export function getIntItem(key) {
  const stringValue = sessionStorage.getItem(CANS_PREFIX + key)
  return stringValue ? parseInt(stringValue) : null
}

export function setItem(key, value) {
  return sessionStorage.setItem(CANS_PREFIX + key, value)
}

export function clearStorage() {
  sessionStorage.clear()
}
