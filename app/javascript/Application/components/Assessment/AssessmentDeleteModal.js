import React from 'react'
import PropTypes from 'prop-types'
import { AssessmentService } from '../Assessment'
import { Select, Label, Modal, ModalBody, ModalHeader, CardTitle, Button } from '@cwds/components'
import Comment from '../common/Comment'
import '../../styles/global/modal-styles.sass'
import { logPageAction } from '../../util/analytics'
import {
  selectOptions,
  blankPlaceHolder,
  deleteWarningTitle,
  deleteWarningDescription,
  otherReasonLabel,
  reasonSelectLabel,
} from './AssessmentHelper'

const initialState = {
  showOtherReasonInput: false,
  otherReasonContent: '',
  selectedReason: blankPlaceHolder,
  isDeleteButtonDisabled: true,
}

class AssessmentDeleteModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...initialState,
    }
  }

  handleWarningCancel = () => {
    this.setState({
      ...initialState,
    })
    this.props.toggleModal()
  }

  handleWarningDelete = async () => {
    const { assessmentCounty, assessmentId, toggleModal, updateAssessmentHistoryCallback } = this.props

    toggleModal()
    await AssessmentService.delete(
      assessmentId,
      this.state.otherReasonContent !== '' ? this.state.otherReasonContent : this.state.selectedReason.value
    )

    logPageAction('assessmentDelete', {
      assessment_id: assessmentId,
      assessment_county: assessmentCounty,
    })

    updateAssessmentHistoryCallback()
  }

  handleSelectChange = selectedOption => {
    if (selectedOption.value === 'Other' && this.state.otherReasonContent === '') {
      this.setState({ showOtherReasonInput: true, selectedReason: selectedOption, isDeleteButtonDisabled: true })
    } else if (selectedOption.value === 'Other' && this.state.otherReasonContent !== '') {
      this.setState({ showOtherReasonInput: true, selectedReason: selectedOption })
    } else {
      this.setState({
        showOtherReasonInput: false,
        selectedReason: selectedOption,
        isDeleteButtonDisabled: false,
        otherReasonContent: '',
      })
    }
  }

  handleOtherReasonContentChange = content => {
    if (content !== '' && content !== this.state.otherReasonContent) {
      this.setState({ otherReasonContent: content, isDeleteButtonDisabled: false })
    }
    if (content === '') {
      this.setState({ otherReasonContent: content, isDeleteButtonDisabled: true })
    }
  }

  renderOtherReasonInput = () => {
    return (
      <div>
        <Label for={'other'} className={'delete-warning-label'}>
          {otherReasonLabel}
        </Label>
        <div className="other-delete-reason">
          <Comment
            id={'other'}
            comment={this.state.otherReasonContent}
            onChange={this.handleOtherReasonContentChange}
            onKeyUp={this.handleOtherReasonContentChange}
            prefix={'delete-reason'}
            maxCommentLength={56}
            isCommentIconDisabled={true}
          />
        </div>
      </div>
    )
  }

  render() {
    const { date } = this.props
    const warning = <div>{deleteWarningTitle}</div>
    const otherReasonInput = this.renderOtherReasonInput()
    return (
      <Modal id="delete-assessment-modal" isOpen={this.props.isShown}>
        <ModalHeader>
          <CardTitle>{`Delete CANS Assessment - ${date}`}</CardTitle>
        </ModalHeader>
        <ModalBody>
          <div>{warning}</div>
          <div>{deleteWarningDescription}</div>
          <Label for={'reasonSelect'} className={'delete-warning-label'}>
            {reasonSelectLabel}
          </Label>
          <div className="delete-reason-select">
            <Select
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
              id={'reasonSelect'}
              classNamePrefix="list"
              options={selectOptions}
              value={this.state.selectedReason}
              onChange={this.handleSelectChange}
              isSearchable={false}
            />
          </div>
          {this.state.showOtherReasonInput ? otherReasonInput : null}
        </ModalBody>
        <div className="p-3 text-right">
          <Button className="m-1" onClick={this.handleWarningCancel}>
            Cancel
          </Button>
          <Button
            className="m-1"
            primary
            onClick={this.handleWarningDelete}
            disabled={this.state.isDeleteButtonDisabled}
          >
            Delete CANS
          </Button>
        </div>
      </Modal>
    )
  }
}

AssessmentDeleteModal.propTypes = {
  assessmentCounty: PropTypes.string.isRequired,
  assessmentId: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  isShown: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  updateAssessmentHistoryCallback: PropTypes.func.isRequired,
}

export default AssessmentDeleteModal
