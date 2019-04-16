import React from 'react'
import { mount } from 'enzyme'
import PrintDomainCommentHeader from './PrintDomainCommentHeader'

const fakeProps = {
  text: 'some text',
}

describe('<PrintDomainCommentHeader />', () => {
  let wrapper
  afterEach(() => {
    wrapper.unmount()
  })

  it('will render a svg', () => {
    wrapper = mount(<PrintDomainCommentHeader {...fakeProps} />)
    const target = wrapper.find('svg')
    expect(target.length).toBe(1)
  })

  it('will render an rect with correct color', () => {
    wrapper = mount(<PrintDomainCommentHeader {...fakeProps} />)
    const target = wrapper.find('rect')
    expect(target.props().style.fill).toBe('#f3f6f7')
  })

  it('will render correct text', () => {
    wrapper = mount(<PrintDomainCommentHeader {...fakeProps} />)
    const target = wrapper.find('tspan')
    expect(target.text()).toContain(fakeProps.text)
  })
})
