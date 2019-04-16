import React from 'react'
import PropTypes from 'prop-types'
import CheckedRadio from '../printUtil/CheckedRadio'
import UncheckedRadio from '../printUtil/UncheckedRadio'
import { headerOptionsContainer, headerOptionLabel } from './PrintAssessmentStyle'

const PrintAssessmentHeaderOptions = ({ isChecked }) => {
  return (
    <div style={headerOptionsContainer}>
      <div style={headerOptionLabel}>Yes</div>
      <div id="header-options-first">{isChecked ? <CheckedRadio /> : <UncheckedRadio />}</div>
      <div style={headerOptionLabel}>No</div>
      <div id="header-options-second">{!isChecked ? <CheckedRadio /> : <UncheckedRadio />}</div>
    </div>
  )
}

PrintAssessmentHeaderOptions.propTypes = {
  isChecked: PropTypes.bool,
}

PrintAssessmentHeaderOptions.defaultProps = {
  isChecked: undefined,
}

export default PrintAssessmentHeaderOptions
