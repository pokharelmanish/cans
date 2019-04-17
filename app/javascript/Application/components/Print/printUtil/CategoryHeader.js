import React from 'react'
import PropTypes from 'prop-types'

const CategoryHeader = props => {
  return (
    <div className="cat-header-container">
      <svg height="50px" width="100%">
        <rect width="100%" height="50px" style={{ fill: '#dfdfdf' }} />
        <text fontSize="19" fontWeight="900" fill="#000000" x="1%" y="50%" dominantBaseline="middle" textAnchor="start">
          {props.title}
        </text>
      </svg>
    </div>
  )
}

CategoryHeader.propTypes = {
  title: PropTypes.string.isRequired,
}

export default CategoryHeader
