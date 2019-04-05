import React from 'react'
import PropTypes from 'prop-types'
import { DomainsPropType, isStrengthsDomain } from './DomainHelper'
import SummaryGrid from './SummaryGrid'
import DataGridHeader from '../../common/DataGridHeader'

const hasTargetRating = item => item.rating === 0 || item.rating === 1
const tooltip = 'Ratings of 0 or 1 in the Strengths Domain. These are central or useful in planning.'

const StrengthsSummary = ({ domains, i18n }) => (
  <SummaryGrid
    domainFilter={isStrengthsDomain}
    domains={domains}
    header={<DataGridHeader title="Strengths" tooltip={tooltip} index="id2" />}
    i18n={i18n}
    itemFilter={hasTargetRating}
  />
)

StrengthsSummary.propTypes = {
  domains: DomainsPropType,
  i18n: PropTypes.object.isRequired,
}

StrengthsSummary.defaultProps = {
  domains: [],
}

export default StrengthsSummary
