import React from 'react'
import { mount } from 'enzyme'
import PrintAssessment from './PrintAssessment'
import {
  assessmentPrint,
  assessmentReadyForCompletion,
  validAssessment,
  updatedAssessment,
  i18nPrint,
} from '../../Assessment/assessment.mocks.test'
import PrintLayout from '../printUtil/PrintLayout'
import CategoryHeader from '../printUtil/CategoryHeader'
import PrintPageBreaker from '../printUtil/PrintPageBreaker'
import PrintSummary from './PrintSummary'
import PrintDomain from './PrintDomain'
import PrintAssessmentHeadline from './PrintAssessmentHeadline'
import PrintAssessmentHeader from './PrintAssessmentHeader'
import PrintAssessmentOverallHeader from './PrintAssessmentOverallHeader'
import PrintAssessmentOverallFooter from './PrintAssessmentOverallFooter'

const substanceUseItemsIds = { underSix: ['41'], aboveSix: ['8', '48'] }

const normalFakeProps = {
  assessment: { ...assessmentPrint },
  i18n: i18nPrint,
  substanceUseItemsIds,
}

const readyFakeProps = {
  assessment: { ...assessmentReadyForCompletion },
  i18n: i18nPrint,
  substanceUseItemsIds,
}

const completedFakeProps = {
  assessment: { ...validAssessment },
  i18n: i18nPrint,
  substanceUseItemsIds,
}

const wrongAgeFakeProps = {
  assessment: { has_caregiver: false, ...updatedAssessment },
  i18n: i18nPrint,
  substanceUseItemsIds,
}

describe('<PrintAssessment />', () => {
  let wrapper
  let target
  const getWrapper = props => {
    wrapper = mount(<PrintAssessment {...props} />)
  }

  afterEach(() => {
    wrapper.unmount()
  })

  it('will render a PrintLayout', () => {
    getWrapper(normalFakeProps)
    target = wrapper.find(PrintLayout)
    expect(target.length).toBe(1)
  })

  it('will render a PrintAssessmentOverallHeader with correct props', () => {
    getWrapper(normalFakeProps)
    target = wrapper.find(PrintAssessmentOverallHeader)
    expect(target.length).toBe(1)
    expect(Object.keys(target.props())).toContain(
      'client',
      'clientDob',
      'clientAge',
      'countyName',
      'eventDate',
      'conductedBy',
      'caseReferralNumberTitle',
      'caseReferralNumber',
      'assessmentType',
      'hasCaregiver',
      'canReleaseInfo',
      'isUnderSix',
      'ageRange',
      'reassessmentInfo'
    )
  })

  it('will render a PrintAssessmentOverallFooter with correct props', () => {
    getWrapper(normalFakeProps)
    target = wrapper.find(PrintAssessmentOverallFooter)
    expect(target.length).toBe(1)
    expect(Object.keys(target.props())).toContain('text', 'isFirefox')
  })

  it('will render a PrintAssessmentHeadline with correct props', () => {
    getWrapper(normalFakeProps)
    target = wrapper.find(PrintAssessmentHeadline)
    expect(target.length).toBe(1)
    expect(Object.keys(target.props())).toContain('ageRange', 'reassessmentInfo')
  })

  it('will render a PrintAssessmentHeader with correct props', () => {
    getWrapper(normalFakeProps)
    target = wrapper.find(PrintAssessmentHeader)
    expect(target.length).toBe(1)
    expect(Object.keys(target.props())).toContain(
      'client',
      'clientDob',
      'clientAge',
      'countyName',
      'eventDate',
      'conductedBy',
      'caseReferralNumberTitle',
      'caseReferralNumber',
      'assessmentType',
      'hasCaregiver',
      'canReleaseInfo',
      'isUnderSix',
      'ageRange',
      'reassessmentInfo',
      'confidentialWarningAlert'
    )
  })

  it('will generate correct canReleaseInfo and pass it to PrintAssessmentHeader', () => {
    const expectedInfo = `By selecting NO, Items ${
      normalFakeProps.substanceUseItemsIds.aboveSix[0]
    }, 48, and EC 41 (Substance Use Disorder
        Items) from this CANS assessment will be redacted when printed.`
    getWrapper(normalFakeProps)
    target = wrapper.find(PrintAssessmentHeader)
    expect(target.length).toBe(1)
    expect(target.props().confidentialWarningAlert).toContain(expectedInfo)
  })

  it('will render a CategoryHeader with correct props', () => {
    getWrapper(normalFakeProps)
    target = wrapper.find(CategoryHeader)
    expect(target.length).toBe(1)
    expect(Object.keys(target.props())).toContain('title')
  })

  it('normally will render PrintDomain with correct props', () => {
    getWrapper(completedFakeProps)
    target = wrapper.find(PrintDomain)
    expect(target.exists()).toBe(true)
    expect(Object.keys(target.at(0).props())).toContain('domain', 'domainI18n', 'i18n', 'isAssessmentUnderSix')
  })

  it('will not render PrintDomain for the domain which does not match the ageRange', () => {
    getWrapper(wrongAgeFakeProps)
    target = wrapper.find(PrintDomain)
    expect(target.exists()).toBe(false)
  })

  it('will render a PrintPageBreaker for assessment which is ready for completion ', () => {
    getWrapper(readyFakeProps)
    target = wrapper.find(PrintPageBreaker)
    expect(target.length).toBe(1)
  })

  it('will render a PrintPageBreaker for completed assessment', () => {
    getWrapper(completedFakeProps)
    target = wrapper.find(PrintPageBreaker)
    expect(target.length).toBe(1)
  })

  it('will render a PrintSummary for assessment which is ready for completion with correct props ', () => {
    getWrapper(readyFakeProps)
    target = wrapper.find(PrintSummary)
    expect(target.length).toBe(1)
    expect(Object.keys(target.props())).toContain('domains', 'i18n', 'isUnderSix')
  })

  it('will render a PrintSummary for completed assessment with correct props', () => {
    getWrapper(completedFakeProps)
    target = wrapper.find(PrintSummary)
    expect(target.length).toBe(1)
    expect(Object.keys(target.props())).toContain('domains', 'i18n', 'isUnderSix')
  })
})
