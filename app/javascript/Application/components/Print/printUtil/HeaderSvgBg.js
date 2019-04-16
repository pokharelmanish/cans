import React from 'react'
import PropTypes from 'prop-types'

const HeaderSvgBg = ({ height = '46px', color = '#f3f6f7' }) => {
  return (
    <svg height={height} width="100%">
      <rect width="100%" height={height} style={{ fill: color }} />
    </svg>
  )
}

HeaderSvgBg.propTypes = {
  color: PropTypes.string,
  height: PropTypes.string,
}

HeaderSvgBg.defaultProps = {
  height: '46px',
  color: '#f3f6f7',
}

export default HeaderSvgBg
