import React from 'react'
import { shallow } from 'enzyme'
import PrintAssessmentHeadline from './PrintAssessmentHeadline'
import CWDSlogo from '../printUtil/CWDSlogo'

const fakeProps = {
  reassessmentInfo: 'Reassessment',
  ageRange: '0 - 5',
}

describe('<PrintAssessmentHeadline />', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<PrintAssessmentHeadline {...fakeProps} />)
  })

  it('will render a headlineContainer with correct content', () => {
    const target = wrapper.find('#headlineContainer')
    expect(target.length).toBe(1)
    expect(target.text()).toContain('CARES - CANS', 'Reassessment', '0 - 5')
  })

  it('will render a CWDSlogo', () => {
    const target = wrapper.find(CWDSlogo)
    expect(target.length).toBe(1)
  })
})
