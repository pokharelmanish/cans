import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import { Icon } from '@cwds/components'
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
      <Modal className="warning-modal" isOpen={this.state.isOpened}>
        <ModalBody className="unsaved-warning-modal-body">
          <div className={'unsaved-warning-modal-icon'}>
            <Icon size={'2x'} name={'exclamation-triangle'} color={'danger'} />
          </div>
          <div className={'unsaved-warning-modal-info'}>
            <div className="unsaved-warning-modal-heading">{'Navigation Warning'}</div>
            <div className={'unsaved-warning-modal-body-message'}>
              {'You have unsaved changes that will be lost if you leave this page now.'}
            </div>
            <div className={'unsaved-modal-body-message'}>{'What would you like to do?'}</div>
          </div>
        </ModalBody>

        <ModalFooter className="warning-modal-footer">
          <Button className={'unsaved-warning-modal-discard no-uppercase'} onClick={this.close}>
            {'Return to the assessment'}
          </Button>
          <Button
            disabled={!this.props.isSavable}
            className={'unsaved-warning-modal-save'}
            onClick={() => {
              this.onButtonClick(this.props.saveAndContinue)
            }}
          >
            {'SAVE CHANGES AND CONTINUE'}
          </Button>
        </ModalFooter>
        {!this.state.isDiscardDisabled ? (
          <ModalFooter className="warning-modal-footer">
            <Button
              className={'unsaved-warning-modal-discard no-uppercase'}
              onClick={() => {
                this.onButtonClick(this.props.discardAndContinue)
              }}
            >
              {'Discard changes and continue'}
            </Button>
          </ModalFooter>
        ) : null}
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
