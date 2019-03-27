import React from 'react'
import { Button } from '@cwds/components'
import PropTypes from 'prop-types'

const CompleteAssessmentButton = ({ onSubmitAssessment, disabled }) => (
  <Button
    id={'submit-assessment'}
    className={'no-uppercase'}
    color={'primary'}
    onClick={onSubmitAssessment}
    disabled={disabled}
  >
    Complete
  </Button>
)

CompleteAssessmentButton.propTypes = {
  disabled: PropTypes.bool,
  onSubmitAssessment: PropTypes.func.isRequired,
}

CompleteAssessmentButton.defaultProps = {
  disabled: false,
}

export default CompleteAssessmentButton
