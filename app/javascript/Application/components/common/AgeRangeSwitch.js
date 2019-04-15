import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@cwds/components'
import './style.sass'

const AgeRangeSwitch = ({ isUnderSix, onChange, disabled }) => (
  <Fragment>
    <div className={'age-buttons-group'}>
      <Button
        id={'age-0-5-button'}
        onClick={() => onChange(true)}
        className={isUnderSix === true ? 'age-button-selected' : 'age-button'}
        disabled={disabled}
      >
        Age: 0-5
      </Button>
      <Button
        id={'age-6-21-button'}
        onClick={() => onChange(false)}
        className={isUnderSix === false ? 'age-button-selected' : 'age-button'}
        disabled={disabled}
      >
        Age: 6-21
      </Button>
    </div>
  </Fragment>
)

AgeRangeSwitch.propTypes = {
  disabled: PropTypes.bool,
  isUnderSix: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}

AgeRangeSwitch.defaultProps = {
  disabled: false,
  isUnderSix: null,
}
export default AgeRangeSwitch
