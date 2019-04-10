import React from 'react'
import PropTypes from 'prop-types'
import RadioGroupMessageBox from './RadioGroupMessageBox'

const HasCaregiverQuestion = ({ hasCaregiver, onHasCaregiverChange, onHasCaregiverNoClicked, disabled }) => (
  <RadioGroupMessageBox
    isDisabled={disabled}
    legend="Child/Youth has Caregiver? *"
    message="You will be able to add and remove caregiver names from the CANS form in the Caregiver Resources and Needs domain."
    name="has_caregiver"
    onChange={onHasCaregiverChange}
    onNoClicked={onHasCaregiverNoClicked}
    value={hasCaregiver}
  />
)

HasCaregiverQuestion.propTypes = {
  disabled: PropTypes.bool,
  hasCaregiver: PropTypes.bool.isRequired,
  onHasCaregiverChange: PropTypes.func.isRequired,
  onHasCaregiverNoClicked: PropTypes.func.isRequired,
}

HasCaregiverQuestion.defaultProps = {
  disabled: false,
}

export default HasCaregiverQuestion
