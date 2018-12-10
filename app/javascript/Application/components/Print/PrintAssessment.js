import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { getI18nByCode } from '../Assessment/I18nHelper'
import {
  alertSignBox,
  alertSvgStyle,
  exclamationTriangle,
  exclamationTriangleViewPort,
  headerBlock,
  headerNameRow,
  headerRecord,
  headerRow,
  itemStyle,
  itemMainLine,
  itemComment,
  itemTitleWrapper,
  itemTitle,
  optionStyle,
  optionRadioStyle,
  optionLabelStyle,
  domainTitleStyle,
  domainHeaderStyle,
  domainComment,
  flex,
  redactedRating,
  textAlignCenter,
  timeStampStyle,
  thinGrayBorder,
} from './PrintAssessmentStyle'
import { formatClientName } from '../Client/Client.helper'
import { isoToLocalDate } from '../../util/dateHelper'
import { shouldDomainBeRendered, shouldItemBeRendered } from '../Assessment/AssessmentHelper'
import { totalScoreCalculation } from '../Assessment/DomainScoreHelper.js'
import moment from 'moment'

const isItemHidden = item => item.confidential_by_default && item.confidential

const hasConfidentialItems = domain => domain.items.filter(isItemHidden).length > 0

class PrintAssessment extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isAssessmentUnderSix: Boolean(this.props.assessment.state.under_six),
    }
  }

  renderOptions = (item, isRegularType) => {
    const optionCodes = {
      notApplicable: 8,
      value0orNo: 0,
      value1orYes: 1,
      value2: 2,
      value3: 3,
    }
    return (
      <div style={flex}>
        <div style={itemTitleWrapper}>
          <div style={optionLabelStyle}>Rating:</div>
        </div>
        <div style={flex}>
          {item.has_na_option && this.renderOption(item.rating === optionCodes.notApplicable, 'N/A')}
          {this.renderOption(item.rating === optionCodes.value0orNo, isRegularType ? '0' : 'No')}
          {this.renderOption(item.rating === optionCodes.value1orYes, isRegularType ? '1' : 'Yes')}
          {isRegularType && this.renderOption(item.rating === optionCodes.value2, '2')}
          {isRegularType && this.renderOption(item.rating === optionCodes.value3, '3')}
        </div>
      </div>
    )
  }

  renderOption = (isChecked, label) => (
    <div style={optionStyle}>
      <input style={optionRadioStyle} type="radio" checked={isChecked} readOnly />
      <span style={optionLabelStyle}>{label}</span>
    </div>
  )

  renderItem = (item, index, caregiverIndex, itemI18n) => {
    const title = itemI18n._title_ || ''
    const itemNumber = this.state.isAssessmentUnderSix ? item.under_six_id : item.above_six_id
    const isRegularType = item.rating_type === 'REGULAR'
    return (
      <div key={caregiverIndex + itemNumber} style={itemStyle}>
        <div style={itemMainLine}>
          <div style={itemTitleWrapper}>
            <div style={itemTitle}>
              {itemNumber}
              {caregiverIndex}. {title}
            </div>
          </div>
          <div style={flex}>
            <div style={itemTitleWrapper}>
              <div style={optionLabelStyle}>{item.confidential_by_default ? 'Confidential' : 'Discretion Needed'} </div>
            </div>
            <div style={itemTitleWrapper}>
              <input type={'checkbox'} checked={item.confidential} readOnly />
            </div>
          </div>
          {!isItemHidden(item) ? this.renderOptions(item, isRegularType) : <div style={redactedRating} />}
        </div>
        {item.comment && !isItemHidden(item) ? <div style={itemComment}>Comment: {item.comment}</div> : null}
      </div>
    )
  }

  renderDomain = (domain, domainI18n) => {
    const { code, caregiver_index: caregiverIndex, items, comment } = domain
    const title = (domainI18n._title_ || '').toUpperCase()
    const caregiverName = domain.caregiver_name || ''
    const totalScore = totalScoreCalculation(items)
    return (
      <div key={code + caregiverIndex}>
        <div style={domainHeaderStyle}>
          <div style={domainTitleStyle}>
            {title} {caregiverName && `- ${caregiverName}`}
            {`- (Domain Total Score: ${totalScore})`}
          </div>
          {comment && !hasConfidentialItems(domain) && <div style={domainComment}>Domain Comment: {comment}</div>}
        </div>
        <div style={thinGrayBorder}>
          {items.map((item, index) => {
            const { isAssessmentUnderSix } = this.state
            if (!shouldItemBeRendered(isAssessmentUnderSix, item)) return null
            const itemI18n = getI18nByCode(this.props.i18n, item.code)
            return this.renderItem(item, index, caregiverIndex, itemI18n)
          })}
        </div>
      </div>
    )
  }

  renderConfidentialWarningAlert = () => {
    return (
      <div style={alertSignBox}>
        <svg viewBox={exclamationTriangleViewPort} style={alertSvgStyle}>
          <path d={exclamationTriangle} />
        </svg>
        <strong>
          Since there is no Authorization for Release of Information on file, prior to sharing this CANS assessment
          redact the following domain item numbers: 7, 48, and EC.41.
        </strong>
      </div>
    )
  }

  renderHeaderRecord = (title, value) => (
    <div style={headerRecord}>
      <strong>{title}</strong>
      <span>{value}</span>
    </div>
  )

  renderHeaderRadioGroupRecord = (title, value, optionTrueCaption, optionFalseCaption) => (
    <div style={headerRecord}>
      <strong>{title}</strong>
      <div>
        <input style={optionRadioStyle} type="radio" checked={value} readOnly />
        {optionTrueCaption || 'Yes'}
        <input style={optionRadioStyle} type="radio" checked={!value} readOnly />
        {optionFalseCaption || 'No'}
      </div>
    </div>
  )

  renderHeader() {
    const assessment = this.props.assessment
    const clientName = formatClientName(assessment.person)
    const countyName = assessment.county.name ? `${assessment.county.name} County` : ''
    const eventDate = isoToLocalDate(assessment.event_date)
    const conductedBy = assessment.conducted_by || ''
    const caseNumber = (assessment.the_case || {}).external_id
    const hasCaregiver = assessment.has_caregiver
    const canReleaseInfo = assessment.can_release_confidential_info
    const isUnderSix = this.props.assessment.state.under_six
    return (
      <div style={headerBlock}>
        <h1 style={textAlignCenter}>CANS Assessment Form</h1>
        <div style={headerNameRow}>
          <h2>{clientName}</h2>
          <h2>{countyName}</h2>
        </div>
        <div style={headerRow}>
          {this.renderHeaderRecord('Date', eventDate)}
          {this.renderHeaderRecord('Conducted by', conductedBy)}
          {this.renderHeaderRecord('Case Number', caseNumber)}
          {this.renderHeaderRecord('Complete as', assessment.completed_as)}
        </div>
        <div style={headerRow}>
          {this.renderHeaderRadioGroupRecord('Child/Youth has Caregiver?', hasCaregiver)}
          {this.renderHeaderRadioGroupRecord('Authorization for release of information on file?', canReleaseInfo)}
          {this.renderHeaderRadioGroupRecord('Age', isUnderSix, '0-5', '6-21')}
        </div>
        {!canReleaseInfo && this.renderConfidentialWarningAlert()}
        <span style={timeStampStyle}>{moment().format('MMMM D YYYY, h:mm:ss a')}</span>
      </div>
    )
  }

  render() {
    const { isAssessmentUnderSix } = this.state
    const { i18n } = this.props
    const domains = this.props.assessment.state.domains
    return (
      <div>
        {this.renderHeader()}
        {domains.map(domain => {
          if (!shouldDomainBeRendered(isAssessmentUnderSix, domain)) return null
          const domainI18n = getI18nByCode(i18n, domain.code)
          return this.renderDomain(domain, domainI18n)
        })}
      </div>
    )
  }
}

PrintAssessment.propTypes = {
  assessment: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
}

export default PrintAssessment
