import React from 'react'
import PropTypes from 'prop-types'

const CategoryHeader = props => {
  return (
    <div className="cat-header-container">
      <svg height="50px" width="100%">
        <rect width="100%" height="50px" style={{ fill: '#dfdfdf' }} />
        <text fontSize="19px" fill="black">
          <tspan dy="33px" x="0" dx="10px">
            {props.title}
          </tspan>
        </text>
      </svg>
    </div>
  )
}

CategoryHeader.propTypes = {
  title: PropTypes.string.isRequired,
}

export default CategoryHeader
