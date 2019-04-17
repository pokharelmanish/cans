import React from 'react'
import PropTypes from 'prop-types'

const PrintDomainCommentHeader = props => {
  return (
    <svg height="40px" width="100%">
      <rect width="100%" height="40" style={{ fill: '#f3f6f7' }} />
      <text
        id="comment-header-left"
        fontSize="16"
        fontWeight="900"
        fill="#000000"
        x="1%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="start"
      >
        {props.text} Comment:
      </text>
      <text
        id="comment-header-right"
        fontSize="16"
        fontWeight="900"
        fill="#000000"
        x="99%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="end"
      >
        {props.remark}
      </text>
    </svg>
  )
}

PrintDomainCommentHeader.propTypes = {
  remark: PropTypes.string,
  text: PropTypes.string.isRequired,
}

PrintDomainCommentHeader.defaultProps = {
  remark: '',
}

export default PrintDomainCommentHeader
