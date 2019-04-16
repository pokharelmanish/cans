import React from 'react'
import { TimeoutWarning } from './TimeoutWarning'
import { shallow } from 'enzyme'
import { eventBus } from './../../util/eventBus'
import { TIMEOUT_EVENT } from './../../util/constants'
import { Button } from '@cwds/components'
import { SecurityService } from './Security.service'
import UserAccountService from '../common/UserAccountService'

describe('<TimeoutWarning />', () => {
  const props = {}

  describe('timeout warning presence trigger', () => {
    it('<TimeoutWarning /> is present when session expiration event is received', () => {
      const wrapper = shallow(<TimeoutWarning {...props} />)
      eventBus.post(TIMEOUT_EVENT)
      expect(wrapper.instance().state.isOpened).toBeTruthy()
    })

    it('<TimeoutWarning /> is not present when session expiration event is received', () => {
      const wrapper = shallow(<TimeoutWarning {...props} />)
      expect(wrapper.instance().state.isOpened).toBeFalsy()
    })
  })

  describe('timeout buttons', () => {
    const logoutImpl = TimeoutWarning.prototype.logout
    const refreshImpl = SecurityService.refresh

    afterEach(() => {
      TimeoutWarning.prototype.logout = logoutImpl
      SecurityService.refresh = refreshImpl
    })

    it('logs out when "Logout" button clicked', () => {
      UserAccountService.logout = jest.fn()
      const wrapper = shallow(<TimeoutWarning {...props} />)
      wrapper
        .find(Button)
        .at(0)
        .simulate('click')
      expect(UserAccountService.logout).toBeCalled()
    })

    it('"Refresh" button calls refresh endpoint on click', () => {
      const wrapper = shallow(<TimeoutWarning {...props} />)
      SecurityService.refresh = jest.fn()
      wrapper
        .find(Button)
        .at(1)
        .simulate('click')
      expect(SecurityService.refresh).toBeCalled()
    })
  })
})
