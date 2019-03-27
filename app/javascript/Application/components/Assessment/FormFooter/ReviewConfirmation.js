import React from 'react'
import PropTypes from 'prop-types'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { stringify } from '../../../util/common'

const ReviewConfirmation = ({ isReviewConfirmed, onReviewConfirmedChange }) => {
  return (
    <FormControlLabel
      classes={{ label: 'review-confirmation-label' }}
      label={
        'I confirm that I have reviewed these reassessment ratings and made all necessary adjustments to ensure they are correct for this child.'
      }
      value={stringify(isReviewConfirmed)}
      onChange={onReviewConfirmedChange}
      control={<Checkbox checked={isReviewConfirmed} color={'default'} />}
    />
  )
}

ReviewConfirmation.propTypes = {
  isReviewConfirmed: PropTypes.bool.isRequired,
  onReviewConfirmedChange: PropTypes.func.isRequired,
}

export default ReviewConfirmation
