import { getCurrentIsoDate } from '../../util/dateHelper'
import moment from 'moment'
import { globalAlertService } from '../../util/GlobalAlertService'
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'

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
    isDefined(assessmentDto.assessment_type) &&
    isDefined(assessmentDto.completed_as) &&
    isDefined(assessmentDto.has_caregiver)
  )
}

function validateAssessmentState(assessment) {
  return isDefined(assessment.under_six) && areItemsValid(assessment)
}

function isDefined(value) {
  return typeof value !== 'undefined' && value !== null && value !== ''
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

export function resetConfidentialByDefaultItems(assessment) {
  assessment.state.domains.map(domain => {
    domain.items.map(item => {
      if (item.confidential_by_default) {
        item.confidential = true
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

export function getActionVerbByStatus(status) {
  switch (status) {
    case AssessmentStatus.inProgress:
      return 'Saved'
    case AssessmentStatus.completed:
      return 'Completed'
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
    default:
      return 'Updated'
  }
}

export function sortAssessmentsByDate(options) {
  const { assessments, sortEventDate, sortCreatedTimestamp, sortUpdatedTimestamp, direction } = options
  const newAssessmentList = assessments.map(assessment => {
    let timestamp

    if (sortEventDate) {
      timestamp = moment(assessment.event_date)
    } else if (sortCreatedTimestamp && sortUpdatedTimestamp) {
      timestamp = moment(assessment.updated_timestamp || assessment.created_timestamp)
    } else if (sortCreatedTimestamp && !sortUpdatedTimestamp) {
      timestamp = moment(assessment.created_timestamp)
    }

    return { ...assessment, timestamp }
  })
  newAssessmentList.sort((left, right) => {
    return direction === 'asc' ? left.timestamp.diff(right.timestamp) : right.timestamp.diff(left.timestamp)
  })
  return newAssessmentList
}

export function urlTrimmer(url, start, deleteCount) {
  if (!url) {
    return null
  }
  if (url.includes('/')) {
    const urlArray = url.split('/')
    urlArray.splice(start, deleteCount)
    return urlArray.join('/')
  } else {
    return url
  }
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

export const caregiverWarning = (
  <div>
    You are about to remove the <strong className="cargiver-text-block">caregiver</strong> from this Assessment.
  </div>
)

export const completeTip = (
  <Typography variant="headline" className={'submit-validation-message'}>
    The Assessment Date and all assessment ratings must be completed before the Complete button becomes active.
  </Typography>
)
