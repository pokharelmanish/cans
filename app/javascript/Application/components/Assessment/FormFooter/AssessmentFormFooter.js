import React from 'react'
import PropTypes from 'prop-types'
import './style.sass'
import * as ReassessmentHelper from '../ReassessmentHelper'
import FooterControls from './FooterControls'

const getUnderSix = assessment => assessment && assessment.state && assessment.state.under_six

const AssessmentFormFooter = ({ assessment, isEditable, onCancelClick, isSubmissionEnabled, onSubmitAssessment }) => {
  if (!isEditable) return null
  const isUnderSix = getUnderSix(assessment)
  if (isUnderSix === undefined || isUnderSix === null) return null
  const isReviewNeeded = Boolean(assessment.preceding_assessment_id)
  const isDomainsReviewMessageShown = isReviewNeeded
    ? ReassessmentHelper.containsNotReviewedDomains(assessment.state.domains, isUnderSix)
    : false
  return (
    <div className="form-footer">
      {isDomainsReviewMessageShown ? (
        <span id="domains-review-needed-msg" className="text-centered">
          <span className="text-bold">All domains must be reviewed</span>
          <br /> before the complete button becomes active
        </span>
      ) : (
        <FooterControls
          isSubmissionEnabled={isSubmissionEnabled}
          onSubmitAssessment={onSubmitAssessment}
          isEditable={isEditable}
          onCancelClick={onCancelClick}
          isReviewNeeded={isReviewNeeded}
          assessmentStatus={assessment.status}
        />
      )}
    </div>
  )
}

AssessmentFormFooter.propTypes = {
  assessment: PropTypes.object,
  isEditable: PropTypes.bool,
  isSubmissionEnabled: PropTypes.bool,
  onCancelClick: PropTypes.func.isRequired,
  onSubmitAssessment: PropTypes.func.isRequired,
}

AssessmentFormFooter.defaultProps = {
  assessment: {},
  isSubmissionEnabled: undefined,
  isEditable: false,
}

export default AssessmentFormFooter
