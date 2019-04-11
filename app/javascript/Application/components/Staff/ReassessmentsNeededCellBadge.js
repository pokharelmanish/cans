import React from 'react'
import PropTypes from 'prop-types'
import './style.sass'
import { Badge } from '@cwds/components'

const ReassessmentsNeededCellBadge = ({ color, number }) => (
  <div className="reassess-needed-badge">
    {number ? (
      <Badge pill color={color}>
        {number}
      </Badge>
    ) : (
      0
    )}
  </div>
)

ReassessmentsNeededCellBadge.propTypes = {
  color: PropTypes.oneOf(['warning', 'danger']).isRequired,
  number: PropTypes.number,
}

ReassessmentsNeededCellBadge.defaultProps = {
  number: 0,
}

export default ReassessmentsNeededCellBadge
