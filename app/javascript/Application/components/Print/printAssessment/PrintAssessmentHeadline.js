import React from 'react'
import PropTypes from 'prop-types'
import CWDSlogo from '../printUtil/CWDSlogo'
import { headlineContainer, logo, headlineTitle, headlineAgeRange } from './PrintAssessmentStyle'

const PrintAssessmentHeadline = props => {
  return (
    <div id="headlineContainer" style={headlineContainer}>
      <div style={logo}>
        <CWDSlogo />
      </div>
      <div style={headlineTitle}>CARES - CANS {props.reassessmentInfo}</div>
      <div style={headlineAgeRange}>{props.ageRange} years</div>
    </div>
  )
}

PrintAssessmentHeadline.propTypes = {
  ageRange: PropTypes.string.isRequired,
  reassessmentInfo: PropTypes.string.isRequired,
}

export default PrintAssessmentHeadline
