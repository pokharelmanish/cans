import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@cwds/components'
import './style.sass'

const DomainCaregiverControls = props => {
  return (
    <div className={'caregiver-domain-add-remove'}>
      <Button
        id={'caregiver-domain-remove'}
        onClick={props.onRemoveCaregiverDomain}
        onKeyPress={props.onRemoveCaregiverDomain}
        className={'m-1'}
        aria-label="remove caregiver button"
        tabIndex={0}
      >
        - Remove Caregiver
      </Button>
      <Button
        id={'caregiver-domain-add'}
        onClick={props.onAddCaregiverDomain}
        onKeyPress={props.onAddCaregiverDomain}
        className={'m-1'}
        aria-label="add caregiver button"
        tabIndex={0}
      >
        + Add Caregiver
      </Button>
    </div>
  )
}

DomainCaregiverControls.propTypes = {
  onAddCaregiverDomain: PropTypes.func.isRequired,
  onRemoveCaregiverDomain: PropTypes.func.isRequired,
}

export default DomainCaregiverControls
