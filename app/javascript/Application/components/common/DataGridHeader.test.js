import React from 'react'
import { shallow } from 'enzyme'
import { Icon } from '@cwds/components'
import { UncontrolledInfotip, PopoverBody } from '@cwds/components'
import DataGridHeader from './DataGridHeader'

describe('<DataGridHeader />', () => {
  const render = (title, tooltip, index) => shallow(<DataGridHeader title={title} tooltip={tooltip} index={index} />)

  it('has a title', () => {
    expect(render('Hello World', '(>")>').text()).toContain('Hello World')
  })

  it('has a tooltip', () => {
    const header = render('(^"^)', 'Hello Tooltip')
    const tooltip = header.find(UncontrolledInfotip)
    const popover = header.find(PopoverBody)
    expect(tooltip.exists()).toBe(true)
    expect(popover.props().children).toBe('Hello Tooltip')
    expect(tooltip.props().placement).toBe('top')
  })

  it('renders no Tooltip when not needed', () => {
    const header = render('(^"^)')
    expect(header.find(PopoverBody).exists()).toBeFalsy()
  })
})
