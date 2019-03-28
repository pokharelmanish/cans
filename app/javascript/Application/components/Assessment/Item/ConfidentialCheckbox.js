import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { stringify } from '../../../util/common'

const ConfidentialCheckbox = props => {
  const {
    isConfidential,
    isConfidentialByDefault,
    code,
    canReleaseConfidentialInfo,
    disabled,
    handleConfidentialityChange,
  } = props
  return (
    <div className={'item-confidential-block'}>
      <form autoComplete="off">
        <FormControl>
          <FormControlLabel
            classes={{ label: 'item-confidential-label' }}
            onChange={handleConfidentialityChange}
            label={isConfidentialByDefault ? 'Confidential' : 'Discretion Needed'}
            value={stringify(isConfidential)}
            style={{ margin: 0 }}
            id={`${code}Checkbox`}
            control={
              <Checkbox
                checked={isConfidential}
                disabled={(isConfidentialByDefault && !canReleaseConfidentialInfo) || disabled}
                color={'default'}
              />
            }
          />
        </FormControl>
      </form>
    </div>
  )
}
ConfidentialCheckbox.propTypes = {
  canReleaseConfidentialInfo: PropTypes.bool.isRequired,
  code: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  handleConfidentialityChange: PropTypes.func.isRequired,
  isConfidential: PropTypes.bool.isRequired,
  isConfidentialByDefault: PropTypes.bool.isRequired,
}

ConfidentialCheckbox.defaultProps = {
  disabled: false,
}

export default ConfidentialCheckbox
