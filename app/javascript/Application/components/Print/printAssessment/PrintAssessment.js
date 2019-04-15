import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { getI18nByCode } from '../../common/I18nHelper'
import { isFirefox, isIE } from '../../../util/common'
import PrintSummary from './PrintSummary'
import PrintLayout from '../printUtil/PrintLayout'
import CategoryHeader from '../printUtil/CategoryHeader'
import PrintPageBreaker from '../printUtil/PrintPageBreaker'
import PrintDomain from './PrintDomain'
import PrintAssessmentHeadline from './PrintAssessmentHeadline'
import PrintAssessmentHeader from './PrintAssessmentHeader'
import PrintAssessmentOverallHeader from './PrintAssessmentOverallHeader'
import PrintAssessmentOverallFooter from './PrintAssessmentOverallFooter'
import { clientCaseReferralNumber } from '../../Client/Client.helper'
import { calculateDateDifferenceInYears, isValidDate, isoToLocalDate } from '../../../util/dateHelper'
import {
  shouldDomainBeRendered,
  validateAssessmentForSubmit,
  isSubsequentType,
} from '../../Assessment/AssessmentHelper'
import moment from 'moment/moment'

class PrintAssessment extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isAssessmentUnderSix: Boolean(this.props.assessment.state.under_six),
    }
  }
  handleClientAge = dob => {
    return isValidDate(dob) ? `${calculateDateDifferenceInYears(dob, moment())}` : ''
  }

  handleAgeRange = isUnderSix => {
    return isUnderSix ? '0 - 5' : '6 - 21'
  }

  handleTimeStamp = () => {
    return moment().format('M/D/YYYY h:mm a')
  }

  handleIsReassessmentInfo = assessment => {
    const checker = isSubsequentType(assessment.assessment_type)
    return checker ? 'Reassessment' : 'Assessment'
  }

  handleConfidentialWarningAlert = () => {
    return `By selecting NO, Items ${this.props.substanceUseItemsIds.aboveSix[0]}, 48, and EC 41 (Substance Use Disorder
        Items) from this CANS assessment will be redacted when printed.`
  }

  handlePrintStatus = status => {
    return status === 'IN_PROGRESS' ? 'DRAFT' : 'FINAL'
  }

  renderDomain = (domains, isAssessmentUnderSix, i18n) => {
    return domains.map((domain, index) => {
      if (!shouldDomainBeRendered(isAssessmentUnderSix, domain)) return null
      const domainI18n = getI18nByCode(i18n, domain.code)
      const printDomainProps = {
        domain,
        domainI18n,
        i18n,
        isAssessmentUnderSix,
      }
      return <PrintDomain key={`print-domain-${index}`} {...printDomainProps} />
    })
  }

  render() {
    const { isAssessmentUnderSix } = this.state
    const { i18n, assessment } = this.props
    const domains = this.props.assessment.state.domains
    const isUnderSix = assessment.state.under_six
    const reassessmentInfo = this.handleIsReassessmentInfo(assessment)
    const printAssessmentHeaderProps = {
      client: assessment.person,
      clientDob: isoToLocalDate(assessment.person.dob),
      clientAge: this.handleClientAge(assessment.person.dob),
      countyName: assessment.county && assessment.county.name ? `${assessment.county.name}` : '',
      eventDate: isoToLocalDate(assessment.event_date),
      conductedBy: assessment.conducted_by || '',
      caseReferralNumberTitle: clientCaseReferralNumber(assessment.service_source),
      caseReferralNumber: assessment.service_source_ui_id,
      assessmentType: assessment.completed_as,
      hasCaregiver: assessment.has_caregiver,
      canReleaseInfo: assessment.can_release_confidential_info,
      isUnderSix: assessment.state.under_six,
      ageRange: this.handleAgeRange(isUnderSix),
      reassessmentInfo,
    }
    const canDisplaySummary =
      validateAssessmentForSubmit(this.props.assessment) || this.props.assessment.status === 'COMPLETED'

    return (
      <PrintLayout
        header={
          <PrintAssessmentOverallHeader
            printStatus={this.handlePrintStatus(assessment.status)}
            {...printAssessmentHeaderProps}
          />
        }
        footer={<PrintAssessmentOverallFooter text={this.handleTimeStamp()} isFirefox={isFirefox} />}
      >
        <PrintAssessmentHeadline ageRange={this.handleAgeRange(isUnderSix)} reassessmentInfo={reassessmentInfo} />
        <PrintAssessmentHeader
          confidentialWarningAlert={this.handleConfidentialWarningAlert()}
          {...printAssessmentHeaderProps}
        />
        <CategoryHeader title="CANS Ratings" />
        {this.renderDomain(domains, isAssessmentUnderSix, i18n)}
        {canDisplaySummary ? (
          <div>
            <PrintPageBreaker isIE={isIE} />
            <PrintSummary domains={domains} i18n={this.props.i18n} isUnderSix={this.state.isAssessmentUnderSix} />
          </div>
        ) : null}
      </PrintLayout>
    )
  }
}

PrintAssessment.propTypes = {
  assessment: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  substanceUseItemsIds: PropTypes.shape({
    underSix: PropTypes.array.isRequired,
    aboveSix: PropTypes.array.isRequired,
  }).isRequired,
}

export default PrintAssessment
