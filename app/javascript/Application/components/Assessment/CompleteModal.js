import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalBody, ModalHeader, CardTitle, Button } from '@cwds/components'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'

const Action = Object.freeze({
  save: 'save',
  complete: 'complete',
})

export default class CompleteModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      action: undefined,
    }

    this[Action.save] = () => {
      this.props.handleSaveAssessment()
      this.close()
    }

    this[Action.complete] = () => {
      this.props.handleCompleteAssessment()
      this.close()
    }
  }

  doAction = () => {
    this[this.state.action].call()
  }

  handleChange = event => {
    this.setState({ action: event.target.value })
  }

  close = () => {
    this.props.handleCompleteWarning(false)
    this.setState({
      action: undefined,
    })
  }

  renderFormControl = (action, text) => {
    return (
      <FormControlLabel
        classes={{ label: 'complete-assessment-radio-label' }}
        value={action}
        control={<Radio id={`complete-assessment-${action}`} classes={{ checked: 'radio-checked' }} color="default" />}
        label={text}
      />
    )
  }

  render() {
    const { isCompleteModalShown } = this.props
    return (
      <Modal isOpen={isCompleteModalShown} size="lg">
        <ModalHeader toggle={this.close}>
          <CardTitle className="complete-modal-header">Confirm CANS completion</CardTitle>
        </ModalHeader>
        <ModalBody>
          Once confirmed, you have 7 calendar days to make edits before the completed assessment will become read-only.
          <FormControl classes={{ root: 'radio-group-control' }} className={'complete-assessment-radio-group'}>
            <RadioGroup value={this.state.action} onChange={this.handleChange}>
              {this.renderFormControl(Action.save, 'Save changes and return to the assessment')}
              {this.renderFormControl(Action.complete, 'Save changes and mark as "complete"')}
            </RadioGroup>
          </FormControl>
        </ModalBody>

        <div className="p-3 text-right">
          <Button className="m-1 cancel-confirm-button" onClick={this.close}>
            Cancel
          </Button>
          <Button
            className="m-1 save-confirm-button"
            primary
            disabled={this.state.action === undefined}
            onClick={this.doAction}
          >
            Save
          </Button>
        </div>
      </Modal>
    )
  }
}

CompleteModal.propTypes = {
  handleCompleteAssessment: PropTypes.func.isRequired,
  handleCompleteWarning: PropTypes.func.isRequired,
  handleSaveAssessment: PropTypes.func.isRequired,
  isCompleteModalShown: PropTypes.bool.isRequired,
}
