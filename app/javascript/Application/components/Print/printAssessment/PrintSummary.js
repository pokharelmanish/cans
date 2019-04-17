import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { summaryContainer } from './PrintAssessmentStyle'
import CategoryHeader from '../printUtil/CategoryHeader'
import {
  isBehavioralNeedsDomain,
  isNeedsDomain,
  isStrengthsDomain,
  isTraumaDomain,
  itemsValue,
} from '../../Assessment/AssessmentSummary/DomainHelper'
import { getI18nByCode } from '../../common/I18nHelper'
import { PrintSummaryRecord } from './PrintSummaryRecord'

const STRENGTHS = 'Strengths'
const ACTION_REQUIRED = 'Action Required'
const IMMEDIATE_ACTION_REQUIRED = 'Immediate Action Required'
const TRAUMA = 'Trauma'
const RATING_0 = 0
const RATING_1 = 1
const RATING_2 = 2
const RATING_3 = 3
const strengthItemsFilter = item => (item.rating === RATING_0 || item.rating === RATING_1) && !item.confidential
const actionRequiredItemsFilter = (item, domain) =>
  (item.rating === RATING_2 || (isBehavioralNeedsDomain(domain) && item.rating === RATING_1)) && !item.confidential
const immediateActionRequiredItemsFilter = item => item.rating === RATING_3 && !item.confidential
const traumaItemsFilter = item => item.rating === RATING_1 && !item.confidential

class PrintSummary extends PureComponent {
  getCodes(domains, domainFilter, itemFilter) {
    const items = itemsValue(domains, domainFilter, itemFilter)

    const codes = items.map(item => {
      const code = getI18nByCode(this.props.i18n, item.code)
      return (code && code._title_) || ''
    })

    return codes
  }

  render() {
    const filteredDomains = this.props.domains.filter(
      domain => (this.props.isUnderSix ? domain.under_six : domain.above_six)
    )
    return (
      <div>
        {this.props.header}
        <CategoryHeader title="CANS Summary" />
        <div style={summaryContainer}>
          <PrintSummaryRecord
            items={this.getCodes(filteredDomains, isStrengthsDomain, strengthItemsFilter)}
            title={STRENGTHS}
          />
          <PrintSummaryRecord
            items={this.getCodes(filteredDomains, isNeedsDomain, actionRequiredItemsFilter)}
            title={ACTION_REQUIRED}
          />
          <PrintSummaryRecord
            items={this.getCodes(filteredDomains, isNeedsDomain, immediateActionRequiredItemsFilter)}
            title={IMMEDIATE_ACTION_REQUIRED}
          />
          <PrintSummaryRecord
            items={this.getCodes(filteredDomains, isTraumaDomain, traumaItemsFilter)}
            title={TRAUMA}
          />
        </div>
        {this.props.footer}
      </div>
    )
  }
}

PrintSummary.propTypes = {
  domains: PropTypes.array.isRequired,
  footer: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  i18n: PropTypes.object.isRequired,
  isUnderSix: PropTypes.bool.isRequired,
}

PrintSummary.defaultProps = {
  header: '',
  footer: '',
}

export default PrintSummary
