import React from 'react'
import { mount } from 'enzyme'
import { assessmentPrint } from '../../Assessment/assessment.mocks.test'
import PrintAssessmentHeader from './PrintAssessmentHeader'
import PrintAssessmentHeaderOptions from './PrintAssessmentHeaderOptions'
export const headerFakeProps = {
  client: { ...assessmentPrint.person },
  clientDob: '01/01/2015',
  clientAge: '4',
  countyName: 'Jim',
  eventDate: '01/01/2019',
  conductedBy: 'Mike',
  caseReferralNumberTitle: 'case number',
  caseReferralNumber: '123456',
  assessmentType: 'some type',
  hasCaregiver: true,
  canReleaseInfo: true,
  confidentialWarningAlert: 'confidentialWarningAlert',
}
headerFakeProps.client.middle_name = 'M'
describe('<PrintAssessmentHeader />', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(<PrintAssessmentHeader {...headerFakeProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('will render a headerContainer', () => {
    const target = wrapper.find('#headerContainer')
    expect(target.length).toBe(1)
  })

  it('will render first row of header with correct content', () => {
    const target = wrapper.find('#first-row')
    expect(target.length).toBe(1)
    expect(target.contains(headerFakeProps.eventDate)).toBe(true)
    expect(target.contains(headerFakeProps.caseReferralNumber)).toBe(true)
    expect(target.contains(headerFakeProps.assessmentType)).toBe(true)
    expect(target.contains(headerFakeProps.countyName)).toBe(true)
  })

  it('will render second row of header with correct content', () => {
    const target = wrapper.find('#second-row')
    expect(target.length).toBe(1)
    expect(target.contains(headerFakeProps.client.first_name)).toBe(true)
    expect(target.contains(headerFakeProps.client.middle_name)).toBe(true)
    expect(target.contains(headerFakeProps.client.last_name)).toBe(true)
    expect(target.contains(headerFakeProps.clientDob)).toBe(true)
  })

  it('will render third row of header with correct content', () => {
    const target = wrapper.find('#third-row')
    expect(target.length).toBe(1)
    expect(target.contains(headerFakeProps.clientAge)).toBe(true)
    expect(wrapper.find(PrintAssessmentHeaderOptions).length).toBe(2)
  })

  it('will render fourth row of header with correct content', () => {
    const target = wrapper.find('#fourth-row')
    expect(target.length).toBe(1)
    expect(target.contains(headerFakeProps.conductedBy)).toBe(true)
  })
})
