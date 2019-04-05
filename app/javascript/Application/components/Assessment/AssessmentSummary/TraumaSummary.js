import React from 'react'
import PropTypes from 'prop-types'
import { DomainsPropType, isTraumaDomain } from './DomainHelper'
import SummaryGrid from './SummaryGrid'
import DataGridHeader from '../../common/DataGridHeader'

const hasTargetRating = item => item.rating === 1
const tooltip = 'Includes all "Yes" ratings from the Potentially Traumatic/Adverse Childhood Experiences module.'

const TraumaSummary = ({ domains, i18n }) => (
  <SummaryGrid
    domainFilter={isTraumaDomain}
    domains={domains}
    header={<DataGridHeader title="Trauma" tooltip={tooltip} index="id4" />}
    i18n={i18n}
    itemFilter={hasTargetRating}
  />
)

TraumaSummary.propTypes = {
  domains: DomainsPropType,
  i18n: PropTypes.object.isRequired,
}

TraumaSummary.defaultProps = {
  domains: [],
}

export default TraumaSummary
