import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Toolbar from '@material-ui/core/Toolbar'
import Paper from '@material-ui/core/Paper'
import ItemToolbarControls from './ItemToolbarControls'
import ItemHeader from './ItemHeader'
import ItemDescription from './ItemDescription'

const ItemInner = props => {
  const itemHeaderProps = {
    code: props.code,
    isExpanded: props.isExpanded,
    onClick: props.switchExpandedState,
    onKeyDown: props.handleKeyCheck,
    itemNumber: props.itemNumber,
    caregiverIndex: props.caregiverIndex,
    title: props.title,
  }

  const toolbarControlsProps = {
    code: props.code,
    onRatingUpdate: props.handleRatingChange,
    disabled: props.disabled,
    isCompletedAssessment: props.isCompletedAssessment,
    isConfidential: props.isConfidential,
    isConfidentialByDefault: props.isConfidentialByDefault,
    canReleaseConfidentialInfo: props.canReleaseConfidentialInfo,
    handleConfidentialityChange: props.handleConfidentialityChange,
    handleNaValueSetting: props.handleNaValueSetting,
    comment: props.comment,
    previousRating: props.previousRating,
    ratingType: props.rating_type,
  }

  const itemDescriptionProps = {
    description: props.description,
    qtcDescriptions: props.qtcDescriptions,
    ratingDescriptions: props.ratingDescriptions,
    isBooleanRating: props.isBooleanRating,
    handleRatingChange: props.handleRatingChange,
    disabled: props.disabled,
    comment: props.comment,
    handleCommentChange: props.handleCommentChange,
    maxCommentLength: props.maxCommentLength,
    itemBottomCollapseClick: props.switchExpandedState,
  }

  const sharingProps = { code: props.code, hasNaOption: props.hasNaOption, rating: props.rating }

  return (
    <Fragment>
      <Paper>
        <Toolbar className="item-inner-toolbar">
          <ItemHeader {...itemHeaderProps} />
          <ItemToolbarControls {...toolbarControlsProps} {...sharingProps} />
        </Toolbar>
      </Paper>
      {props.isExpanded ? <ItemDescription {...itemDescriptionProps} {...sharingProps} /> : null}
    </Fragment>
  )
}

ItemInner.propTypes = {
  canReleaseConfidentialInfo: PropTypes.bool.isRequired,
  caregiverIndex: PropTypes.string,
  code: PropTypes.string.isRequired,
  comment: PropTypes.string,
  description: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  handleCommentChange: PropTypes.func.isRequired,
  handleConfidentialityChange: PropTypes.func.isRequired,
  handleKeyCheck: PropTypes.func,
  handleNaValueSetting: PropTypes.func.isRequired,
  handleRatingChange: PropTypes.func.isRequired,
  hasNaOption: PropTypes.bool,
  isBooleanRating: PropTypes.bool.isRequired,
  isCompletedAssessment: PropTypes.bool.isRequired,
  isConfidential: PropTypes.bool.isRequired,
  isConfidentialByDefault: PropTypes.bool,
  isExpanded: PropTypes.bool.isRequired,
  itemNumber: PropTypes.string.isRequired,
  maxCommentLength: PropTypes.number.isRequired,
  previousRating: PropTypes.number,
  qtcDescriptions: PropTypes.array.isRequired,
  rating: PropTypes.number.isRequired,
  ratingDescriptions: PropTypes.array.isRequired,
  rating_type: PropTypes.string.isRequired,
  switchExpandedState: PropTypes.func,
  title: PropTypes.string.isRequired,
}

ItemInner.defaultProps = {
  caregiverIndex: '',
  comment: '',
  disabled: false,
  isConfidentialByDefault: undefined,
  handleKeyCheck: undefined,
  hasNaOption: false,
  previousRating: undefined,
  switchExpandedState: undefined,
}

export default ItemInner
