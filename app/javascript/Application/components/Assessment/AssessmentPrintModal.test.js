import React from 'react'
import { shallow } from 'enzyme'
import AssessmentPrintModal from './AssessmentPrintModal'
import { redactLevels } from '../Print/printAssessment/PrintAssessmentHelper'
import { assessmentWithConfidentialItem, assessmentWithNoConfidentialItem } from './assessment.mocks.test'

describe('<AssessmentPrintModal/>', () => {
  const defaultProps = {
    onConfirm: () => {},
    isOpen: true,
    onClose: () => {},
    assessment: assessmentWithNoConfidentialItem,
    i18n: {},
    substanceUseItemsIds: { underSix: [], aboveSix: [] },
  }
  const render = (props = defaultProps) => shallow(<AssessmentPrintModal {...props} />)
  describe('render', () => {
    it('should show modal when isOpen = true and assessment has confidential items', () => {
      const props = { ...defaultProps, assessment: assessmentWithConfidentialItem }
      const modal = render(props).find('Modal')
      expect(modal.exists()).toBeTruthy()
      expect(modal.props().isOpen).toBeTruthy()
    })

    it('should not to show modal when isOpen = true and assessment does not have confidential items', () => {
      const modal = render().find('Modal')
      expect(modal.props().isOpen).toBeFalsy()
    })

    describe('redactLevel radios', () => {
      it('should render redactLevel radios', () => {
        const props = { ...defaultProps, assessment: assessmentWithConfidentialItem }
        const wrapper = render(props)
        expect(wrapper.find(`#redact-level-radio-${redactLevels.all}`).exists()).toBeTruthy()
        expect(wrapper.find(`#redact-level-radio-${redactLevels.confidential}`).exists()).toBeTruthy()
        expect(wrapper.find(`#redact-level-radio-${redactLevels.discrationNeeded}`).exists()).toBeTruthy()
        expect(wrapper.find(`#redact-level-radio-${redactLevels.doNotRedact}`).exists()).toBeTruthy()
      })
    })

    describe('#close', () => {
      it('should call assigned onClose function and reset state', () => {
        const onClose = jest.fn()
        const props = { ...defaultProps, onClose }
        const wrapper = render(props)
        wrapper.instance().close()
        expect(onClose).toHaveBeenCalledTimes(1)
        expect(wrapper.state()).toEqual(AssessmentPrintModal.defaultSate)
      })
    })

    describe('handleRedactLevelChange', () => {
      const wrapper = render()
      it('should set redactLevel', () => {
        const redactLevel = 'ALL'
        wrapper.instance().setState({ confirmChecked: true })
        wrapper.instance().handleRedactLevelChange({ target: { value: redactLevel } })
        expect(wrapper.state().redactLevel).toEqual(redactLevel)
      })

      it('should uncheck confirmCheckbox', () => {
        wrapper.instance().setState({ confirmChecked: true })
        wrapper.instance().handleRedactLevelChange({ target: { value: redactLevels.all } })
        expect(wrapper.state().confirmChecked).toBeFalsy()
      })
    })

    describe('confirmation Checkbox', () => {
      it('should render disabled confirmation checkbox', () => {
        expect(
          render()
            .find('#redact-level-confirm-checkbox')
            .props().disabled
        ).toBeTruthy()
      })

      it('should be enabled when redact level is not ALL', () => {
        const wrapper = render()
        wrapper.setState({ redactLevel: redactLevels.all })
        expect(wrapper.find('#redact-level-confirm-checkbox').props().disabled).toBeTruthy()
        wrapper.instance().setState({ redactLevel: redactLevels.doNotRedact })
        expect(wrapper.find('#redact-level-confirm-checkbox').props().disabled).toBeFalsy()
      })

      it('should set confirmChecked to true when checked', () => {
        const wrapper = render()
        wrapper.instance().setState({ redactLevel: redactLevels.doNotRedact })
        expect(wrapper.state().confirmChecked).toBeFalsy()
        wrapper.instance().handleCheckboxChange({ target: { checked: true } })
        expect(wrapper.state().confirmChecked).toBeTruthy()
      })
    })

    describe('confirm button', () => {
      it('should render disabled confirm button', () => {
        expect(
          render()
            .find('#redact-level-confirm-button')
            .props().disabled
        ).toBeTruthy()
      })

      it('should render enabled confirm button when checkBox is checked', () => {
        const wrapper = render()
        wrapper.setState({ redactLevel: redactLevels.doNotRedact, confirmChecked: true })
        expect(wrapper.find('#redact-level-confirm-button').props().disabled).toBeFalsy()
      })

      it('should render enabled confirm button when redactLevel is "ALL"', () => {
        const wrapper = render()
        wrapper.setState({ redactLevel: redactLevels.all })
        expect(wrapper.find('#redact-level-confirm-button').props().disabled).toBeFalsy()
      })

      it('should set printNow to true on click', () => {
        const props = { ...defaultProps, assessment: assessmentWithConfidentialItem }
        const wrapper = render(props)
        wrapper.find('#redact-level-confirm-button').simulate('click')
        expect(wrapper.state().printNow).toBeTruthy()
      })
    })
  })
})
