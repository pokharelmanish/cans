import React from 'react'
import { shallow, mount } from 'enzyme'
import { Select, Modal, ModalBody, CardTitle, Button } from '@cwds/components'
import AssessmentDeleteModal from './AssessmentDeleteModal'
import AssessmentService from './Assessment.service'
import Comment from '../common/Comment'
import { blankPlaceHolder } from './AssessmentHelper'
import * as Analytics from '../../util/analytics'

jest.mock('../Assessment/Assessment.service')
jest.mock('../../util/analytics')

const deletedAssessment = { id: 1, status: 'DELETED' }
const toggleModalSpy = jest.fn()
const assessmentHistoryCallbackSpy = jest.fn()

const getWrapper = (isShown, toggleModal = () => {}, updateAssessmentHistoryCallback = () => {}) => {
  const props = {
    isShown,
    assessmentCounty: 'Yolo',
    assessmentId: 1,
    toggleModal,
    updateAssessmentHistoryCallback,
    date: '01/01/2019',
  }
  return shallow(<AssessmentDeleteModal {...props} />)
}

const mountWrapper = (isShown, toggleModal = () => {}, updateAssessmentHistoryCallback = () => {}) => {
  const props = {
    isShown,
    assessmentCounty: 'Yolo',
    assessmentId: 1,
    toggleModal,
    updateAssessmentHistoryCallback,
    date: '01/01/2019',
  }
  return mount(<AssessmentDeleteModal {...props} />)
}

const simulateSelect = (wrapper, optionNumber) => {
  const count = Array.from(Array(optionNumber))
  count.forEach(el => {
    wrapper
      .find('.list__control')
      .first()
      .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })
  })
  wrapper
    .find('.list__control')
    .first()
    .simulate('keyDown', { key: 'Enter', keyCode: 13 })
}

