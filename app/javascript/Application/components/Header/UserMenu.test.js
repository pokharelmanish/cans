import React from 'react'
import { shallow } from 'enzyme'
import UserMenu from './UserMenu'
import { MenuItem, UncontrolledUserMenu } from '@cwds/components'
import pageLockService from '../common/PageLockService'
import UserAccountService from '../common/UserAccountService'

describe('<UserMenu />', () => {
  const render = user => shallow(<UserMenu user={user} />)

  it('renders a dropdown menu', () => {
    expect(render().type()).toBe(UncontrolledUserMenu)
  })

  it('renders a toggle with user name', () => {
    const userMenu = render({ first_name: 'Eddard', last_name: 'Stark' })
    expect(userMenu.find(UncontrolledUserMenu).props().label).toEqual('Eddard Stark')
  })

  it('renders a logout item', () => {
    const item = render().find(MenuItem)
    expect(item.props().children).toBe('Logout')
  })

  it('confirms pageLockService service to log out on logout item click', () => {
    pageLockService.confirm = jest.fn()
    render()
      .find(MenuItem)
      .simulate('click')
    expect(pageLockService.confirm).toHaveBeenCalledTimes(1)
    expect(pageLockService.confirm).toHaveBeenCalledWith(UserAccountService.logout)
  })
})
