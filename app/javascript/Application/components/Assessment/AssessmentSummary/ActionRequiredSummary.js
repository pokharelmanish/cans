import React from 'react'
import PropTypes from 'prop-types'
import { DomainsPropType, isNeedsDomain } from './DomainHelper'
import SummaryGrid from './SummaryGrid'
import SummaryHeader from './SummaryHeader'

const hasTargetRating = item => item.rating === 2
const tooltip =
  'Ratings of 2 from all domains except Strengths. This rating indicates that this need interferes with functioning.'

const ActionRequiredSummary = ({ domains, i18n }) => (
  <SummaryGrid
    domainFilter={isNeedsDomain}
    domains={domains}
    header={<SummaryHeader title="Action Required" tooltip={tooltip} />}
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
