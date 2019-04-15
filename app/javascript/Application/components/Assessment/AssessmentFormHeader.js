import React, { PureComponent, Fragment } from 'react'
import { Row, Col, Label } from 'reactstrap'
import { resetConfidentialByDefaultItems } from './AssessmentHelper'
import { clientCaseReferralNumber, formatClientName } from '../Client/Client.helper'
import PropTypes from 'prop-types'
import { clone } from '../../util/common'
import './style.sass'
import DateField from '../common/DateField'
import ConductedByField from './AssessmentFormHeader/ConductedByField'
import AssessmentOptions from './AssessmentFormHeader/AssessmentOptions'
import AgeRangeSwitch from '../common/AgeRangeSwitch'
import { Card, CardBody, CardHeader, CardTitle } from '@cwds/components'
import { calculateDateDifferenceInYears, isoToLocalDate, isValidDate } from '../../util/dateHelper'
import moment from 'moment/moment'

class AssessmentFormHeader extends PureComponent {
  handleValueChange = event => this.changeFieldAndUpdateAssessment(event.target.name, event.target.value)

  handleHasCaregiverSwitcher = event => {
    event.preventDefault()
    this.props.handleWarningShow(true, null)
  }

  handleHasCaregiverChange = event => {
    const enableCaregiver = event.target.value === 'true'
    if (enableCaregiver) {
      // No Caregiver state is handled through modal
      this.changeFieldAndUpdateAssessment(event.target.name, enableCaregiver)
    }
  }

  changeFieldAndUpdateAssessment(name, value) {
    const assessment = clone(this.props.assessment)
    assessment[name] = value
    this.props.onAssessmentUpdate(assessment)
  }

  handleCanReleaseInfoChange = event => {
    const canReleaseInfo = event.target.value === 'true'
    const assessment = clone(this.props.assessment)
    assessment.can_release_confidential_info = canReleaseInfo
    resetConfidentialByDefaultItems(assessment, !canReleaseInfo)
    this.props.onAssessmentUpdate(assessment)
  }

  handleConductedByChange = event => {
    const assessment = clone(this.props.assessment)
    assessment.conducted_by = event.target.value
    this.props.onAssessmentUpdate(assessment)
  }

  updateUnderSixAndAllDomainsExpand = value => {
    const assessment = clone(this.props.assessment)
    assessment.state.under_six = value
    this.props.onAssessmentUpdate(assessment)
    this.props.expandCollapse(false)
  }

  renderClientName() {
    const { first_name: firstName, last_name: lastName, dob, estimated_dob: estimatedDob } = this.props.client
    return (
      <div>
        {firstName && lastName ? (
          <div>
            <div className={'child-name-block'}>
              <span id={'child-name'}>{formatClientName(this.props.client)}</span>
            </div>
            <div className={'helper-text'}>
              <span id={'child-age'}>{this.formatClientAge(dob)}</span>
            </div>
            <div className={'helper-text'}>
              <span id={'child-dob'}>{this.formatClientDob(dob, estimatedDob)}</span>
            </div>
          </div>
        ) : (
          <div className={'child-name-block'}>
            <span id={'no-data'}>Client Info</span>
          </div>
        )}
      </div>
    )
  }

  formatClientAge(dob) {
    return isValidDate(dob) ? `${calculateDateDifferenceInYears(dob, this.getCurrentDate())} years old` : ''
  }

  getCurrentDate() {
    return moment()
  }

  formatClientDob(dob, estimatedDob) {
    return isValidDate(dob) ? `DOB: ${isoToLocalDate(dob)}${estimatedDob ? ' (approx.)' : ''}` : ''
  }

  renderCounty() {
    const county = this.props.assessment.county || {}
    const countyName = county.name ? `${county.name} County` : ''
    return (
      countyName && (
        <div id={'county-name'} className={'county-name-block'}>
          {countyName}
        </div>
      )
    )
  }

