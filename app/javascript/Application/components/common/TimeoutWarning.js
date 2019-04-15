import React, { Component } from 'react'
import './style.sass'
import { Alert, Button, CardTitle, Modal, ModalBody, ModalHeader } from '@cwds/components'
import { TIMEOUT_EVENT } from './../../util/constants'
import { eventBus } from './../../util/eventBus'
import { SecurityService } from './Security.service'
import UserAccountService from '../common/UserAccountService'

export class TimeoutWarning extends Component {
  constructor(context) {
    super(context)
    this.state = {
      isOpened: false,
    }
    this.refresh = this.refresh.bind(this)
    this.onTimeoutEvent = this.onTimeoutEvent.bind(this)
  }

  componentDidMount() {
    eventBus.subscribe(TIMEOUT_EVENT, this.onTimeoutEvent)
  }

  onTimeoutEvent() {
    this.setState({
      isOpened: true,
    })
  }

  refresh() {
    SecurityService.refresh()
    this.setState({
      isOpened: false,
    })
  }

  render() {
    return (
      <Modal className="warning-modal" isOpen={this.state.isOpened}>
        <ModalHeader>
          <CardTitle>Session timeout!</CardTitle>
        </ModalHeader>
        <ModalBody className="warning-modal-body">
          <Alert color="danger">
            Due to inactivity, your session is about to timeout. Any unsaved work will be lost.
          </Alert>
          Would you like to continue?
        </ModalBody>
        <div className="p-3 text-right">
          <Button className="m-1 warning-modal-logout" onClick={UserAccountService.logout}>
            Logout
          </Button>{' '}
          <Button className="m-1 warning-modal-stay-logged-in" primary onClick={this.refresh}>
            Stay Logged In
          </Button>
        </div>
      </Modal>
    )
  }
}

export default TimeoutWarning
