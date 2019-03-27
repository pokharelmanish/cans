import React from 'react'
import { shallow } from 'enzyme'
import FooterControls from './FooterControls'
import ReviewConfirmation from './ReviewConfirmation'
import CancelAssessmentButton from './CancelAssessmentButton'
import CompleteAssessmentButton from './CompleteAssessmentButton'

describe('<FooterControls />', () => {
  const render = ({
    isEditable = true,
    isReviewNeeded = true,
    isSubmissionEnabled = true,
    onCancelClick = jest.fn(),
    onSubmitAssessment = jest.fn(),
  }) =>
    shallow(
      <FooterControls
        isEditable={isEditable}
        isReviewNeeded={isReviewNeeded}
        isSubmissionEnabled={isSubmissionEnabled}
        onCancelClick={onCancelClick}
        onSubmitAssessment={onSubmitAssessment}
      />
    )

  it('renders', () => {
    const wrapper = render({})
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('ReviewConfirmation', () => {
    describe('rendering', () => {
      it('renders ReviewConfirmation when review is needed and assessment can be completed', () => {
        const wrapper = render({ isReviewNeeded: true, isSubmissionEnabled: true })
        const reviewConfirmation = wrapper.find(ReviewConfirmation)
        expect(reviewConfirmation.exists()).toBeTruthy()
        expect(reviewConfirmation.exists()).toBeTruthy()
      })

      it('does not render ReviewConfirmation when review is not needed', () => {
        const wrapper = render({ isReviewNeeded: false })
        const reviewConfirmation = wrapper.find(ReviewConfirmation)
        expect(reviewConfirmation.exists()).toBeFalsy()
      })

      it('does not render ReviewConfirmation when assessment is not ready to be completed', () => {
        const wrapper = render({ isSubmissionEnabled: false })
        const reviewConfirmation = wrapper.find(ReviewConfirmation)
        expect(reviewConfirmation.exists()).toBeFalsy()
      })
    })

    it('propagates isReviewConfirmed and onReviewConfirmedChange props to ReviewConfirmation', () => {
      const wrapper = render({ isReviewNeeded: true, isSubmissionEnabled: true })
      wrapper.setState({ isReviewConfirmed: true })
      const reviewConfirmation = wrapper.find(ReviewConfirmation)
      expect(reviewConfirmation.props().isReviewConfirmed).toBe(true)
      expect(reviewConfirmation.props().onReviewConfirmedChange).toBe(wrapper.instance().handleReviewConfirmedChange)
    })
  })

  describe('complete button info message', () => {
    it('renders the message when assessment is editable but not ready to be completed', () => {
      const wrapper = render({ isEditable: true, isSubmissionEnabled: false })
      const infoMessage = wrapper.find('span')
      expect(infoMessage.exists()).toBeTruthy()
      expect(infoMessage.text()).toBe(
        'The Assessment Date and all assessment ratings must be completed before the Complete button becomes active.'
      )
    })

    it('does not render the message when assessment is not editable', () => {
      const wrapper = render({ isEditable: false, isSubmissionEnabled: false })
      const infoMessage = wrapper.find('span')
      expect(infoMessage.exists()).toBeFalsy()
    })

    it('does not render the message when assessment is ready to be completed', () => {
      const wrapper = render({ isEditable: true, isSubmissionEnabled: true })
      const infoMessage = wrapper.find('span')
      expect(infoMessage.exists()).toBeFalsy()
    })
  })

  describe('CancelAssessmentButton', () => {
    it('renders CancelAssessmentButton', () => {
      const cancelButton = render({}).find(CancelAssessmentButton)
      expect(cancelButton.exists()).toBeTruthy()
    })

    it('propagates onCancelClick callback to CancelAssessmentButton', () => {
      const onCancelClickMock = jest.fn()
      const wrapper = render({ onCancelClick: onCancelClickMock })
      const cancelButton = wrapper.find(CancelAssessmentButton)
      expect(cancelButton.props().onCancelClick).toBe(onCancelClickMock)
    })
  })

  describe('CompleteAssessmentButton', () => {
    it('renders CompleteAssessmentButton', () => {
      const completeButton = render({}).find(CompleteAssessmentButton)
      expect(completeButton.exists()).toBeTruthy()
    })

    it('propagates onSubmitAssessment callback to CompleteAssessmentButton', () => {
      const onSubmitAssessmentMock = jest.fn()
      const wrapper = render({ onSubmitAssessment: onSubmitAssessmentMock })
      const completeButton = wrapper.find(CompleteAssessmentButton)
      expect(completeButton.props().onSubmitAssessment).toBe(onSubmitAssessmentMock)
    })

    const assertCompleteButtonDisabledState = ({
      isSubmissionEnabled,
      isReviewNeeded,
      isReviewConfirmed,
      expectedResult,
    }) => {
      const wrapper = render({ isSubmissionEnabled, isReviewNeeded })
      wrapper.setState({ isReviewConfirmed })
      const completeButton = wrapper.find(CompleteAssessmentButton)
      expect(completeButton.props().disabled).toBe(expectedResult)
    }

    describe('when domains review is needed', () => {
      describe('and assessment is ready to be completed', () => {
        it('disables CompleteAssessmentButton when review is not confirmed', () => {
          assertCompleteButtonDisabledState({
            isSubmissionEnabled: true,
            isReviewNeeded: true,
            isReviewConfirmed: false,
            expectedResult: true,
          })
        })

        it('enables CompleteAssessmentButton when review is confirmed', () => {
          assertCompleteButtonDisabledState({
            isSubmissionEnabled: true,
            isReviewNeeded: true,
            isReviewConfirmed: true,
            expectedResult: false,
          })
        })
      })

      describe('and assessment is not ready to be completed', () => {
        it('always disables CompleteAssessmentButton no matter if review is confirmed or not', () => {
          assertCompleteButtonDisabledState({
            isSubmissionEnabled: false,
            isReviewNeeded: true,
            isReviewConfirmed: true,
            expectedResult: true,
          })
          assertCompleteButtonDisabledState({
            isSubmissionEnabled: false,
            isReviewNeeded: true,
            isReviewConfirmed: false,
            expectedResult: true,
          })
        })
      })
    })

    describe('when domains review is not needed', () => {
      it('enables CompleteAssessmentButton when assessment is ready to be completed', () => {
        assertCompleteButtonDisabledState({
          isSubmissionEnabled: true,
          isReviewNeeded: false,
          isReviewConfirmed: false,
          expectedResult: false,
        })
      })

      it('disables CompleteAssessmentButton when assessment is not ready to be completed', () => {
        assertCompleteButtonDisabledState({
          isSubmissionEnabled: false,
          isReviewNeeded: false,
          isReviewConfirmed: false,
          expectedResult: true,
        })
      })
    })
  })

  it('updates state.isReviewConfirmed when handleReviewConfirmedChange() invoked', () => {
    const wrapper = render({})
    expect(wrapper.state().isReviewConfirmed).toBeFalsy()
    wrapper.instance().handleReviewConfirmedChange({ target: { value: 'false' } })
    expect(wrapper.state().isReviewConfirmed).toBeTruthy()
  })
})
