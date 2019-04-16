import React from 'react'
import { mount } from 'enzyme'
import UncheckedRadio from './UncheckedRadio'

describe('<UncheckedRadio />', () => {
  let wrapper
  afterEach(() => {
    wrapper.unmount()
  })

  it('will render a svg', () => {
    wrapper = mount(<UncheckedRadio />)
    const target = wrapper.find('svg')
    expect(target.length).toBe(1)
  })

  it('will render a circle with correct color', () => {
    wrapper = mount(<UncheckedRadio />)
    const target = wrapper.find('circle')
    expect(target.props().fill).toBe('#ffffff')
  })
})
