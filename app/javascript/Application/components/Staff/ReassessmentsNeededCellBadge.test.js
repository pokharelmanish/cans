import React from 'react'
import { shallow } from 'enzyme'
import ReassessmentsNeededCellBadge from './ReassessmentsNeededCellBadge'
import { Badge } from '@cwds/components'

describe('<ReassessmentsNeededCellBadge />', () => {
  const render = (color, number) => shallow(<ReassessmentsNeededCellBadge color={color} number={number} />)

  it('renders plain 0 when number prop is 0', () => {
    const wrapper = render('warning', 0)
    expect(wrapper.find('div.reassess-needed-badge').props().children).toEqual(0)
  })

  it('renders pill badge when number prop is more than 0', () => {
    const wrapper = render('danger', 1)
    const badge = wrapper.find('div.reassess-needed-badge').find(Badge)
    expect(badge.props().pill).toBeTruthy()
    expect(badge.props().color).toEqual('danger')
    expect(badge.props().children).toEqual(1)
  })
})
