import React from 'react'
import { mount } from 'enzyme'
import CategoryHeader from './CategoryHeader'

const fakeProps = {
  title: 'some text',
}

describe('<PrintDomainHeader />', () => {
  let wrapper
  afterEach(() => {
    wrapper.unmount()
  })

  it('will render a svg', () => {
    wrapper = mount(<CategoryHeader {...fakeProps} />)
    const target = wrapper.find('svg')
    expect(target.length).toBe(1)
  })

  it('will render an rect with correct color', () => {
    wrapper = mount(<CategoryHeader {...fakeProps} />)
    const target = wrapper.find('rect')
    expect(target.props().style.fill).toBe('#dfdfdf')
  })

  it('will render correct title', () => {
    wrapper = mount(<CategoryHeader {...fakeProps} />)
    const target = wrapper.find('text')
    expect(target.text()).toContain(fakeProps.title)
  })
})
