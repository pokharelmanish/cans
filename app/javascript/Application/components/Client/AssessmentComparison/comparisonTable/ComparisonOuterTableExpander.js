import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@cwds/components'

const ComparisonOuterTableExpander = ({ isExpanded }) => {
  return isExpanded ? (
    <Icon className={'outer-table-expander-expanded'} icon="chevron-down" size="1x" />
  ) : (
    <Icon className={'outer-table-expander-collapsed'} icon="chevron-down" size="1x" rotation={270} />
  )
}

ComparisonOuterTableExpander.propTypes = {
  isExpanded: PropTypes.any,
}

ComparisonOuterTableExpander.defaultProps = {
  isExpanded: false,
}

export default ComparisonOuterTableExpander
