import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { UNSET_RATING, NA_RATING, isNARating } from './ItemHelper'
import { getI18nValuesByPrefix } from '../../common/I18nHelper'
import { stringify } from '../../../util/common'

import { expandingThenScroll, itemRatingOptionsAmount } from '../../../util/assessmentAutoScroll'

import ItemInner from './ItemInner'

const initI18nValue = i18n => ({
  title: (i18n._title_ || '').toUpperCase(),
  description: i18n._description_ || 'No Description',
  qtcDescriptions: getI18nValuesByPrefix(i18n, '_to_consider_.'),
  ratingDescriptions: getI18nValuesByPrefix(i18n, '_rating_.'),
})

/* eslint-disable camelcase */
class Item extends Component {
  constructor(props) {
    super(props)
    const i18nValues = initI18nValue(props.i18n)
    this.state = {
      isExpanded: false,
      ...i18nValues,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const i18nValues = initI18nValue(nextProps.i18n)
    this.setState({
      ...i18nValues,
    })
  }

  handleKeyCheck = event => {
    if (event.key !== 'Tab') {
      this.switchExpandedState()
    }
  }

  handleRatingChange = onChangeEvent => {
    const code = this.props.item.code
    const caregiverIndex = this.props.caregiverIndex
    const newValue = parseInt(onChangeEvent.target.value)
    this.props.onRatingUpdate(code, newValue, caregiverIndex)
  }

  handleCommentChange = comment => {
    const code = this.props.item.code
    const caregiverIndex = this.props.caregiverIndex
    this.props.onCommentUpdate(code, comment, caregiverIndex)
  }

  // once NaCheckbox is checked, the value will be change back to noRating
  handleNaValueSetting = rating => {
    let naValue
    if (isNARating(rating)) {
      naValue = UNSET_RATING
    } else {
      naValue = NA_RATING
    }
    return stringify(naValue)
  }

  handleConfidentialityChange = onChangeEvent => {
    const code = this.props.item.code
    const caregiverIndex = this.props.caregiverIndex
    const oldValue = onChangeEvent.target.value === 'true'
    this.props.onConfidentialityUpdate(code, !oldValue, caregiverIndex)
  }

  switchExpandedState = event => {
    this.setState({ isExpanded: !this.state.isExpanded })
    if (event) {
      expandingThenScroll(
        event,
        this.state.isExpanded,
        itemRatingOptionsAmount(this.props.item.rating_type),
        this.props.disabled
      )
    }
  }

  render = () => {
    const { item, isAssessmentUnderSix, caregiverIndex, disabled, canReleaseConfidentialInfo } = this.props
    const {
      code,
      rating_type,
      has_na_option,
      rating,
      confidential: isConfidential,
      confidential_by_default,
      under_six_id,
      above_six_id,
      comment,
    } = item
    const itemNumber = isAssessmentUnderSix ? under_six_id : above_six_id
    const { isExpanded, title, description, qtcDescriptions, ratingDescriptions } = this.state
    const isBooleanRating = rating_type === 'BOOLEAN'
    const propsResource = {
      item,
      isAssessmentUnderSix,
      caregiverIndex,
      disabled,
      canReleaseConfidentialInfo,
      code,
      rating_type,
      hasNaOption: has_na_option,
      rating,
      isConfidential,
      isConfidentialByDefault: confidential_by_default,
      under_six_id,
      above_six_id,
      comment,
      itemNumber,
      isExpanded,
      title,
      description,
      qtcDescriptions,
      ratingDescriptions,
      isBooleanRating,
      previousRating: this.props.previousRating,
      isCompletedAssessment: this.props.isCompletedAssessment,
      handleRatingChange: this.handleRatingChange,
      handleConfidentialityChange: this.handleConfidentialityChange,
      handleNaValueSetting: this.handleNaValueSetting,
      switchExpandedState: this.switchExpandedState,
      handleKeyCheck: this.handleKeyCheck,
      handleCommentChange: this.handleCommentChange,
      maxCommentLength: 250,
    }
    return <ItemInner {...propsResource} />
  }
}
/* eslint-enable camelcase */

Item.propTypes = {
  canReleaseConfidentialInfo: PropTypes.bool.isRequired,
  caregiverIndex: PropTypes.string,
  disabled: PropTypes.bool,
  i18n: PropTypes.object.isRequired,
  isAssessmentUnderSix: PropTypes.bool.isRequired,
  isCompletedAssessment: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  onCommentUpdate: PropTypes.func.isRequired,
  onConfidentialityUpdate: PropTypes.func.isRequired,
  onRatingUpdate: PropTypes.func.isRequired,
  previousRating: PropTypes.number,
}

Item.defaultProps = {
  caregiverIndex: undefined,
  disabled: false,
  previousRating: undefined,
}
export default Item
