import React from 'react'
import { mount } from 'enzyme'
import { headerFakeProps } from './PrintAssessmentHeader.test.js'
import PrintAssessmentOverallHeader from './PrintAssessmentOverallHeader'
import { formatClientName } from '../../Client/Client.helper'

const fakeProps = {
  ageRange: '0 - 5',
  printStatus: 'DRAFT',
  reassessmentInfo: 'Reassessment',
  ...headerFakeProps,
}
fakeProps.client.middle_name = 'M'
const lineContentAssertion = (target, content) => {
  expect(target.contains(content)).toBe(true)
}

describe('<PrintAssessmentOverallHeader />', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(<PrintAssessmentOverallHeader {...fakeProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('will render a svg', () => {
    const target = wrapper.find('svg')
    expect(target.length).toBe(1)
  })

  it('will render first line with correct content', () => {
    const target1 = wrapper.find('#first-line-left')
    const target2 = wrapper.find('#first-line-right')
    expect(target1.length).toBe(1)
    lineContentAssertion(target1, fakeProps.eventDate)
    lineContentAssertion(target1, fakeProps.reassessmentInfo)
    expect(target2.length).toBe(1)
    lineContentAssertion(target2, fakeProps.caseReferralNumberTitle)
    lineContentAssertion(target2, fakeProps.caseReferralNumber)
  })

  it('will render second line with correct content', () => {
    const target1 = wrapper.find('#sec-line-left')
    const target2 = wrapper.find('#sec-line-right')
    expect(target1.length).toBe(1)
    lineContentAssertion(target1, formatClientName(fakeProps.client))
    expect(target2.length).toBe(1)
    lineContentAssertion(target2, fakeProps.clientDob)
  })

  it('will render third line with correct content', () => {
    const target1 = wrapper.find('#third-line-left')
    const target2 = wrapper.find('#third-line-right')
    const target3 = wrapper.find('#third-line-middle')
    expect(target1.length).toBe(1)
    lineContentAssertion(target1, fakeProps.countyName)
    lineContentAssertion(target1, fakeProps.ageRange)
    expect(target2.length).toBe(1)
    lineContentAssertion(target2, fakeProps.clientAge)
    expect(target3.length).toBe(1)
    lineContentAssertion(target3, fakeProps.printStatus)
  })
})
