import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import PrintOptions from './PrintOptions'
import {
  itemStyle,
  itemComment,
  itemTitleWrapper,
  itemTitle,
  flex,
  optionLabelStyle,
  itemMainLine,
} from './PrintAssessmentStyle'
import { stripeGenerator } from '../printUtil/PrintHelper'
import { isConfidential, isDiscretionNeeded } from './PrintAssessmentHelper'

class PrintItem extends PureComponent {
  isItemHidden = item => isConfidential(item) || isDiscretionNeeded(item)
  renderPrintOptions = (item, isRegularType) => {
    return !this.isItemHidden(item) ? <PrintOptions item={item} isRegularType={isRegularType} /> : null
  }
  renderRedaction = item => {
    let result
    if (item.confidential_by_default) return 'Confidential'
    if (item.confidential) {
      result = 'Use discretion'
    } else {
      result = null
    }
    return result
  }
  render() {
    const { item, index, caregiverIndex, itemI18n, isAssessmentUnderSix } = this.props
    const title = itemI18n._title_ || ''
    const itemNumber = isAssessmentUnderSix ? item.under_six_id : item.above_six_id
    const isRegularType = item.rating_type === 'REGULAR'
    const stripe = stripeGenerator(index)
    return (
      <div
        id="item-container"
        key={caregiverIndex + itemNumber}
        style={itemStyle}
        className={`item-container ${stripe.containerStyle}`}
      >
        {stripe.headerBg}
        <div style={itemMainLine} className={`${stripe.contentStyle}`}>
          <div style={itemTitleWrapper}>
            <div style={itemTitle}>
              {itemNumber}
              {caregiverIndex}. {title}
            </div>
          </div>
          <div style={flex}>
            <div style={itemTitleWrapper}>
              <div style={optionLabelStyle}>{this.renderRedaction(item)}</div>
            </div>
          </div>
          {this.renderPrintOptions(item, isRegularType)}
        </div>
        {item.comment && !this.isItemHidden(item) ? (
          <div id="itemComment" style={itemComment}>
            {item.comment}
          </div>
        ) : null}
      </div>
    )
  }
}

PrintItem.propTypes = {
  caregiverIndex: PropTypes.string,
  index: PropTypes.number.isRequired,
  isAssessmentUnderSix: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  itemI18n: PropTypes.object.isRequired,
}

PrintItem.defaultProps = {
  caregiverIndex: '',
}

export default PrintItem
