import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, ModalBody, ModalHeader, CardTitle, Alert } from '@cwds/components'
import pageLockService from './PageLockService'

class UnsavedDataWarning extends Component {
  constructor(context) {
    super(context)
    this.state = {
      isOpened: false,
    }
    this.close = this.close.bind(this)
    this.onButtonClick = this.onButtonClick.bind(this)
    this.onPageLeave = this.onPageLeave.bind(this)
  }

  componentDidMount() {
    this.mounted = true
    if (this.props.isUnsaved) {
      pageLockService.lock(this.onPageLeave)
    }
  }

  componentDidUpdate() {
    if (this.props.isUnsaved) {
      pageLockService.lock(this.onPageLeave)
    } else {
      pageLockService.unlock()
    }
  }

  componentWillUnmount() {
    pageLockService.unlock()
    this.mounted = false
  }

  close() {
    pageLockService.cancel()
    if (this.mounted) {
      this.setState({ isOpened: false, action: undefined })
    }
  }

  onPageLeave(action, options) {
    if (this.props.isUnsaved) {
      this.setState({ isOpened: true, action, isDiscardDisabled: options.isDiscardDisabled })
    } else {
      action()
    }
  }

  onButtonClick(assessmentAction) {
    assessmentAction().then(() => {
      this.state.action()
      this.close()
    })
  }

  render() {
    return (
      <Modal isOpen={this.state.isOpened}>
        <ModalHeader toggle={this.close}>
          <CardTitle>Navigation Warning</CardTitle>
        </ModalHeader>
        <ModalBody>
          <Alert color="warning">You have unsaved changes that will be lost if you leave this page now.</Alert>
          What would you like to do?
        </ModalBody>
        <div className="p-3 text-right">
          {!this.state.isDiscardDisabled ? (
            <Button
              className={'m-1'}
              onClick={() => {
                this.onButtonClick(this.props.discardAndContinue)
              }}
            >
              Ignore and continue
            </Button>
          ) : null}
          <Button
            disabled={!this.props.isSavable}
            className={'m-1'}
            primary
            onClick={() => {
              this.onButtonClick(this.props.saveAndContinue)
            }}
          >
            Save and continue
          </Button>
        </div>
      </Modal>
    )
  }
}

UnsavedDataWarning.propTypes = {
  discardAndContinue: PropTypes.func.isRequired,
  isSavable: PropTypes.bool.isRequired,
  isUnsaved: PropTypes.bool.isRequired,
  saveAndContinue: PropTypes.func.isRequired,
}

export default UnsavedDataWarning
