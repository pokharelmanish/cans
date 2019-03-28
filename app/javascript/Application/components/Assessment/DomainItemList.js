import React from 'react'
import { getI18nByCode } from '../common/I18nHelper'
import Item from './Item'
import { shouldItemBeRendered } from './AssessmentHelper'
import Divider from '@material-ui/core/Divider'
import PropTypes from 'prop-types'

const DomainItemList = props => {
  return props.items.map((item, index) => {
    const { code } = item
    const itemI18n = getI18nByCode(props.i18nAll, code)
    const isAssessmentUnderSix = props.isAssessmentUnderSix
    return shouldItemBeRendered(isAssessmentUnderSix, item) ? (
      <div key={`${code}`}>
        <Item
          key={`${index}-${code}`}
          item={item}
          caregiverIndex={props.caregiverIndex}
          i18n={itemI18n}
          onRatingUpdate={props.onRatingUpdate}
          onCommentUpdate={props.onItemCommentUpdate}
          onConfidentialityUpdate={props.onConfidentialityUpdate}
          isAssessmentUnderSix={isAssessmentUnderSix}
          isCompletedAssessment={props.isCompletedAssessment}
          canReleaseConfidentialInfo={props.canReleaseConfidentialInfo}
          disabled={props.disabled}
          previousRating={props.previousRatingsMap[code]}
        />
        <Divider />
      </div>
    ) : null
  })
}

DomainItemList.propTypes = {
  canReleaseConfidentialInfo: PropTypes.bool.isRequired,
  caregiverIndex: PropTypes.string,
  disabled: PropTypes.bool,
  i18nAll: PropTypes.object.isRequired,
  isAssessmentUnderSix: PropTypes.bool.isRequired,
  isCompletedAssessment: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  onConfidentialityUpdate: PropTypes.func.isRequired,
  onItemCommentUpdate: PropTypes.func.isRequired,
  onRatingUpdate: PropTypes.func.isRequired,
  previousRatingsMap: PropTypes.object,
}

DomainItemList.defaultProps = {
  caregiverIndex: undefined,
  disabled: false,
  previousRatingsMap: {},
}

export default DomainItemList
