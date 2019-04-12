import React from 'react'
import PropTypes from 'prop-types'
import { MenuItem, UncontrolledMenu as Menu } from '@cwds/components'
import AssessmentDeleteModal from './AssessmentDeleteModal'
import { Link } from 'react-router-dom'
import { AssessmentStatus } from './AssessmentHelper'

class AssessmentActionsEllipsis extends React.Component {
  state = { isDeleteAssessmentWarningShown: false }

  toggleDeleteModal = () => {
    this.setState({
      isDeleteAssessmentWarningShown: !this.state.isDeleteAssessmentWarningShown,
    })
  }

  canDeleteAssessment() {
    if (!this.props.assessmentMetaData.allowed_operations) {
      return false
    }

    const { allowed_operations: allowedOperations } = this.props.assessmentMetaData
    const { assessmentStatus } = this.props

    return allowedOperations.includes('delete') && assessmentStatus !== AssessmentStatus.deleted
  }

  renderDeleteMenuItem = () => {
    return this.canDeleteAssessment() ? (
      <MenuItem className={'delete-action'} onClick={this.toggleDeleteModal}>
        Delete CANS
      </MenuItem>
    ) : null
  }

  render() {
    const { isDeleteAssessmentWarningShown } = this.state
    const {
      date,
      clientId,
      assessmentCounty,
      assessmentId,
      assessmentStatus,
      inheritUrl,
      updateAssessmentHistoryCallback,
    } = this.props

    const changeLogPath = `${inheritUrl}/clients/${clientId}/assessments/${assessmentId}/changelog/${assessmentStatus}`

    return (
      <React.Fragment>
        <AssessmentDeleteModal
          date={date}
          isShown={isDeleteAssessmentWarningShown}
          assessmentCounty={assessmentCounty}
          assessmentId={assessmentId}
          toggleModal={this.toggleDeleteModal}
          updateAssessmentHistoryCallback={updateAssessmentHistoryCallback}
        />
        <Menu>
          <MenuItem className={'changelog-action'} tag={Link} to={changeLogPath}>
            View CANS Change Log
          </MenuItem>
          {this.renderDeleteMenuItem()}
        </Menu>
      </React.Fragment>
    )
  }
}

AssessmentActionsEllipsis.propTypes = {
  assessmentCounty: PropTypes.string.isRequired,
  assessmentId: PropTypes.number.isRequired,
  assessmentMetaData: PropTypes.shape({
    allowed_operations: PropTypes.array,
  }).isRequired,
  assessmentStatus: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  inheritUrl: PropTypes.string.isRequired,
  updateAssessmentHistoryCallback: PropTypes.func.isRequired,
}

export default AssessmentActionsEllipsis
