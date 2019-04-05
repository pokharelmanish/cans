import React from 'react'
import PropTypes from 'prop-types'
import { DomainsPropType, isNeedsDomain, isBehavioralNeedsDomain } from './DomainHelper'
import SummaryGrid from './SummaryGrid'
import DataGridHeader from '../../common/DataGridHeader'

const hasTargetRating = (item, domain) => item.rating === 2 || (isBehavioralNeedsDomain(domain) && item.rating === 1)
const tooltip =
  'Includes a rating of 1 from the Behavioral/Emotional domain and ratings of 2 from all needs domains. These ratings indicate that this need interferes with functioning.'

const ActionRequiredSummary = ({ domains, i18n }) => (
  <SummaryGrid
    domainFilter={isNeedsDomain}
    domains={domains}
    header={<DataGridHeader title="Action Required" tooltip={tooltip} index="id3" />}
    i18n={i18n}
    itemFilter={hasTargetRating}
  />
)

ActionRequiredSummary.propTypes = {
  domains: DomainsPropType,
  i18n: PropTypes.object.isRequired,
}

ActionRequiredSummary.defaultProps = {
  domains: [],
}

export default ActionRequiredSummary
