import React from 'react'
import { mount } from 'enzyme'
import PrintAssessmentHeaderOptions from './PrintAssessmentHeaderOptions'
import CheckedRadio from '../printUtil/CheckedRadio'
import UncheckedRadio from '../printUtil/UncheckedRadio'

const yesFakeProps = {
  isChecked: true,
}

const noFakeProps = {
  isChecked: false,
}

describe('<PrintAssessmentHeaderOptions />', () => {
  let wrapper
  const getWrapper = props => {
    wrapper = mount(<PrintAssessmentHeaderOptions {...props} />)
  }

  afterEach(() => {
    wrapper.unmount()
  })

  it('will render a CheckedRadio behind as first raido, UncheckedRadio as second radio', () => {
    getWrapper(yesFakeProps)
    const target1 = wrapper.find('#header-options-first')
    const target2 = wrapper.find('#header-options-second')
    expect(target1.find(CheckedRadio).length).toBe(1)
    expect(target2.find(UncheckedRadio).length).toBe(1)
  })

  it('will render a UncheckedRadio as first radio, CheckedRadio as second radio', () => {
    getWrapper(noFakeProps)
    const target1 = wrapper.find('#header-options-first')
    const target2 = wrapper.find('#header-options-second')
    expect(target1.find(UncheckedRadio).length).toBe(1)
    expect(target2.find(CheckedRadio).length).toBe(1)
  })
})
