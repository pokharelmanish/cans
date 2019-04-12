import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, ModalBody, ModalHeader, CardTitle } from '@cwds/components'
import '../../styles/global/modal-styles.sass'

class ReassessmentModal extends PureComponent {
  state = { isDisabled: false }

  disableAndInvoke = fn => {
    this.setState({ isDisabled: true })
    fn()
  }

  render() {
    const isDisabled = this.state.isDisabled
    const { fillPrecedingData, isOpen, startEmpty } = this.props
    return (
      <Modal className={'reassessment-modal'} isOpen={isOpen}>
        <ModalHeader>
          <CardTitle id={'reassessment-modal-title'}>How would you like to begin this CANS Reassessment?</CardTitle>
        </ModalHeader>
        <ModalBody id={'reassessment-modal-body'}>
          Would you prefer to start with or without the most recently completed CANS ratings?
        </ModalBody>
        <div className={'p-3 text-right'}>
          <Button className={'m-1'} disabled={isDisabled} onClick={() => this.disableAndInvoke(startEmpty)}>
            Start new
          </Button>
          <Button className={'m-1'} disabled={isDisabled} onClick={() => this.disableAndInvoke(fillPrecedingData)}>
            Use previous ratings
          </Button>
        </div>
      </Modal>
    )
  }
}

ReassessmentModal.propTypes = {
  fillPrecedingData: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  startEmpty: PropTypes.func.isRequired,
}

export default ReassessmentModal
