import React from 'react'
import { mount } from 'enzyme'
import { Button } from '@cwds/components'
import DomainCollapseButton from './DomainCollapseButton'

const fakeProps = {
  code: 'TRM',
  title: 'Title',
  onClick: jest.fn(),
}

describe('<DomainCollapseButton />', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(<DomainCollapseButton {...fakeProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
    fakeProps.onClick.mockReset()
  })

  it('will render Icon', () => {
    const target = wrapper.find(Button)
    expect(target.exists()).toBe(true)
  })

  it('will render Icon with correct props', () => {
    const target = wrapper.find(Button)
    expect(target.props().id).toBe('TRM-inner-collapse-icon')
    expect(typeof target.props().onClick).toBe('function')
    expect(typeof target.props().onKeyPress).toBe('function')
  })

  it('will invoke onClick after is clicked', () => {
    const target = wrapper.find(Button)
    target.simulate('click')
    expect(fakeProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('will invoke onKeyDown when press the key Enter', () => {
    const target = wrapper.find(Button)
    target.simulate('keypress', { key: 'Enter' })
    expect(fakeProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('will not invoke onKeyDown when press the key other than Enter', () => {
    const target = wrapper.find(Button)
    target.simulate('keypress', { key: 'Tab' })
    expect(fakeProps.onClick).toHaveBeenCalledTimes(0)
  })
})
