import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal } from '@cwds/components'
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
        <div className={'cans-modal-body'}>
          <div className={'info-modal-title'}>How would you like to begin this CANS Reassessment?</div>
          <div>Would you prefer to start with or without the most recently completed CANS ratings?</div>
        </div>
        <div className={'cans-modal-footer'}>
          <Button
            className={'modal-regular-button no-uppercase'}
            disabled={isDisabled}
            onClick={() => this.disableAndInvoke(startEmpty)}
          >
            Start new
          </Button>
          <Button
            className={'modal-regular-button no-uppercase'}
            disabled={isDisabled}
            onClick={() => this.disableAndInvoke(fillPrecedingData)}
          >
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
