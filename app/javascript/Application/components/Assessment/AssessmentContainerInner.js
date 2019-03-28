import React, { Component, Fragment } from 'react'
import Assessment from './Assessment'
import PropTypes from 'prop-types'
import AssessmentSummaryCard from './AssessmentSummary/AssessmentSummaryCard'
import { isReadyForAction } from '../../util/loadingHelper'
import { AssessmentFormFooter, AssessmentFormHeader } from './'
import RenderWarning from '../common/RenderWarning'
import CompleteModal from '../Assessment/CompleteModal'
import { isCompleteAssessmentAuthorized } from '../common/AuthHelper'
import ChangelogLink from './ChangelogLink'

class AssessmentContainerInner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isCaregiverWarningShown: false,
      focusedCaregiverId: '',
      isCompleteModalShown: false,
      isDefaultExpanded: false,
    }
  }

  handleCompleteWarning = switcher => {
    const { assessment } = this.props
    if (assessment.can_release_confidential_info === false) {
      this.setState({ isCompleteModalShown: switcher })
    }
    return null
  }

  handleWarningShow = (switcher, caregiverIndex) => {
    caregiverIndex = caregiverIndex || null
    this.setState({
      isCaregiverWarningShown: switcher,
      focusedCaregiverId: caregiverIndex,
    })
  }

  handleExpandAllDomains = value => {
    const isExpanded = typeof value === typeof true ? value : !this.state.isDefaultExpanded
    this.setState({
      isDefaultExpanded: isExpanded,
    })
  }

  displayModalWarning() {
    const { handleCaregiverRemove, handleCompleteAssessment, handleSaveAssessment } = this.props
    return (
      <Fragment>
        <RenderWarning
          isCaregiverWarningShown={this.state.isCaregiverWarningShown}
          handleWarningShow={this.handleWarningShow}
          handleCaregiverRemove={handleCaregiverRemove}
          focusedCaregiverId={this.state.focusedCaregiverId}
        />
        <CompleteModal
          isCompleteModalShown={this.state.isCompleteModalShown}
          handleCompleteWarning={this.handleCompleteWarning}
          handleCompleteAssessment={handleCompleteAssessment}
          handleSaveAssessment={handleSaveAssessment}
        />
      </Fragment>
    )
  }

  displayAssessmentFooter() {
    const {
      assessment,
      client,
      assessmentServiceStatus,
      isEditable,
      onCancelClick,
      handleCompleteAssessment,
      isValidForSubmit,
    } = this.props
    const canPerformUpdates = isReadyForAction(assessmentServiceStatus)
    const isSubmissionEnabled =
      isEditable && canPerformUpdates && isValidForSubmit && isCompleteAssessmentAuthorized(assessment, client)
    const onSubmitAssessment =
      assessment.can_release_confidential_info === true
        ? handleCompleteAssessment
        : this.handleCompleteWarning.bind(this, true)
    return (
      <AssessmentFormFooter
        isEditable={isEditable}
        assessment={assessment}
        onCancelClick={onCancelClick}
        isSubmissionEnabled={isSubmissionEnabled}
        onSubmitAssessment={onSubmitAssessment}
      />
    )
  }

  displayAssessment() {
    const {
      client,
      assessment,
      onAssessmentUpdate,
      onEventDateFieldKeyUp,
      isEventDateBeforeDob,
      canDisplaySummaryOnSave,
      i18n,
      isEditable,
      previousRatingsMap,
      substanceUseItemsIds,
    } = this.props
    return (
      <Fragment>
        <div rol="completeScrollLocator">
          <AssessmentFormHeader
            client={client}
            assessment={assessment}
            onAssessmentUpdate={onAssessmentUpdate}
            onEventDateFieldKeyUp={onEventDateFieldKeyUp}
            handleWarningShow={this.handleWarningShow}
            isCaregiverWarningShown={this.state.isCaregiverWarningShown}
            disabled={!isEditable}
            isEventDateBeforeDob={isEventDateBeforeDob}
            expandCollapse={this.handleExpandAllDomains}
            substanceUseItemsIds={substanceUseItemsIds}
          />
        </div>
        <AssessmentSummaryCard
          isSummaryAvailableOnSave={canDisplaySummaryOnSave}
          assessmentStatus={assessment.status}
          domains={assessment && assessment.state && assessment.state.domains}
          i18n={i18n}
          isUnderSix={Boolean(assessment && assessment.state && assessment.state.under_six)}
          disabled={!isEditable}
        />
        <Assessment
          assessment={assessment}
          i18n={i18n}
          onAssessmentUpdate={onAssessmentUpdate}
          handleWarningShow={this.handleWarningShow}
          disabled={!isEditable}
          isDefaultExpanded={this.state.isDefaultExpanded}
          expandCollapse={this.handleExpandAllDomains}
          previousRatingsMap={previousRatingsMap}
          footer={this.displayAssessmentFooter()}
        />
        {assessment.id && <ChangelogLink assessmentId={assessment.id} assessmentStatus={assessment.status} />}
      </Fragment>
    )
  }

  render() {
    return (
      <Fragment>
        {this.displayModalWarning()}
        {this.displayAssessment()}
      </Fragment>
    )
  }
}

AssessmentContainerInner.propTypes = {
  assessment: PropTypes.object.isRequired,
  assessmentServiceStatus: PropTypes.string.isRequired,
  canDisplaySummaryOnSave: PropTypes.bool,
  client: PropTypes.object.isRequired,
  handleCaregiverRemove: PropTypes.func.isRequired,
  handleCompleteAssessment: PropTypes.func.isRequired,
  handleSaveAssessment: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired,
  isEditable: PropTypes.bool,
  isEventDateBeforeDob: PropTypes.bool.isRequired,
  isValidForSubmit: PropTypes.bool.isRequired,
  onAssessmentUpdate: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onEventDateFieldKeyUp: PropTypes.func.isRequired,
  previousRatingsMap: PropTypes.object,
  substanceUseItemsIds: PropTypes.shape({
    underSix: PropTypes.array.isRequired,
    aboveSix: PropTypes.array.isRequired,
  }).isRequired,
}

AssessmentContainerInner.defaultProps = {
  canDisplaySummaryOnSave: false,
  focusedCaregiverId: null,
  isUnderSix: null,
  domains: [],
  isEditable: undefined,
  previousRatingsMap: undefined,
}

export default AssessmentContainerInner
