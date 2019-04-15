import React from 'react'
import { shallow } from 'enzyme'
import { Icon } from '@cwds/components'
import { Link, MemoryRouter } from 'react-router-dom'
import { buildSaveAssessmentButton, buildSearchClientsButton } from './PageHeaderButtonsBuilder'

describe('<PageHeaderButtonsBuilder />', () => {
  it('#buildSaveAssessmentButton()', () => {
    const saveAssessmentButton = shallow(buildSaveAssessmentButton(jest.fn(), false))
    const buttonProps = saveAssessmentButton.find('Button').props()
    expect(buttonProps.disabled).toBeTruthy()
    expect(saveAssessmentButton.find('span').text()).toBe('Save')
  })

  it('#buildSearchClientsButton()', () => {
    const clientSearchButton = shallow(<MemoryRouter>{buildSearchClientsButton()}</MemoryRouter>)
    expect(clientSearchButton.find(Link).props().to).toContain('/search')
    expect(clientSearchButton.find(Icon).props().icon).toBe('search')
    expect(clientSearchButton.find('span').text()).toBe('Client Search')
  })
})
