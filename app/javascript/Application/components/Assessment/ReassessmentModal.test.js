import React from 'react'
import { shallow } from 'enzyme'
import { Button, ModalBody, CardTitle } from '@cwds/components'
import ReassessmentModal from './ReassessmentModal'

describe('ReassessmentModal', () => {
  const render = ({ fillPrecedingData = () => {}, isOpen = true, startEmpty = () => {} }) =>
    shallow(<ReassessmentModal fillPrecedingData={fillPrecedingData} isOpen={isOpen} startEmpty={startEmpty} />)

  it('renders Modal', () => {
    const modal = render({}).find('Modal')
    expect(modal.exists()).toBeTruthy()
    expect(modal.props().isOpen).toBeTruthy()
  })

  it('hides Modal', () => {
    const modal = render({ isOpen: false }).find('Modal')
    expect(modal.exists()).toBeTruthy()
    expect(modal.props().isOpen).toBeFalsy()
  })

  it('renders a modal title', () => {
    const modalTitle = render({}).find(CardTitle)
    expect(modalTitle.props().children).toBe('How would you like to begin this CANS Reassessment?')
  })

  it('renders a modal body', () => {
    const modalBody = render({}).find(ModalBody)
    expect(modalBody.props().children).toBe(
      'Would you prefer to start with or without the most recently completed CANS ratings?'
    )
  })

  describe('buttons', () => {
    const leftButtonIndex = 0
    const rightButtonIndex = 1
    const assertButtonDisablesComponent = buttonIndex => {
      const wrapper = render({})
      expect(wrapper.state().isDisabled).toBeFalsy()
      const button = wrapper.find('Button').at(buttonIndex)
      button.simulate('click')
      expect(wrapper.state().isDisabled).toBeTruthy()
    }

    it('it disables buttons when isDisabled', () => {
      const wrapper = render({})
      wrapper.setState({ isDisabled: true })
      wrapper.find('Button').forEach(button => {
        expect(button.props().disabled).toBeTruthy()
      })
    })

    it('renders 2 buttons in the footer', () => {
      const buttons = render({}).find(Button)
      expect(buttons.length).toBe(2)
      expect(buttons.at(leftButtonIndex).props().children).toBe('Start new')
      expect(buttons.at(rightButtonIndex).props().children).toBe('Use previous ratings')
    })

    describe('left button', () => {
      it('invokes props.startEmpty() on click', () => {
        const startEmptyMock = jest.fn()
        const wrapper = render({ startEmpty: startEmptyMock })
        const button = wrapper.find('Button').at(leftButtonIndex)
        button.simulate('click')
        expect(startEmptyMock).toHaveBeenCalledWith()
      })

      it('disables modal on left button click', () => {
        assertButtonDisablesComponent(leftButtonIndex)
      })
    })

    describe('right button', () => {
      it('invokes props.startEmpty() on click', () => {
        const fillPrecedingDataMock = jest.fn()
        const wrapper = render({ fillPrecedingData: fillPrecedingDataMock })
        const button = wrapper.find('Button').at(rightButtonIndex)
        button.simulate('click')
        expect(fillPrecedingDataMock).toHaveBeenCalledWith()
      })

      it('disables modal on right button click', () => {
        assertButtonDisablesComponent(rightButtonIndex)
      })
    })
  })
})
