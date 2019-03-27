import React from 'react'
import AssessmentFormFooter from './AssessmentFormFooter'
import FooterControls from './FooterControls'
import * as AssessmentHelper from '../AssessmentHelper'
import SecurityService from '../../common/Security.service'
import { shallow } from 'enzyme'

jest.mock('../../common/Security.service')
jest.spyOn(SecurityService, 'checkPermission').mockReturnValue(Promise.resolve(true))

jest.mock('../AssessmentHelper')
const spy = jest.spyOn(AssessmentHelper, 'containsNotReviewedDomains')
spy.mockReturnValue(false)

describe('AssessmentFormFooter', () => {
  afterAll(() => {
    spy.mockRestore()
  })

  const render = ({
    isEditable = true,
    isSubmissionEnabled = true,
    onCancelClick = jest.fn(),
    onSubmitAssessment = jest.fn(),
    assessmentId = 1234,
    precedingAssessmentId,
    status = 'IN_PROGRESS',
    isUnderSix = true,
  }) =>
    shallow(
      <AssessmentFormFooter
        assessment={{
          id: assessmentId,
          preceding_assessment_id: precedingAssessmentId,
          person: { identifier: 'aaa' },
          state: { under_six: isUnderSix, domains: [] },
          status,
        }}
        isEditable={isEditable}
        isSubmissionEnabled={isSubmissionEnabled}
        onCancelClick={onCancelClick}
        onSubmitAssessment={onSubmitAssessment}
      />
    )

  it('renders', () => {
    expect(render({}).exists()).toBeTruthy()
  })

  it('renders nothing when underSix flag is not set', () => {
    const wrapper = render({ isUnderSix: null })
    expect(wrapper.html()).toBeNull()
  })

  describe('messages and controls block', () => {
    it('renders messages and controls block when assessment is editable', () => {
      const wrapper = render({ isEditable: true })
      expect(wrapper.find('div.form-footer').exists()).toBeTruthy()
    })

    it('hides messages and controls block when assessment is not editable', () => {
      const wrapper = render({ isEditable: false })
      expect(wrapper.find('div.form-footer').exists()).toBeFalsy()
    })

    describe('domains review message', () => {
      beforeEach(() => {
        spy.mockReset()
      })

      describe('when domains review is needed', () => {
        it('renders domains review message when at least one domain still needs review', () => {
          spy.mockReturnValue(true)
          const wrapper = render({ isEditable: true, precedingAssessmentId: 321 })
          expect(wrapper.find('#domains-review-needed-msg').exists()).toBeTruthy()
        })

        it('hides domains review message when all domains in this age group are reviewed', () => {
          spy.mockReturnValue(false)
          const wrapper = render({ isEditable: true, precedingAssessmentId: 321 })
          expect(wrapper.find('#domains-review-needed-msg').exists()).toBeFalsy()
        })
      })

      describe('when no domains review is needed', () => {
        it('does not render the domains review message', () => {
          const wrapper = render({ isEditable: true, precedingAssessmentId: null })
          expect(wrapper.find('#domains-review-needed-msg').exists()).toBeFalsy()
        })
      })
    })

    describe('FooterControls', () => {
      beforeEach(() => {
        spy.mockReset()
      })

      describe('when domains review is needed', () => {
        it('hides FooterControls when at least one domain still needs review', () => {
          spy.mockReturnValue(true)
          const wrapper = render({ isEditable: true, precedingAssessmentId: 321 })
          expect(wrapper.find(FooterControls).exists()).toBeFalsy()
        })

        it('renders FooterControls when all domains in this age group are reviewed', () => {
          spy.mockReturnValue(false)
          const wrapper = render({ isEditable: true, precedingAssessmentId: 321 })
          expect(wrapper.find(FooterControls).exists()).toBeTruthy()
        })
      })

      describe('when no domains review is needed', () => {
        it('renders FooterControls', () => {
          const wrapper = render({ isEditable: true, precedingAssessmentId: null })
          expect(wrapper.find(FooterControls).exists()).toBeTruthy()
        })
      })
    })
  })
})
