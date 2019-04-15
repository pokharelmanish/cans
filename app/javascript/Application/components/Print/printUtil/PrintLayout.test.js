import React from 'react'
import { mount } from 'enzyme'
import PrintLayout from './PrintLayout'

const node = <div>wow</div>

const fakeProps = {
  header: 'some header',
  footer: 'some footer',
  children: node,
}

describe('<PrintLayout />', () => {
  let wrapper
  afterEach(() => {
    wrapper.unmount()
  })

  it('will render a table with correct className', () => {
    wrapper = mount(<PrintLayout {...fakeProps} />)
    const target = wrapper.find('table')
    expect(target.length).toBe(1)
    expect(target.props().className).toBe('print-container')
  })

  it('will render a thead with correct className and content', () => {
    wrapper = mount(<PrintLayout {...fakeProps} />)
    const target = wrapper.find('thead')
    expect(target.length).toBe(1)
    expect(target.props().className).toBe('print-header')
    expect(target.text()).toContain(fakeProps.header)
  })

  it('will render a tfoot with correct className and content', () => {
    wrapper = mount(<PrintLayout {...fakeProps} />)
    const target = wrapper.find('tfoot')
    expect(target.length).toBe(1)
    expect(target.props().className).toBe('print-footer')
    expect(target.text()).toContain(fakeProps.footer)
  })

  it('will render a tbody with correct content', () => {
    wrapper = mount(<PrintLayout {...fakeProps} />)
    const target = wrapper.find('tbody')
    expect(target.length).toBe(1)
    expect(target.text()).toContain('wow')
  })
})
