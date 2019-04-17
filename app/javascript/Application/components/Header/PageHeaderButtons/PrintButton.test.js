import React from 'react'
import { shallow } from 'enzyme'
import PrintButton from './PrintButton'
import { Print } from '../../Print'
import pageLockService from './../../common/PageLockService'

describe('PrintButton', () => {
  let wrapper
  const printButton = (enabled, onPrintClick = undefined) => (
    <PrintButton
      node={<div>{'change log'}</div>}
      isEnabled={enabled}
      isAssessmentRendered={true}
      onPrintClick={onPrintClick}
    />
  )

  describe('isEnabled is true', () => {
    beforeEach(() => {
      wrapper = shallow(printButton(true))
    })

    it('renders a print Button enabled', () => {
      const button = wrapper.find('Button.header-button')
      const buttonProps = button.props()
      expect(button.exists()).toBe(true)
      expect(buttonProps.disabled).toBeFalsy()
    })

    it('renders a span with the text "Print"', () => {
      const span = wrapper.find('Button.header-button').find('span.header-button-caption')
      expect(span.exists()).toBe(true)
      expect(span.text()).toBe('Print')
    })
  })

  describe('isEnabled is false', () => {
    beforeEach(() => {
      wrapper = shallow(printButton(false))
    })

    it('renders a print Button disabled', () => {
      const button = wrapper.find('Button.header-button')
      const buttonProps = button.props()
      expect(button.exists()).toBe(true)
      expect(buttonProps.disabled).toBeTruthy()
    })

    it('renders a span with the text "Print"', () => {
      const span = wrapper.find('Button.header-button').find('span.header-button-caption')
      expect(span.exists()).toBe(true)
      expect(span.text()).toBe('Print')
    })
  })

  describe('shouldPrintNow is true', () => {
    it('renders a Print component', () => {
      expect(wrapper.find(Print).exists()).toBe(false)
      wrapper.setState({ shouldPrintNow: true })
      expect(wrapper.find(Print).exists()).toBe(true)
    })
  })

  describe('shouldPrintNow is false', () => {
    it('does not renders a Print component', () => {
      wrapper.setState({ shouldPrintNow: false })
      expect(wrapper.find(Print).exists()).toBe(false)
    })
  })

  describe('togglePrintNow', () => {
    it('should render <Print /> on togglePrintNow()', () => {
      const wrapper = shallow(printButton(true))
      expect(wrapper.find(Print).length).toBe(0)
      // when
      wrapper.instance().togglePrintNow()
      // then
      expect(wrapper.find(Print).length).toBe(1)
    })
  })

  describe('print through keyboard', () => {
    it('should print when a user press ctrl+p', () => {
      const confirm = jest.spyOn(pageLockService, 'confirm')
      const wrapper = shallow(printButton(true))
      wrapper.instance().handleCtrlP({
        ctrlKey: true,
        key: 'p',
        preventDefault: () => {},
      })
      expect(wrapper.find(Print).length).toBe(1)
      expect(confirm).toHaveBeenCalledWith(wrapper.instance().callBeforePrint, {
        isDiscardDisabled: true,
      })
    })

    it('when a user press meta+p', () => {
      const wrapper = shallow(printButton(true))
      wrapper.instance().handleCtrlP({
        metaKey: true,
        key: 'p',
        preventDefault: () => {},
      })
      expect(wrapper.find(Print).length).toBe(1)
    })

    it('should add and remove event handler', () => {
      const adder = jest.spyOn(global, 'addEventListener').mockImplementation(() => {})
      const remover = jest.spyOn(global, 'removeEventListener').mockImplementation(() => {})
      const wrapper = shallow(printButton(true))
      expect(adder).toHaveBeenCalledTimes(1)
      wrapper.unmount()
      expect(remover).toHaveBeenCalledTimes(1)
    })
  })

  describe('#callBeforePrint', () => {
    it('should call #onPrintClick if assigned', () => {
      const onPrintClick = jest.fn()
      const wrapper = shallow(printButton(true, onPrintClick))
      wrapper.instance().callBeforePrint()
      expect(onPrintClick).toHaveBeenCalledTimes(1)
    })

    it('should call #togglePrintNow in no onPrintClick assigned', () => {
      const wrapper = shallow(printButton(true))
      wrapper.instance().togglePrintNow = jest.fn()
      wrapper.instance().callBeforePrint()
      expect(wrapper.instance().togglePrintNow).toHaveBeenCalledTimes(1)
    })
  })
})
