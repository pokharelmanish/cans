import React from 'react'
import PropTypes from 'prop-types'
import './style.sass'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { stringify } from '../../../util/common'
import { withStyles } from '@material-ui/core/styles'
import { ieStyleFixer } from './ItemStyling'
import { isNARating } from './ItemHelper'

const ieFixStyle = ieStyleFixer()

const PrimRadio = withStyles({
  root: ieFixStyle.radio,
  checked: {},
  disabled: {},
})(Radio)

const getPreviousRatingClassName = (index, previousRating, isCompletedAssessment) =>
  !isCompletedAssessment && index === previousRating ? 'previous-rating-label' : undefined

const getRatingClassName = (index, rating) => (index === rating ? 'rating-radio-label' : undefined)

const ItemRating = ({
  code,
  options,
  rating,
  previousRating,
  type,
  shortType,
  disabled,
  onRatingUpdate,
  isCompletedAssessment,
}) => {
  const labelId = `${code}-outer-controls-label`
  const radioButtons = options.map((label, i) => (
    <FormControlLabel
      id={`label-${code}-${i}`}
      style={ieFixStyle.label}
      className={getPreviousRatingClassName(i, previousRating, isCompletedAssessment)}
      key={`rating-${i}`}
      value={stringify(i)}
      control={
        <PrimRadio
          inputProps={{
            id: `input-${code}-${type}-${i}`,
            'aria-label': labelId, // TODO - should be aria-labelled-by?
          }}
        />
      }
      label={<span className={getRatingClassName(i, rating)}>{label}</span>}
      labelPlacement={'start'}
    />
  ))
  return (
    <form autoComplete="off">
      <FormControl disabled={disabled || isNARating(rating)}>
        <RadioGroup
          id={`${code}-${type}-rating`}
          className={`items-radio-group item-${shortType}-rating`}
          value={stringify(rating)}
          onChange={onRatingUpdate}
        >
          {radioButtons}
        </RadioGroup>
      </FormControl>
    </form>
  )
}

ItemRating.propTypes = {
  code: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  isCompletedAssessment: PropTypes.bool.isRequired,
  onRatingUpdate: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  previousRating: PropTypes.number,
  rating: PropTypes.number.isRequired,
  shortType: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

ItemRating.defaultProps = {
  disabled: false,
  previousRating: undefined,
}

export default ItemRating
