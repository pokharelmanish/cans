import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { isValidLocalDate, localToIsoDate } from '../../util/dateHelper'
import { LoadingState } from '../../util/loadingHelper'
import pageLockService from '../common/PageLockService'
import AssessmentContainerInner from './AssessmentContainerInner'
import {
  AssessmentStatus,
  defaultEmptyAssessment,
  getCaregiverDomainsNumber,
  trimUrlForClientProfile,
  validateAssessmentEventDate,
  validateAssessmentForSubmit,
} from './AssessmentHelper'
import AssessmentPageActions from './AssessmentPageActions'
import AssessmentPageHeader from './AssessmentPageHeader'
import AssessmentStatusMessages from './AssessmentStatusMessages'
import AssessmentSummaryScroller from './AssessmentSummaryScroller'
import { isAuthorized } from '../common/AuthHelper'

class NewAssessmentContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.assessmentHeader = React.createRef()
    this.state = {
      completeScrollTarget: 0,
      isEventDateBeforeDob: false,
      isValidDate: true,
      shouldRedirectToClientProfile: false,
    }
  }

  componentDidUpdate() {
    this.calculateAssessmentSummaryScrollTarget()
  }

  handleSubmitAssessment = () => {
    this.save({
      ...this.props.assessment,
      status: AssessmentStatus.completed,
    })
  }

  handleSaveAssessment = () => {
    this.save(this.props.assessment)
  }

  save = assessment => {
    const newAssessment = {
      ...assessment,
      person: this.props.client,
    }
    this.props.onSaveAssessment(newAssessment)
  }

  handleCaregiverRemove = caregiverIndex => {
    const captureCaregiverDomains = getCaregiverDomainsNumber(this.props.assessment)

    let filter
    if (!caregiverIndex || captureCaregiverDomains <= 1) {
      filter = domain => !domain.is_caregiver_domain
    } else {
      filter = domain => domain.caregiver_index !== caregiverIndex
    }

    const newDomains = this.props.assessment.state.domains.filter(filter)

    this.props.onSetAssessment({
      ...this.props.assessment,
      state: {
        ...this.props.assessment.state,
        domains: newDomains,
      },
      has_caregiver: newDomains.some(domain => domain.is_caregiver_domain),
    })
  }

  handleUpdateAssessment = assessment => {
    const newAssessment = {
      ...assessment,
      person: this.props.client,
    }

    this.props.onSetAssessment(newAssessment)
  }

  handleEventDateFieldKeyUp = ({ target: { value: dateValue } }) => {
    const isValidDate = isValidLocalDate(dateValue, true)
    const dob = this.props.client.dob
    const isEventDateBeforeDob = isValidDate && !validateAssessmentEventDate(dob, localToIsoDate(dateValue))
    this.setState({
      isValidDate,
      isEventDateBeforeDob,
    })
  }

  calculateAssessmentSummaryScrollTarget = () => {
    const element = this.assessmentHeader
    if (this.state.completeScrollTarget === 0 && element.current) {
      this.setState({
        completeScrollTarget: element.current.getBoundingClientRect().bottom,
      })
    }
  }

  handleCancelClick = () => {
    pageLockService.confirm(() => {
      this.setState({ shouldRedirectToClientProfile: true })
    })
  }

  render() {
    const {
      assessment,
      client,
      i18n,
      isDirty,
      loadingState,
      onResetAssessment,
      pageHeaderButtonsController,
      url,
    } = this.props
    const { completeScrollTarget, isEventDateBeforeDob, isValidDate, shouldRedirectToClientProfile } = this.state

    if (assessment === null) {
      return null
    }

    if (shouldRedirectToClientProfile) {
      return <Redirect push to={{ pathname: trimUrlForClientProfile(url) }} />
    }

    const isCompleted = assessment.status === AssessmentStatus.completed
    const isEditable = Boolean(!assessment || !assessment.id || isAuthorized(assessment, 'update'))
    const isValidForSubmit = validateAssessmentForSubmit(assessment)
    const canDisplaySummaryOnSave = isCompleted || (isEditable && isValidForSubmit)

    const tuner = 15

    return (
      <div ref={this.assessmentHeader}>
        <AssessmentStatusMessages
          isCompleted={isCompleted}
          isEditable={isEditable}
          loadingState={loadingState}
          url={url}
        />
        <AssessmentPageActions assessment={assessment} loadingState={loadingState} />
        <AssessmentPageHeader
          assessment={assessment}
          i18n={i18n}
          isDirty={isDirty}
          isEditable={isEditable}
          isEventDateBeforeDob={isEventDateBeforeDob}
          isValidDate={isValidDate}
          loadingState={loadingState}
          onResetAssessment={onResetAssessment}
          onSaveAssessment={this.handleSaveAssessment}
          pageHeaderButtonsController={pageHeaderButtonsController}
        />
        <AssessmentSummaryScroller
          canDisplaySummaryOnSave={canDisplaySummaryOnSave}
          loadingState={loadingState}
          scrollTarget={completeScrollTarget}
          targetAdjustment={tuner}
        />
        <AssessmentContainerInner
          assessment={assessment || defaultEmptyAssessment}
          assessmentServiceStatus={loadingState}
          canDisplaySummaryOnSave={canDisplaySummaryOnSave}
          client={client}
          i18n={i18n}
          isEditable={isEditable}
          handleCaregiverRemove={this.handleCaregiverRemove}
          handleSubmitAssessment={this.handleSubmitAssessment}
          isEventDateBeforeDob={isValidDate && isEventDateBeforeDob}
          isValidForSubmit={isValidForSubmit}
          onAssessmentUpdate={this.handleUpdateAssessment}
          onCancelClick={this.handleCancelClick}
          onEventDateFieldKeyUp={this.handleEventDateFieldKeyUp}
        />
      </div>
    )
  }
}

NewAssessmentContainer.propTypes = {
  assessment: PropTypes.shape({
    person: PropTypes.shape({
      dob: PropTypes.string.isRequired,
    }).isRequired,
    state: PropTypes.shape({
      domains: PropTypes.arrayOf(
        PropTypes.shape({
          is_caregiver_domain: PropTypes.bool,
          caregiver_index: PropTypes.string,
        })
      ).isRequired,
    }).isRequired,
    has_caregiver: PropTypes.bool.isRequired,
  }),
  client: PropTypes.shape({
    dob: PropTypes.string.isRequired,
  }).isRequired,
  i18n: PropTypes.any,
  isDirty: PropTypes.bool,
  loadingState: PropTypes.oneOf(Object.values(LoadingState)),
  onResetAssessment: PropTypes.func,
  onSaveAssessment: PropTypes.func,
  onSetAssessment: PropTypes.func,
  pageHeaderButtonsController: PropTypes.shape({
    updateHeaderButtons: PropTypes.func.isRequired,
    updateHeaderButtonsToDefault: PropTypes.func.isRequired,
  }).isRequired,
  url: PropTypes.string.isRequired,
}
NewAssessmentContainer.defaultProps = {
  assessment: null,
  i18n: null,
  isDirty: false,
  loadingState: LoadingState.waiting,
  onResetAssessment: () => {},
  onSaveAssessment: () => {},
  onSetAssessment: () => {},
}

export default NewAssessmentContainer
