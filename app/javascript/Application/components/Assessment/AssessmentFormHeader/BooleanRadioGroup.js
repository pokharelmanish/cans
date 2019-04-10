import React from 'react'
import PropTypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { stringify } from '../../../util/common'

const BooleanRadioGroup = ({ isDisabled, legend, name, onChange, onNoClicked, onYesClicked, value }) => {
  const id = name.replace(/_/g, '-')

  return (
    <FormControl classes={{ root: 'radio-group-control' }}>
      <fieldset>
        <legend className="assessment-form-header-label">{legend}</legend>
        <RadioGroup
          id={id}
          name={name}
          value={stringify(value)}
          onChange={onChange}
          className="assessment-form-header-radio-group"
          disabled={isDisabled}
        >
          <FormControlLabel
            id={`${id}-yes`}
            value={stringify(true)}
            control={
              <Radio
                onClick={onYesClicked}
                classes={{ checked: 'radio-checked' }}
                color="default"
                inputProps={{
                  id: `input-${id}-yes`,
                }}
                disabled={isDisabled}
              />
            }
            label="Yes"
            classes={{ label: 'assessment-form-header-label' }}
          />
          <FormControlLabel
            id={`${id}-no`}
            value={stringify(false)}
            control={
              <Radio
                onClick={onNoClicked}
                classes={{ checked: 'radio-checked' }}
                color="default"
                inputProps={{
                  id: `input-${id}-no`,
                }}
                disabled={isDisabled}
              />
            }
            label="No"
            classes={{ label: 'assessment-form-header-label' }}
          />
        </RadioGroup>
      </fieldset>
    </FormControl>
  )
}

BooleanRadioGroup.propTypes = {
  isDisabled: PropTypes.bool,
  legend: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onNoClicked: PropTypes.func,
  onYesClicked: PropTypes.func,
  /* eslint-disable  react/boolean-prop-naming */
  value: PropTypes.bool.isRequired,
  /* eslint-enable  react/boolean-prop-naming */
}

BooleanRadioGroup.defaultProps = {
  isDisabled: false,
  onNoClicked: () => {},
  onYesClicked: () => {},
}

export default BooleanRadioGroup
