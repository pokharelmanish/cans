import React from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalBody, ModalHeader, CardTitle, Button } from '@cwds/components'

const CompleteModal = ({
  isCompleteModalShown,
  handleCompleteWarning,
  handleCompleteAssessment,
  handleSaveAssessment,
}) => (
  <Modal isOpen={isCompleteModalShown} size="lg">
    <ModalHeader toggle={() => handleCompleteWarning(false)}>
      <CardTitle className="complete-modal-header">Completed CANS are unable to be edited.</CardTitle>
    </ModalHeader>
    <ModalBody>Once you select &quot;Complete&quot;, you will no longer be able to edit CANS assessment.</ModalBody>
    <div className="p-3 text-right">
      <Button
        className="m-1 save-return-button no-uppercase"
        onClick={() => {
          handleCompleteWarning(false)
          handleSaveAssessment()
        }}
      >
        Save and return to the assessment
      </Button>
      <Button
        className="m-1 complete-confirm-button no-uppercase"
        color="primary"
        onClick={() => {
          handleCompleteWarning(false)
          handleCompleteAssessment()
        }}
      >
        Complete the assessment
      </Button>
    </div>
  </Modal>
)

CompleteModal.propTypes = {
  handleCompleteAssessment: PropTypes.func.isRequired,
  handleCompleteWarning: PropTypes.func.isRequired,
  handleSaveAssessment: PropTypes.func.isRequired,
  isCompleteModalShown: PropTypes.bool.isRequired,
}

export default CompleteModal
