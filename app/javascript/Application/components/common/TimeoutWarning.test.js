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

  describe('#changeCardZIndex', () => {
    it('will changes card z-index', () => {
      const wrapper = shallow(
        <div className={'card-fix'}>
          <TimeoutWarning {...props} />
        </div>
      )
      const cards = []
      jest.spyOn(document, 'querySelectorAll').mockReturnValue(cards)
      wrapper
        .find(TimeoutWarning)
        .dive()
        .instance()
        .changeCardZIndex(-1)
      expect(document.querySelectorAll).toHaveBeenCalledWith('.card-fix')
      expect(document.querySelectorAll).toHaveBeenCalledTimes(1)
    })

    it('will be invoked on modal open', () => {
      const wrapper = shallow(<TimeoutWarning {...props} />)
      const spy = jest.spyOn(wrapper.instance(), 'changeCardZIndex')
      wrapper.instance().onTimeoutEvent()
      expect(wrapper.instance().state.isOpened).toBeTruthy()
      expect(spy).toHaveBeenCalledWith(-1)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('will be invoked on refresh', () => {
      const wrapper = shallow(<TimeoutWarning {...props} />)
      const spy = jest.spyOn(wrapper.instance(), 'changeCardZIndex')
      wrapper.instance().refresh()
      expect(wrapper.instance().state.isOpened).toBeFalsy()
      expect(spy).toHaveBeenCalledWith(0)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

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