describe('AssessmentDeleteModal', () => {
  describe('layout', () => {
    describe('isShown prop is true', () => {
      it('renders a PageModal', () => {
        const wrapper = getWrapper(true)
        expect(wrapper.find(Modal).exists()).toBe(true)
      })

      it('renders a Select', () => {
        const wrapper = getWrapper(true)
        expect(wrapper.find(Select).exists()).toBe(true)
      })

      it('renders a comment when select Other option', () => {
        const wrapper = mountWrapper(true, toggleModalSpy, assessmentHistoryCallbackSpy)
        simulateSelect(wrapper, 4)
        expect(
          wrapper
            .find('.list__single-value')
            .last()
            .text()
        ).toEqual('Other')
        expect(wrapper.find(Comment).exists()).toBe(true)
      })

      it('still keep comment displayed after user inputted reason then select Other option again', () => {
        const wrapper = mountWrapper(true, toggleModalSpy, assessmentHistoryCallbackSpy)
        wrapper.setState({ otherReasonContent: 'some reasons' })
        simulateSelect(wrapper, 4)
        expect(
          wrapper
            .find('.list__single-value')
            .last()
            .text()
        ).toEqual('Other')
        expect(wrapper.find(Comment).exists()).toBe(true)
      })

      it('the second option of select should be #Referral / Case closed#', () => {
        const wrapper = mountWrapper(true, toggleModalSpy, assessmentHistoryCallbackSpy)
        simulateSelect(wrapper, 2)
        expect(
          wrapper
            .find('.list__single-value')
            .last()
            .text()
        ).toEqual('Referral / Case closed')
        expect(wrapper.state().selectedReason.value).toBe('Referral / Case closed')
        expect(wrapper.find(Comment).exists()).toBe(false)
      })
    })
  })

  describe('Delete Modal props', () => {
    let modal
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper(true)
      modal = wrapper.find(Modal)
    })

    it('sets the correct isOpen value', () => {
      const isOpen = modal.props().isOpen
      expect(isOpen).toBe(true)
    })

    it('sets the correct title', () => {
      const title = modal
        .find(CardTitle)
        .render()
        .text()
      expect(title).toBe('Delete CANS Assessment - 01/01/2019')
    })

    it('sets the correct warningDescription', () => {
      const warningDescription = modal
        .find(ModalBody)
        .find('div')
        .at(1)
        .render()
        .text()
      expect(warningDescription).toBe('Choose or enter the reason for deleting this CANS.')
    })

    it('sets the correct description', () => {
      const description = modal
        .find(ModalBody)
        .find('div')
        .at(2)
        .render()
        .text()
      expect(description).toBe('This cannot be undone.')
    })

    it('sets the correct cancel label', () => {
      const cancelLabel = modal
        .find(Button)
        .at(0)
        .render()
        .text()
      expect(cancelLabel).toBe('Cancel')
    })

    it('sets the correct remove button label', () => {
      const deleteLabel = modal
        .find(Button)
        .at(1)
        .render()
        .text()
      expect(deleteLabel).toBe('Delete CANS')
    })

    it('sets a function to onCancel', () => {
      const onClick = modal
        .find(Button)
        .at(0)
        .props().onClick
      expect(typeof onClick).toBe('function')
    })

    it('sets a function to onRemove', () => {
      const onClick = modal
        .find(Button)
        .at(1)
        .props().onClick
      expect(typeof onClick).toBe('function')
    })

    it('sets true to isDeleteButtonDisabled', () => {
      expect(wrapper.state().isDeleteButtonDisabled).toBe(true)
    })
  })

  describe('Modal Buttons', () => {
    describe('different delete button render mode', () => {
      let wrapper
      let deleteButton
      beforeEach(() => {
        wrapper = mountWrapper(true, toggleModalSpy, assessmentHistoryCallbackSpy)
        deleteButton = wrapper.find(Button).at(1)
      })

      it('renders disabled delete button at beginning', () => {
        expect(deleteButton.html()).toContain('disabled')
      })

      it('renders active delete button when select an option which is not #Other#', () => {
        simulateSelect(wrapper, 1)
        wrapper.update()
        expect(wrapper.state().selectedReason.value).toBe('Entered in error')
        expect(deleteButton.html()).not.toContain('disabled')
      })

      it('renders disabled delete button when select #Other#', () => {
        simulateSelect(wrapper, 4)
        wrapper.update()
        expect(wrapper.state().selectedReason.value).toBe('Other')
        expect(deleteButton.html()).toContain('disabled')
      })

      it('renders active delete button after input some reason', () => {
        wrapper.instance().handleOtherReasonContentChange('Hello')
        expect(deleteButton.html()).not.toContain('disabled')
      })

      it('renders disabled delete button after user delete all of the input', () => {
        wrapper.instance().handleOtherReasonContentChange('')
        expect(deleteButton.html()).toContain('disabled')
      })
    })

    describe('when the cancel button is clicked', () => {
      it('calls toggleModal', () => {
        const wrapper = getWrapper(true, toggleModalSpy)
        const cancelButton = wrapper.find(Button).at(1)
        cancelButton.simulate('click')
        expect(toggleModalSpy).toHaveBeenCalledTimes(1)
        jest.clearAllMocks()
      })

      it('sets state with initialState', () => {
        const initialState = {
          showOtherReasonInput: false,
          otherReasonContent: '',
          selectedReason: blankPlaceHolder,
          isDeleteButtonDisabled: true,
        }
        const wrapper = getWrapper(true, toggleModalSpy)
        const cancelButton = wrapper.find(Button).at(1)
        cancelButton.simulate('click')
        expect(wrapper.state()).toEqual(initialState)
      })
    })

    describe('when the delete cans button is clicked', () => {
      const analyticsSpy = jest.spyOn(Analytics, 'logPageAction')

      beforeEach(() => {
        analyticsSpy.mockReset()
        jest.clearAllMocks()
        const wrapper = mountWrapper(true, toggleModalSpy, assessmentHistoryCallbackSpy)
        simulateSelect(wrapper, 1)
        const deleteButton = wrapper.find(Button).at(1)
        deleteButton.simulate('click')
      })

      it('calls the assessment delete service', () => {
        const deleteServiceSpy = jest.spyOn(AssessmentService, 'delete')
        deleteServiceSpy.mockReturnValue(Promise.resolve(deletedAssessment))
        expect(deleteServiceSpy).toHaveBeenCalledTimes(1)
        expect(deleteServiceSpy).toBeCalledWith(deletedAssessment.id, 'Entered in error')
      })

      it('calls toggleModal', () => {
        expect(toggleModalSpy).toHaveBeenCalledTimes(1)
      })

      it('calls the updateAssessmentHistoryCallback', () => {
        expect(assessmentHistoryCallbackSpy).toHaveBeenCalledTimes(1)
      })

      it('logs a page action', () => {
        expect(analyticsSpy).toHaveBeenCalledWith('assessmentDelete', {
          assessment_id: 1,
          assessment_county: 'Yolo',
        })
      })
    })
  })
})
