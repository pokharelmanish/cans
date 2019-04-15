import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from '@cwds/components'

const ReassessmentsNeededCell = ({ value }) =>
  value.number ? (
    <Badge pill color={value.color}>
      {value.number}
    </Badge>
  ) : (
    0
  )

ReassessmentsNeededCell.propTypes = {
  value: PropTypes.shape({
    color: PropTypes.oneOf(['warning', 'danger']).isRequired,
    number: PropTypes.number.isRequired,
  }).isRequired,
}

export default ReassessmentsNeededCell
