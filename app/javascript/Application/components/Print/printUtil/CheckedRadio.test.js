import React from 'react'
import { mount } from 'enzyme'
import CheckedRadio from './CheckedRadio'

describe('<CheckedRadio />', () => {
  let wrapper
  afterEach(() => {
    wrapper.unmount()
  })

  it('will render a svg', () => {
    wrapper = mount(<CheckedRadio />)
    const target = wrapper.find('svg')
    expect(target.length).toBe(1)
  })

  it('will render a circle with correct color', () => {
    wrapper = mount(<CheckedRadio />)
    const target = wrapper.find('circle')
    expect(target.props().fill).toBe('#000000')
  })
})
