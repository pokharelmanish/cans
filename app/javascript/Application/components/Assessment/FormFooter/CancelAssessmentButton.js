import React from 'react'
import { Button } from '@cwds/components'
import PropTypes from 'prop-types'

const CancelAssessmentButton = ({ onCancelClick }) => (
  <Button id="cancel-assessment" color="secondary" className="no-uppercase footer-button-space" onClick={onCancelClick}>
    Cancel
  </Button>
)

CancelAssessmentButton.propTypes = {
  onCancelClick: PropTypes.func.isRequired,
}

export default CancelAssessmentButton
