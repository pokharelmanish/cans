import moment from 'moment'
import { ISO_DATE_FORMAT, LOCAL_DATE_FORMAT } from './constants'

/**
 * Returns moment object with today's date (no hours, minutes, seconds, milliseconds)
 * @returns {moment.Moment}
 */
export const today = () => moment({ hours: 0 })

/**
 * Returns a formatted local datetime
 * @param {string} datetime ISO8601 datetime
 * @returns {string}
 */
export function isoToLocalDate(datetime) {
  if (datetime === null) {
    return datetime
  }
  return moment(datetime, ISO_DATE_FORMAT).format(LOCAL_DATE_FORMAT)
}

/**
 * Returns a formatted ISO8601 date
 * @param {string}
 * @returns {string}
 */
export function localToIsoDate(date) {
  if (date === null) {
    return date
  }
  return moment(date, LOCAL_DATE_FORMAT).format(ISO_DATE_FORMAT)
}

/**
 * Transforms JS Date object to ISO formatted date string
 * @param {Date} Javascript Date object
 * @returns {string} ISO formatted 'YYYY-MM-DD' date string
 */
export function jsDateToIso(value) {
  if (value === null) {
    return value
  }
  if (!(value instanceof Date)) {
    return 'Invalid date'
  }
  return moment(value).format(ISO_DATE_FORMAT)
}

/**
 * Transforms ISO formatted date staring to JS Date object
 * @param {string} ISO formatted 'YYYY-MM-DD' date string
 * @returns {Date} Javascript Date object
 */
export function isoToJsDate(value) {
  if (value === null) {
    return value
  }
  if (isValidIsoDate(value)) {
    return moment(value, ISO_DATE_FORMAT).toDate()
  }
  return null
}

/**
 * Validates whether input string is a valid ISO formatted date
 * @param value {string} Any string
 * @param strict {boolean} is strict check
 * @returns {boolean} True if input string is a valid ISO formatted date
 */
export function isValidIsoDate(value, strict = false) {
  return moment(value, ISO_DATE_FORMAT, strict).isValid()
}

/**
 * Validates whether input string is a valid Local formatted date
 * @param value {string} Any string
 * @param strict {boolean} is strict check
 * @returns {boolean}
 */
export function isValidLocalDate(value, strict = false) {
  return moment(value, LOCAL_DATE_FORMAT, strict).isValid()
}

/**
 * Returns current date as ISO formatted date
 * @returns {string} ISO formatted current date
 */
export function getCurrentIsoDate() {
  return moment().format(ISO_DATE_FORMAT)
}

/**
 * Checks if date is in future
 * @param date
 * @returns {boolean}
 */
export function isFutureDate(date) {
  date = isValidIsoDate(date, true) ? date : localToIsoDate(date)
  return moment().isSameOrBefore(date)
}

/**
 * Validates date according to configuration
 * @param date
 * @param config
 * @returns {boolean}
 */
export function isValidDate(date, config = { allowFutureDate: true }) {
  const valid = isValidLocalDate(date, true) || isValidIsoDate(date, true)
  return valid && (config.allowFutureDate || !isFutureDate(date))
}

/**
 * Convert string to ISO date or returns null
 * @param str
 * @returns {string} or null
 */
export function localToIsoDateOrNull(str) {
  if (isValidLocalDate(str, true)) {
    return localToIsoDate(str)
  }
  return null
}

/**
 * Calculates date differece in years
 * @param startDate Valid start date (ISO date string, moment or JS Date)
 * @param endDate Valid end date  (ISO date string, moment or JS Date)
 * @returns {number}
 */
export function calculateDateDifferenceInYears(startDate, endDate) {
  if (!isValidIsoDate(startDate) || !isValidIsoDate(endDate)) {
    return null
  }
  const duration = moment.duration(moment(endDate).diff(moment(startDate)))
  return Math.floor(duration.asYears())
}
