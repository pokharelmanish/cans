import React from 'react'
import PropTypes from 'prop-types'
import ItemNaCheckbox from './ItemNaCheckbox'
import ItemBooleanRating from './ItemBooleanRating'
import ItemRegularRating from './ItemRegularRating'
import CommentIcon from '../../common/CommentIcon'
import ConfidentialCheckbox from './ConfidentialCheckbox'
import Typography from '@material-ui/core/Typography'

const ItemToolbarControls = ({
  hasNaOption,
  rating,
  onRatingUpdate,
  disabled,
  isCompletedAssessment,
  isConfidential,
  isConfidentialByDefault,
  code,
  canReleaseConfidentialInfo,
  handleConfidentialityChange,
  handleNaValueSetting,
  comment,
  ratingType,
  previousRating,
}) => {
  const ratingProps = {
    code,
    hasNaOption,
    rating,
    onRatingUpdate,
    disabled,
    previousRating,
    isCompletedAssessment,
  }

  const confidentialCheckboxProps = {
    isConfidential,
    isConfidentialByDefault,
    code,
    canReleaseConfidentialInfo,
    disabled,
    handleConfidentialityChange,
  }

  return (
    <React.Fragment>
      {hasNaOption ? (
        <ItemNaCheckbox
          rating={rating}
          handleRatingChange={onRatingUpdate}
          naValue={handleNaValueSetting(rating)}
          disabled={disabled}
          previousRating={previousRating}
        />
      ) : null}
      {comment ? <CommentIcon className={'item-toolbar-comment-icon'} /> : null}
      <Typography variant="body2" className={'item-confidential-checkbox'}>
        <ConfidentialCheckbox {...confidentialCheckboxProps} />
      </Typography>
      {ratingType === 'REGULAR' ? <ItemRegularRating {...ratingProps} /> : <ItemBooleanRating {...ratingProps} />}
    </React.Fragment>
  )
}

ItemToolbarControls.propTypes = {
  canReleaseConfidentialInfo: PropTypes.bool.isRequired,
  code: PropTypes.string.isRequired,
  comment: PropTypes.string,
  disabled: PropTypes.bool,
  handleConfidentialityChange: PropTypes.func.isRequired,
  handleNaValueSetting: PropTypes.func.isRequired,
  hasNaOption: PropTypes.bool.isRequired,
  isCompletedAssessment: PropTypes.bool.isRequired,
  isConfidential: PropTypes.bool.isRequired,
  isConfidentialByDefault: PropTypes.bool.isRequired,
  onRatingUpdate: PropTypes.func.isRequired,
  previousRating: PropTypes.number,
  rating: PropTypes.number.isRequired,
  ratingType: PropTypes.string.isRequired,
}

ItemToolbarControls.defaultProps = {
  disabled: false,
  comment: '',
  previousRating: undefined,
}

export default ItemToolbarControls
