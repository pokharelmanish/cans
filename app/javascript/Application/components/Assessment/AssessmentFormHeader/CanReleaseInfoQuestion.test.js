import React from 'react'
import { shallow } from 'enzyme'
import CanReleaseInfoQuestion from './CanReleaseInfoQuestion'

describe('CanReleaseInfoQuestion', () => {
  const render = ({
    canReleaseConfidentialInfo = false,
    isDisabled,
    message,
    onCanReleaseInfoChange = () => {},
  } = {}) =>
    shallow(
      <CanReleaseInfoQuestion
        canReleaseConfidentialInfo={canReleaseConfidentialInfo}
        isDisabled={isDisabled}
        message={message}
        onCanReleaseInfoChange={onCanReleaseInfoChange}
      />
    )

  const select = value => wrapper => wrapper.props().onChange({ target: { value } })
  const selectYes = select('true')
  const selectNo = select('false')

  it('renders a legend', () => {
    expect(render().props().legend).toBe('Authorization for release of information on file? *')
  })

  it('passes a message through to the box', () => {
    const message = <div>Hello</div>
    expect(render({ message }).props().message).toBe(message)
  })

  describe('when can release confidential info', () => {
    it('sets the value to true', () => {
      const wrapper = render({ canReleaseConfidentialInfo: true })
      expect(wrapper.props().value).toBe(true)
    })

    it('calls back on NO change', () => {
      const onCanReleaseInfoChange = jest.fn()
      const wrapper = render({ onCanReleaseInfoChange })
      selectNo(wrapper)
      expect(onCanReleaseInfoChange).toHaveBeenCalledWith({ target: { value: 'false' } })
    })
  })

  describe('when cannot release confidential info', () => {
    it('sets the value to false', () => {
      const wrapper = render({ canReleaseConfidentialInfo: false })
      expect(wrapper.props().value).toBe(false)
    })

    it('calls back on YES change', () => {
      const onCanReleaseInfoChange = jest.fn()
      const wrapper = render({ onCanReleaseInfoChange })
      selectYes(wrapper)
      expect(onCanReleaseInfoChange).toHaveBeenCalledWith({ target: { value: 'true' } })
    })
  })

  describe('when disabled', () => {
    it('disabled the FormControl', () => {
      const wrapper = render({ isDisabled: true })
      expect(wrapper.props().isDisabled).toBe(true)
    })
  })
})
