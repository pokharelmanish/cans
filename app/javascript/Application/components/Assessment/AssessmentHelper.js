import { getCurrentIsoDate, calculateDateDifferenceInYears } from '../../util/dateHelper'
import moment from 'moment'
import { globalAlertService } from '../../util/GlobalAlertService'
import { urlTrimmer } from '../../util/urlTrimmer'
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { isEmpty } from '../../util/common'

export const AssessmentType = Object.freeze({
  initial: 'INITIAL',
  subsequent: 'SUBSEQUENT',
  annual: 'ANNUAL',
  discharge: 'DISCHARGE',
  adminClose: 'ADMINISTRATIVE_CLOSE',
})

export const AssessmentStatus = Object.freeze({
  inProgress: 'IN_PROGRESS',
  completed: 'COMPLETED',
  approved: 'APPROVED',
  deleted: 'DELETED',
})

export const defaultEmptyAssessment = {
  event_date: getCurrentIsoDate(),
  has_caregiver: true,
  state: {
    domains: [],
  },
}

export function validateAssessmentForSubmit(assessment) {
  return validateAssessmentDtoFields(assessment) && validateAssessmentState(assessment.state)
}

function validateAssessmentDtoFields(assessmentDto) {
  return (
    isDefined(assessmentDto.event_date) &&
    validateAssessmentEventDate(assessmentDto.person.dob, assessmentDto.event_date) &&
    isDefined(assessmentDto.assessment_type) &&
    isDefined(assessmentDto.completed_as) &&
    isDefined(assessmentDto.has_caregiver)
  )
}

function validateAssessmentState(assessment) {
  return isDefined(assessment.under_six) && areItemsValid(assessment) && validateCaregiverDomainName(assessment)
}

export function validateAssessmentEventDate(dob, eventDate) {
  if (!eventDate) return false
  if (!dob) return true
  return moment(dob).isSameOrBefore(moment(eventDate))
}

function isDefined(value) {
  return typeof value !== 'undefined' && value !== null && value !== ''
}

export function validateCaregiverDomainName(assessment) {
  const isCaregiverNamePresent = assessment.domains
    .filter(domain => domain.is_caregiver_domain === true)
    .map(e => (e.caregiver_name !== undefined ? e.caregiver_name.trim() : ''))
    .every(e => e)
  return isCaregiverNamePresent
}

function areItemsValid(assessment) {
  const isUnderSix = Boolean(assessment.under_six)
  const requiredItems = assessment.domains
    .filter(domain => shouldDomainBeRendered(isUnderSix, domain))
    .reduce((items, domain) => items.concat(domain.items), [])
    .filter(item => shouldItemBeRendered(isUnderSix, item))
  const itemsWithNoRating = requiredItems.filter(item => item.rating === -1)
  return itemsWithNoRating.length === 0
}

export function resetConfidentialByDefaultItems(assessment, value) {
  assessment.state.domains.map(domain => {
    domain.items.map(item => {
      if (item.confidential_by_default) {
        item.confidential = value
      }
    })
  })
  return assessment
}

export function shouldDomainBeRendered(isAssessmentUnderSix, domain) {
  if (isAssessmentUnderSix === null || isAssessmentUnderSix === undefined) {
    return false
  }
  return (isAssessmentUnderSix && domain.under_six) || (!isAssessmentUnderSix && domain.above_six)
}

export function shouldItemBeRendered(isAssessmentUnderSix, item) {
  return (isAssessmentUnderSix && item.under_six_id) || (!isAssessmentUnderSix && item.above_six_id)
}

export function containsNotReviewedDomains(domains, isUnderSix) {
  return Boolean(domains.find(domain => shouldDomainBeRendered(isUnderSix, domain) && !domain.is_reviewed))
}

export function getActionVerbByStatus(status) {
  switch (status) {
    case AssessmentStatus.inProgress:
      return 'Saved'
    case AssessmentStatus.completed:
      return 'Completed'
    case AssessmentStatus.deleted:
      return 'Deleted'
    default:
      return 'Updated'
  }
}

export function getDisplayAssessmentStatus(status) {
  switch (status) {
    case AssessmentStatus.inProgress:
      return 'In Progress'
    case AssessmentStatus.completed:
      return 'Completed'
    case AssessmentStatus.deleted:
      return 'Deleted'
    default:
      return 'Updated'
  }
}

export function sortAssessments(assessments) {
  if (!assessments || assessments.length === 0) return []
  return assessments
    .map(assessment => ({
      ...assessment,
      eventDateMoment: moment(assessment.event_date),
      createdTimestampMoment: moment(assessment.created_timestamp),
    }))
    .sort(
      (left, right) =>
        right.eventDateMoment.diff(left.eventDateMoment) || right.createdTimestampMoment - left.createdTimestampMoment
    )
}

