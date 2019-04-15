import React from 'react'
import { shallow } from 'enzyme'
import PrintSummaryRecord from './PrintSummaryRecord'

describe('<PrintSummaryRecord />', () => {
  const render = ({ title = 'Strengths', items = ['Family Strengths', 'Interpersonal'] } = {}) =>
    shallow(<PrintSummaryRecord title={title} items={items} />)

  it('renders assessment summary record header', () => {
    const wrapper = render()
    expect(wrapper.find('#summary-header').text()).toBe('Strengths')
  })

  it('renders assessment summary record with correct amount and content', () => {
    const wrapper = render()
    const target = wrapper.find('#item')
    expect(target.length).toBe(2)
    expect(target.at(0).text()).toContain('Family Strengths')
    expect(target.at(1).text()).toContain('Interpersonal')
  })
})