  renderDateSelect() {
    const { assessment, onEventDateFieldKeyUp, disabled, isEventDateBeforeDob } = this.props
    return (
      <DateField
        required={true}
        id={'assessment-date'}
        value={assessment.event_date}
        onChange={value => this.changeFieldAndUpdateAssessment('event_date', value)}
        onRawValueUpdate={onEventDateFieldKeyUp}
        ariaLabelledBy={'assessment-date-label'}
        disabled={disabled}
        isValid={!isEventDateBeforeDob}
        validationErrorMessage={'Enter an assessment date that is on or after the client’s date of birth.'}
      />
    )
  }

  renderCaseNumber() {
    return (
      <Fragment>
        <div id={'case-or-referral-number'} className={'assessment-form-header-case-or-referral-number'}>
          {this.props.assessment.service_source_ui_id}
        </div>
      </Fragment>
    )
  }

  renderCardHeader() {
    return (
      <CardHeader>
        <CardTitle className={'assessment-header-title'}>
          {this.renderClientName()}
          {this.renderCounty()}
        </CardTitle>
      </CardHeader>
    )
  }

  renderTopLabels() {
    return (
      <Row>
        <Col sm={2}>
          <Label
            required
            id={'assessment-date-label'}
            className={'assessment-form-header-label'}
            htmlFor="assessment-date_input"
          >
            Assessment Date *
          </Label>
        </Col>
        <Col sm={3}>
          <Label className={'assessment-form-header-label'}>Select CANS Template *</Label>
        </Col>
        <Col sm={4}>
          <Label for={'conducted-by'} className={'assessment-form-header-label'}>
            Assessment Conducted by
          </Label>
        </Col>
        <Col sm={3}>
          <Label
            id={'case-or-referral-number-label'}
            htmlFor={'case-or-referral-number'}
            className={'assessment-form-header-label'}
          >
            {clientCaseReferralNumber(this.props.assessment.service_source)}
          </Label>
        </Col>
      </Row>
    )
  }

  renderCardContent() {
    const assessment = this.props.assessment
    const hasCaregiver = (assessment || {}).has_caregiver
    const canReleaseInfo = (assessment || {}).can_release_confidential_info
    return (
      <CardBody>
        {this.renderTopLabels()}
        <Row className={'assessment-form-header-inputs'}>
          <Col sm={2}>{this.renderDateSelect()}</Col>
          <Col xs={3}>
            <AgeRangeSwitch
              isUnderSix={assessment.state.under_six}
              onChange={this.updateUnderSixAndAllDomainsExpand}
              disabled={this.props.disabled}
            />
          </Col>
          <Col sm={4}>
            <ConductedByField
              id={'conducted-by'}
              value={assessment.conducted_by}
              onChange={this.handleConductedByChange}
              disabled={this.props.disabled}
            />
          </Col>
          <Col sm={3}>{this.renderCaseNumber()}</Col>
        </Row>

        <AssessmentOptions
          assessment={assessment}
          canReleaseConfidentialInfo={canReleaseInfo}
          hasCaregiver={hasCaregiver}
          isDisabled={this.props.disabled}
          isUnderSix={assessment.state.under_six}
          onCanReleaseInfoChange={this.handleCanReleaseInfoChange}
          onHasCaregiverChange={this.handleHasCaregiverChange}
          onHasCaregiverNoClicked={this.handleHasCaregiverSwitcher}
          substanceUseItemsIds={this.props.substanceUseItemsIds}
        />
      </CardBody>
    )
  }

  render() {
    return (
      <Card className="assessment-form-header-card">
        {this.renderCardHeader()}
        {this.renderCardContent()}
      </Card>
    )
  }
}
AssessmentFormHeader.defaultProps = {
  disabled: false,
  isEventDateBeforeDob: false,
  onEventDateFieldKeyUp: () => {},
  handleWarningShow: () => {},
  expandCollapse: () => {},
}
AssessmentFormHeader.propTypes = {
  assessment: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  expandCollapse: PropTypes.func,
  handleWarningShow: PropTypes.func,
  isEventDateBeforeDob: PropTypes.bool,
  onAssessmentUpdate: PropTypes.func.isRequired,
  onEventDateFieldKeyUp: PropTypes.func,
  substanceUseItemsIds: PropTypes.shape({
    underSix: PropTypes.array.isRequired,
    aboveSix: PropTypes.array.isRequired,
  }).isRequired,
}

export default AssessmentFormHeader