export function trimUrlForClientProfile(url) {
  const urlArray = url.split('/')
  const targetIndex = urlArray.indexOf('assessments') // start
  const compare = urlArray.length - targetIndex // check if assessments is the ending or not
  const deleteCount = compare + 1
  const linkUrl = urlTrimmer(url, targetIndex, deleteCount)
  return linkUrl
}

export const successMsgFrom = Object.freeze({
  COMPLETE: 'COMPLETE',
  SAVE: 'SAVE',
})

export function postSuccessMessage(url, msgfrom) {
  const linkUrl = trimUrlForClientProfile(url)
  let message
  if (msgfrom === successMsgFrom.SAVE) {
    message = (
      <Fragment>
        Success! CANS assessment has been saved. <Link to={linkUrl}>Click here</Link> to return to Child/Youth profile.
      </Fragment>
    )
  } else if (msgfrom === successMsgFrom.COMPLETE) {
    message = (
      <Fragment>
        Success! CANS assessment has been completed. <Link to={linkUrl}>Click here</Link> to return to Child/Youth
        profile.
      </Fragment>
    )
  } else {
    message = 'error'
  }
  globalAlertService.postSuccess({ message })
}

export const INFO_GLOBAL_ALERT_ID = 'infoMessages'

export function postInfoMessage({ message, isAutoCloseable = false, componentId = INFO_GLOBAL_ALERT_ID, messageId }) {
  globalAlertService.postInfo({
    message,
    isAutoCloseable,
    componentId,
    messageId,
  })
}

export function postCloseMessage(messageId = undefined) {
  globalAlertService.closeAlert(messageId)
}

export const caregiverWarning = (
  <div>
    You are about to remove the <strong className="cargiver-text-block">caregiver</strong> from this Assessment.
  </div>
)

export const getCaregiverDomainsNumber = domains => {
  return domains.state.domains.filter(domain => {
    return domain.is_caregiver_domain === true
  }).length
}

export const handleCountyName = assessment => {
  return assessment.county ? assessment.county.name : null
}

export const updateUrlWithAssessment = (history, match, assessment) => {
  return history.replace(`${match.url}/${assessment.id}`)
}

export const selectOptions = [
  { value: 'Entered in error', label: 'Entered in error' },
  { value: 'Referral / Case closed', label: 'Referral / Case closed' },
  { value: 'Family refused', label: 'Family refused' },
  { value: 'Other', label: 'Other' },
]

export const blankPlaceHolder = { value: '', label: '' }

export const deleteWarningTitle = 'Choose or enter the reason for deleting this CANS.'

export const deleteWarningDescription = 'This cannot be undone.'

export const otherReasonLabel = 'Enter other reason. *'

export const reasonSelectLabel = 'Reason for deleting. *'

export const statusTextOfHistory = (status, isForTable) => {
  const text = getDisplayAssessmentStatus(status)
  return isForTable ? null : text
}

export const handlePrintButtonEnabled = state => {
  return Boolean(state.assessment.state.under_six !== undefined && state.isValidDate)
}

export function isSubsequentType(type) {
  return AssessmentType.subsequent === type
}

export const hasOneCompletedForReassessment = (assessments, clientCaseReferralNumber) => {
  if (!assessments || assessments.length === 0 || !clientCaseReferralNumber) return false
  return (
    assessments.filter(
      assessment => assessment.status === 'COMPLETED' && assessment.service_source_id === clientCaseReferralNumber
    ).length > 0
  )
}

export const getSubstanceUseItemsIds = assessment => {
  const underSix = []
  const aboveSix = []
  assessment.state.domains.forEach(domain => {
    domain.items.forEach(item => {
      if (item.confidential_by_default && !isEmpty(item.under_six_id)) {
        underSix.push(item.under_six_id.replace(/\D/g, ''))
      }
      if (item.confidential_by_default && !isEmpty(item.above_six_id)) {
        aboveSix.push(item.above_six_id.replace(/\D/g, ''))
      }
    })
  })
  return { underSix: underSix, aboveSix: aboveSix }
}

export const currentClientAge = dob => {
  return calculateDateDifferenceInYears(dob, getCurrentIsoDate())
}

export function preparePrecedingAssessment(precedingAssessment, eventDate, dob) {
  const SIX = 6

  precedingAssessment.event_date = eventDate
  precedingAssessment.status = 'IN_PROGRESS'
  precedingAssessment.can_release_confidential_info = false
  precedingAssessment.preceding_assessment_id = precedingAssessment.id
  precedingAssessment.state.under_six = currentClientAge(dob) < SIX
  delete precedingAssessment.id
  delete precedingAssessment.conducted_by
  precedingAssessment.state.domains.forEach(domain => {
    delete domain.comment
    delete domain.is_reviewed
    domain.items.forEach(item => {
      delete item.comment
    })
  })
}

export function createRatingsMap(domains) {
  const codeToRatingMap = {}
  domains.forEach(domain =>
    domain.items.forEach(item => {
      codeToRatingMap[item.code] = item.rating
    })
  )
  return codeToRatingMap
}
