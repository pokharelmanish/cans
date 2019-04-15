import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { optionStyle, optionLabelStyle, flex, optionLabelText } from './PrintAssessmentStyle'
import CheckedRadio from '../printUtil/CheckedRadio'
import UncheckedRadio from '../printUtil/UncheckedRadio'

class PrintOptions extends PureComponent {
  renderOption = (isChecked, label) => (
    <div style={optionStyle}>
      <span style={optionLabelStyle}>
        {isChecked ? <CheckedRadio /> : <UncheckedRadio />}
        <div style={optionLabelText}>{label}</div>
      </span>
    </div>
  )
  render() {
    const { item, isRegularType } = this.props
    const optionCodes = {
      notApplicable: 8,
      value0orNo: 0,
      value1orYes: 1,
      value2: 2,
      value3: 3,
    }
    return (
      <div style={flex}>
        {item.has_na_option && this.renderOption(item.rating === optionCodes.notApplicable, `${' '}N/A`)}
        {this.renderOption(item.rating === optionCodes.value0orNo, isRegularType ? '0' : 'No')}
        {this.renderOption(item.rating === optionCodes.value1orYes, isRegularType ? '1' : 'Yes')}
        {isRegularType && this.renderOption(item.rating === optionCodes.value2, '2')}
        {isRegularType && this.renderOption(item.rating === optionCodes.value3, '3')}
      </div>
    )
  }
}

PrintOptions.propTypes = {
  isRegularType: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
}

export default PrintOptions
