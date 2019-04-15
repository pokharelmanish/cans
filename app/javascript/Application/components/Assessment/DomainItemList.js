import React from 'react'
import { getI18nByCode } from '../common/I18nHelper'
import Item from './Item'
import { shouldItemBeRendered } from './AssessmentHelper'
import { buildItemUniqueKey } from './ReassessmentHelper'
import Divider from '@material-ui/core/Divider'
import PropTypes from 'prop-types'

class DomainItemList extends React.PureComponent {
  render() {
    return this.props.items.map((item, index) => {
      const code = item.code
      const itemI18n = getI18nByCode(this.props.i18nAll, code)
      const isAssessmentUnderSix = this.props.isAssessmentUnderSix
      const itemUniqueKey = buildItemUniqueKey(code, this.props.caregiverIndex)
      const previousRating = (this.props.previousRatingsMap[itemUniqueKey] || {}).rating
      return shouldItemBeRendered(isAssessmentUnderSix, item) ? (
        <div key={`${code}`}>
          <Item
            key={`${index}-${code}`}
            item={item}
            caregiverIndex={this.props.caregiverIndex}
            i18n={itemI18n}
            onRatingUpdate={this.props.onRatingUpdate}
            onCommentUpdate={this.props.onItemCommentUpdate}
            onConfidentialityUpdate={this.props.onConfidentialityUpdate}
            isAssessmentUnderSix={isAssessmentUnderSix}
            isCompletedAssessment={this.props.isCompletedAssessment}
            canReleaseConfidentialInfo={this.props.canReleaseConfidentialInfo}
            disabled={this.props.disabled}
            previousRating={previousRating}
          />
          <Divider />
        </div>
      ) : null
    })
  }
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
