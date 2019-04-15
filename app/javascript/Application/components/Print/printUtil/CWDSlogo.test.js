import React from 'react'
import { mount } from 'enzyme'
import CWDSlogo from './CWDSlogo'

describe('<CWDSlogo />', () => {
  let wrapper
  afterEach(() => {
    wrapper.unmount()
  })

  it('will render a svg', () => {
    wrapper = mount(<CWDSlogo />)
    const target = wrapper.find('svg')
    expect(target.length).toBe(1)
  })
})
