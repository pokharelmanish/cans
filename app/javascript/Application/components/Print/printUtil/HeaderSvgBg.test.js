import React from 'react'
import { mount } from 'enzyme'
import HeaderSvgBg from './HeaderSvgBg'

const fakeProps = {
  height: '10px',
  color: '#ccc',
}

describe('<HeaderSvgBg />', () => {
  let wrapper
  afterEach(() => {
    wrapper.unmount()
  })

  it('will render a svg with correct height', () => {
    wrapper = mount(<HeaderSvgBg {...fakeProps} />)
    const target = wrapper.find('svg')
    expect(target.length).toBe(1)
    expect(target.props().height).toBe(fakeProps.height)
  })

  it('will render an rect with correct color', () => {
    wrapper = mount(<HeaderSvgBg {...fakeProps} />)
    const target = wrapper.find('rect')
    expect(target.length).toBe(1)
    expect(target.props().style.fill).toBe(fakeProps.color)
  })
})
