import React from 'react'
import PropTypes from 'prop-types'

const PrintAssessmentOverallFooter = props => {
  return !props.isFirefox ? (
    <svg height="30px" width="100%">
      <text fontSize="16px" fontWeight="100" fontStyle="italic" fill="#000000">
        <tspan dy="15px" x="0" dx="0">
          {props.text}
        </tspan>
      </text>
    </svg>
  ) : null
}

PrintAssessmentOverallFooter.propTypes = {
  isFirefox: PropTypes.bool.isRequired,
  text: PropTypes.string,
}
PrintAssessmentOverallFooter.defaultProps = {
  text: '',
}

export default PrintAssessmentOverallFooter
