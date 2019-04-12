import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../style.sass'
import CompleteAssessmentButton from './CompleteAssessmentButton'
import ReviewConfirmation from './ReviewConfirmation'
import CancelAssessmentButton from './CancelAssessmentButton'
import { AssessmentStatus } from '../AssessmentHelper'

class FooterControls extends Component {
  state = { isReviewConfirmed: false }

  handleReviewConfirmedChange = event => {
    const oldValue = event.target.value === 'true'
    this.setState({ isReviewConfirmed: !oldValue })
  }

  render() {
    const { isEditable, isReviewNeeded, isSubmissionEnabled, onCancelClick, onSubmitAssessment } = this.props
    const isReviewConfirmed = this.state.isReviewConfirmed
    const isSubmitButtonEnabled = (isReviewNeeded ? isReviewConfirmed : true) && isSubmissionEnabled
    return (
      <div className={'align-footer-content'}>
        {isReviewNeeded &&
          isSubmissionEnabled && (
            <ReviewConfirmation
              isReviewConfirmed={isReviewConfirmed}
              onReviewConfirmedChange={this.handleReviewConfirmedChange}
            />
          )}
        {isEditable &&
          !isSubmissionEnabled && (
            <span>
              The Assessment Date and all assessment ratings must be completed before the{' '}
              {this.props.assessmentStatus === AssessmentStatus.completed ? 'Save' : 'Complete'} button becomes active.
            </span>
          )}
        <div className="footer-controls-btn-group">
          <CancelAssessmentButton onCancelClick={onCancelClick} />
          {this.props.assessmentStatus !== AssessmentStatus.completed && (
            <CompleteAssessmentButton onSubmitAssessment={onSubmitAssessment} disabled={!isSubmitButtonEnabled} />
          )}
        </div>
      </div>
    )
  }
}

FooterControls.propTypes = {
  assessmentStatus: PropTypes.string.isRequired,
  isEditable: PropTypes.bool.isRequired,
  isReviewNeeded: PropTypes.bool.isRequired,
  isSubmissionEnabled: PropTypes.bool.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onSubmitAssessment: PropTypes.func.isRequired,
}

export default FooterControls
