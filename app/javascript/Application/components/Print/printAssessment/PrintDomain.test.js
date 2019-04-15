import React from 'react'
import { mount } from 'enzyme'
import { assessmentPrint, assessmentWithConfidentialItem, i18nPrint } from '../../Assessment/assessment.mocks.test'
import { getI18nByCode } from '../../common/I18nHelper'
import PrintDomain from './PrintDomain'
import PrintItem from './PrintItem'
import PrintDomainHeader from './PrintDomainHeader'
import PrintDomainCommentHeader from './PrintDomainCommentHeader'

const fakePropsWithNoConfidentialItem = {
  domain: { ...assessmentPrint.state.domains[0] },
  domainI18n: getI18nByCode(i18nPrint, 'BEN'),
  i18n: i18nPrint,
  isAssessmentUnderSix: false,
}

const fakePropsWithConfidentialItem = {
  domain: { ...assessmentWithConfidentialItem.state.domains[0] },
  domainI18n: getI18nByCode(i18nPrint, 'BEN'),
  i18n: i18nPrint,
  isAssessmentUnderSix: false,
}

describe('<PrintDomain />', () => {
  let wrapper
  let confidentialWrapper
  beforeEach(() => {
    wrapper = mount(<PrintDomain {...fakePropsWithNoConfidentialItem} />)
    confidentialWrapper = mount(<PrintDomain {...fakePropsWithConfidentialItem} />)
  })

  afterEach(() => {
    wrapper.unmount()
    confidentialWrapper.unmount()
  })

  it('will render a PrintDomainHeader with correct props', () => {
    const target = wrapper.find(PrintDomainHeader)
    expect(target.length).toBe(1)
    expect(Object.keys(target.props())).toContain('text', 'total')
  })

  it('will render PrintItem with correct props', () => {
    const target = wrapper.find(PrintItem)
    expect(target.length).toBeGreaterThan(0)
    expect(Object.keys(target.at(0).props())).toContain(
      'item',
      'index',
      'caregiverIndex',
      'itemI18n',
      'isAssessmentUnderSix',
      'isItemHidden'
    )
  })

  it('will render PrintDomainCommentHeader with correct props when does not have confidential items', () => {
    const target = wrapper.find(PrintDomainCommentHeader)
    expect(target.length).toBe(1)
    expect(Object.keys(target.props())).toContain('text')
  })

  it('will not render PrintDomainCommentHeader does not have confidential items', () => {
    const target = confidentialWrapper.find(PrintDomainCommentHeader)
    expect(target.length).toBe(0)
  })
})
