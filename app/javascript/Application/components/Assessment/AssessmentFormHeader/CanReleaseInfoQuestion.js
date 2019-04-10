import React from 'react'
import PropTypes from 'prop-types'
import RadioGroupMessageBox from './RadioGroupMessageBox'

const CanReleaseInfoQuestion = ({ canReleaseConfidentialInfo, isDisabled, message, onCanReleaseInfoChange }) => {
  return (
    <RadioGroupMessageBox
      isDisabled={isDisabled}
      legend="Authorization for release of information on file? *"
      message={message}
      name="can_release_confidential_info"
      onChange={onCanReleaseInfoChange}
      value={canReleaseConfidentialInfo || false}
    />
  )
}

CanReleaseInfoQuestion.propTypes = {
  canReleaseConfidentialInfo: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
  message: PropTypes.node,
  onCanReleaseInfoChange: PropTypes.func.isRequired,
}

CanReleaseInfoQuestion.defaultProps = {
  assessment: null,
  message: null,
  isDisabled: undefined,
}

export default CanReleaseInfoQuestion
