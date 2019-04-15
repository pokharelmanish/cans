import React from 'react'
import { shallow } from 'enzyme'
import ReassessmentsNeededCell from './ReassessmentsNeededCell'
import { Badge } from '@cwds/components'

describe('<ReassessmentsNeededCell />', () => {
  const render = (color, number) => shallow(<ReassessmentsNeededCell value={{ color, number }} />)

  it('renders plain 0 when number prop is 0', () => {
    const wrapper = render('warning', 0)
    expect(wrapper.equals(0)).toBeTruthy()
  })

  it('renders pill badge when number prop is more than 0', () => {
    const wrapper = render('danger', 1)
    const badge = wrapper.find(Badge)
    expect(badge.props().pill).toBeTruthy()
    expect(badge.props().color).toEqual('danger')
    expect(badge.props().children).toEqual(1)
  })
})
