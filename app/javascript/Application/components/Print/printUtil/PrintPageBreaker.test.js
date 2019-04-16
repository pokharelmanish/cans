import React from 'react'
import { mount } from 'enzyme'
import PrintPageBreaker from './PrintPageBreaker'

describe('<PrintPageBreaker />', () => {
  let wrapper
  afterEach(() => {
    wrapper.unmount()
  })

  it('will render a h1', () => {
    wrapper = mount(<PrintPageBreaker isIE={true} />)
    const target = wrapper.find('h1')
    expect(target.length).toBe(1)
  })

  it('will render a h1 with correct props for broswers otherthan IE', () => {
    wrapper = mount(<PrintPageBreaker isIE={false} />)
    const target = wrapper.find('h1')
    expect(target.props().style.pageBreakInside).toBe('avoid')
    expect(target.props().style.pageBreakAfter).toBe('always')
    expect(target.props().style.marginBottom).toBe('50rem')
  })

  it('will render a h1 with correct props for IE', () => {
    wrapper = mount(<PrintPageBreaker isIE={true} />)
    const target = wrapper.find('h1')
    expect(target.props().style.pageBreakInside).toBe('avoid')
    expect(target.props().style.pageBreakAfter).toBe('always')
    expect(target.props().style.marginBottom).toBe('0rem')
  })
})
