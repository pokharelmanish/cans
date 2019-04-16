import React from 'react'
import PropTypes from 'prop-types'

const PrintDomainCommentHeader = props => {
  return (
    <svg height="40px" width="100%">
      <rect width="100%" height="40" style={{ fill: '#f3f6f7' }} />
      <text fontSize="16px" fill="black" fontWeight="900">
        <tspan dy="25" x="0" dx="10">
          {props.text} Comment:
        </tspan>
      </text>
    </svg>
  )
}

PrintDomainCommentHeader.propTypes = {
  text: PropTypes.string.isRequired,
}

export default PrintDomainCommentHeader
