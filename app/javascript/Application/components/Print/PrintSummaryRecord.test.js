import React from 'react'
import { shallow } from 'enzyme'
import PrintSummaryRecord from './PrintSummaryRecord'

describe('<PrintSummaryRecord />', () => {
  const render = ({ title = 'Strengths', items = ['Family Strengths', 'Interpersonal'] } = {}) =>
    shallow(<PrintSummaryRecord title={title} items={items} />)

  it('renders assessment summary record header', () => {
    const wrapper = render()
    expect(wrapper.find('#title').text()).toBe('Strengths')
  })

  it('renders assessment summary record with items', () => {
    const wrapper = render()
    expect(wrapper.find('#item').length).toBe(2)
  })
})
