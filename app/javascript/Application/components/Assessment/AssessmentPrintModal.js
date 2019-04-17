import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { CardTitle, Modal, ModalBody, ModalHeader, Button } from '@cwds/components'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { withStyles } from '@material-ui/core'
import { redactLevels } from '../Print/printAssessment/PrintAssessmentHelper'
import { Print, PrintAssessment } from '../Print'
import { hasConfidentialItems } from './AssessmentHelper'

const PrimCheckbox = withStyles({
  root: {
    '&$checked': {
      color: '#09798E',
    },
  },
  checked: {},
})(Checkbox)

class AssessmentPrintModal extends PureComponent {
  state = { ...AssessmentPrintModal.defaultSate }

  resetState = () => {
    this.setState({ ...AssessmentPrintModal.defaultSate })
  }

  onConfirm = () => {
    this.setState({
      printNow: true,
    })
  }

  close = () => {
    this.props.onClose()
    this.resetState()
  }

  handleRedactLevelChange = event => {
    const redactLevel = event.target.value
    this.setState({
      redactLevel,
      confirmChecked: false,
    })
  }

  handleCheckboxChange = event => {
    const confirmChecked = event.target.checked
    this.setState({ confirmChecked })
  }

  createPrintAssessment = (redactLevel = redactLevels.all) => {
    const { assessment, i18n, substanceUseItemsIds } = this.props
    return (
      <PrintAssessment
        assessment={assessment}
        i18n={i18n}
        substanceUseItemsIds={substanceUseItemsIds}
        redactLevel={redactLevel}
      />
    )
  }

  printIfNeeded = () => {
    const { redactLevel, printNow } = this.state
    const shouldPrintNow = !hasConfidentialItems(this.props.assessment) || printNow
    return shouldPrintNow ? <Print node={this.createPrintAssessment(redactLevel)} onClose={this.close} /> : ''
  }

  renderRedactLevelRadio = (redactLevel, text) => {
    return (
      <FormControlLabel
        id={`redact-level-radio-${redactLevel}`}
        classes={{ label: 'redact-level-radio-label' }}
        value={redactLevel}
        control={<Radio id={`redact-level-${redactLevel}`} classes={{ checked: 'radio-checked' }} color="default" />}
        label={text}
      />
    )
  }

  renderRadioGroup = () => {
    const { redactLevel } = this.state
    const isConfirmCheckboxDisabled = !redactLevel || redactLevel === redactLevels.all
    return (
      <FormControl classes={{ root: 'radio-group-control' }} className={'redact-level-radio-group'}>
        <RadioGroup value={this.state.redactLevel} onChange={this.handleRedactLevelChange}>
          {this.renderRedactLevelRadio(
            redactLevels.all,
            'Redact all “Confidential” and “Discretion Needed” comments and ratings.'
          )}
          {this.renderRedactLevelRadio(redactLevels.confidential, 'Redact only “Confidential” comments and ratings.')}
          {this.renderRedactLevelRadio(
            redactLevels.discrationNeeded,
            'Redact only “Discretion Needed” comments and ratings.'
          )}
          {this.renderRedactLevelRadio(redactLevels.doNotRedact, 'Do not redact any comments or ratings.')}
        </RadioGroup>
        <FormControlLabel
          id={'redact-level-confirm-checkbox'}
          control={
            <PrimCheckbox
              checked={this.state.confirmChecked}
              onChange={this.handleCheckboxChange}
              value={'confirmCheck'}
            />
          }
          label={'I understand that I am responsible for how this client information will be distributed and used.'}
          disabled={isConfirmCheckboxDisabled}
        />
      </FormControl>
    )
  }

  renderModal = () => {
    const modalIsOpen = hasConfidentialItems(this.props.assessment)
    const { redactLevel, confirmChecked } = this.state
    const isConfirmButtonDisabled = !redactLevel || (redactLevel !== redactLevels.all && !confirmChecked)
    return (
      <Modal isOpen={modalIsOpen}>
        <ModalHeader toggle={this.close}>
          <CardTitle>Confirm Redaction Option</CardTitle>
        </ModalHeader>
        <ModalBody>
          Please confirm the level of redaction you require before printing.
          <div className={'p-3'}>{this.renderRadioGroup()}</div>
        </ModalBody>
        <div className="p-3 text-right">
          <Button
            id={'redact-level-confirm-button'}
            className="m-1"
            primary={true}
            onClick={this.onConfirm}
            disabled={isConfirmButtonDisabled}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    )
  }

  render() {
    return this.props.isOpen ? (
      <Fragment>
        {this.renderModal()}
        {this.printIfNeeded()}
      </Fragment>
    ) : null
  }
}

AssessmentPrintModal.propTypes = {
  assessment: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  substanceUseItemsIds: PropTypes.object.isRequired,
}

AssessmentPrintModal.defaultSate = Object.freeze({
  redactLevel: undefined,
  confirmChecked: false,
  confirmCheckDisabled: true,
  confirmButtonDisabled: true,
  printNow: false,
})

export default AssessmentPrintModal
