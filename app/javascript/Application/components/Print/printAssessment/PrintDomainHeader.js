import React from 'react'
import PropTypes from 'prop-types'

const PrintDomainHeader = props => {
  return (
    <svg height="50px" width="100%">
      <rect width="100%" height="50px" style={{ fill: '#f3f6f7' }} />
      <text fontSize="16px" fill="black" x="1%" y="50%" dominantBaseline="middle" textAnchor="start">
        {props.text}
      </text>
      <text fontSize="16px" fill="black" x="99%" y="50%" dominantBaseline="middle" textAnchor="end">
        Total:{props.total}
      </text>
    </svg>
  )
}

PrintDomainHeader.propTypes = {
  text: PropTypes.string.isRequired,
  total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default PrintDomainHeader
