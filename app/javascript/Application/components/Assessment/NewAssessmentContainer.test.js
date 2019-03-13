import React from 'react'
import { shallow } from 'enzyme'
import { LoadingState } from '../../util/loadingHelper'
import NewAssessmentContainer from './NewAssessmentContainer'
import AssessmentContainerInner from './AssessmentContainerInner'
import AssessmentPageHeader from './AssessmentPageHeader'
import AssessmentStatusMessages from './AssessmentStatusMessages'
import AssessmentSummaryScroller from './AssessmentSummaryScroller'
import * as AssessmentHelper from './AssessmentHelper'
import { initialAssessment, assessment as mockAssessment, domainWithTwoCaregiver } from './assessment.mocks.test'

const AssessmentStatus = AssessmentHelper.AssessmentStatus

describe('NewAssessmentContainer', () => {
  const fakeController = {
    updateHeaderButtons: () => {},
    updateHeaderButtonsToDefault: () => {},
  }

  const render = ({
    assessment = mockAssessment,
    client = { dob: '2018-01-01' },
    onSaveAssessment = () => {},
    onSetAssessment = () => {},
  } = {}) =>
    shallow(
      <NewAssessmentContainer
        assessment={assessment}
        client={client}
        i18n={{}}
        onSaveAssessment={onSaveAssessment}
        onSetAssessment={onSetAssessment}
        pageHeaderButtonsController={fakeController}
        url="/path"
      />
    )

  it('renders AssessmentStatusMessages', () => {
    const messages = render().find(AssessmentStatusMessages)
    expect(messages.props().loadingState).toBe(LoadingState.waiting)
    expect(messages.props().url).toBe('/path')
    expect(messages.props().isEditable).toBe(true)
    expect(messages.props().isCompleted).toBe(false)
  })

  it('renders an AssessmentSummaryScroller', () => {
    const scroller = render().find(AssessmentSummaryScroller)
    expect(scroller.props().loadingState).toBe(LoadingState.waiting)
    expect(scroller.props().canDisplaySummaryOnSave).toBe(true)
    expect(scroller.props().scrollTarget).toBe(0)
    expect(scroller.props().targetAdjustment).toBe(15)
  })

  it('uses the header ref as a scrollTarget for the AssessmentSummaryScroller', () => {
    const wrapper = render()
    wrapper.setState({ completeScrollTarget: 1234 })
    const scroller = wrapper.find(AssessmentSummaryScroller)
    expect(scroller.props().scrollTarget).toBe(1234)
  })

  it('renders an AssessmentPageHeader', () => {
    const header = render().find(AssessmentPageHeader)
    expect(header.exists()).toBe(true)
    expect(header.props().pageHeaderButtonsController).toBe(fakeController)
  })

  it('renders an AssessmentContainerInner', () => {
    expect(
      render()
        .find(AssessmentContainerInner)
        .exists()
    ).toBe(true)
  })

  it('calls onSaveAssessment with completed assessment when submitted', () => {
    const client = { identifier: '123', dob: '2018-01-01' }
    const onSaveAssessment = jest.fn()
    const wrapper = render({ client, onSaveAssessment })

    wrapper
      .find(AssessmentContainerInner)
      .props()
      .handleSubmitAssessment()

    expect(onSaveAssessment).toHaveBeenCalledTimes(1)
    expect(onSaveAssessment).toHaveBeenCalledWith({
      ...mockAssessment,
      status: AssessmentStatus.completed,
      person: client,
    })
  })

  it('calls onSaveAssessment with the current assessment when saved', () => {
    const client = { identifier: '123', dob: '2018-01-01' }
    const onSaveAssessment = jest.fn()
    const wrapper = render({ client, onSaveAssessment })

    wrapper
      .find(AssessmentPageHeader)
      .props()
      .onSaveAssessment()

    expect(onSaveAssessment).toHaveBeenCalledTimes(1)
    expect(onSaveAssessment).toHaveBeenCalledWith({
      ...mockAssessment,
      person: client,
    })
  })

  it('removes a single caregiver onCaregiverRemove', () => {
    const client = { identifier: '123', dob: '2018-01-01' }
    const assessment = {
      ...mockAssessment,
      person: client,
      has_caregiver: true,
      state: {
        ...mockAssessment.state,
        domains: [...domainWithTwoCaregiver],
      },
    }
    const onSetAssessment = jest.fn()
    const wrapper = render({ client, onSetAssessment, assessment })

    wrapper
      .find(AssessmentContainerInner)
      .props()
      .handleCaregiverRemove('a')
    expect(onSetAssessment).toHaveBeenCalledTimes(1)
    const setAssessment = onSetAssessment.mock.calls[0][0]
    expect(setAssessment.state.domains.length).toBe(1)
    expect(setAssessment.state.domains[0].caregiver_index).toBe('b')
  })

  it('removes all caregivers onCaregiverRemove with no index', () => {
    const client = { identifier: '123', dob: '2018-01-01' }
    const assessment = {
      ...mockAssessment,
      person: client,
      has_caregiver: true,
      state: {
        ...mockAssessment.state,
        domains: [...domainWithTwoCaregiver],
      },
    }
    const onSetAssessment = jest.fn()
    const wrapper = render({ client, onSetAssessment, assessment })

    wrapper
      .find(AssessmentContainerInner)
      .props()
      .handleCaregiverRemove()
    expect(onSetAssessment).toHaveBeenCalledTimes(1)
    const setAssessment = onSetAssessment.mock.calls[0][0]
    expect(setAssessment.has_caregiver).toBe(false)
    expect(setAssessment.state.domains.length).toBe(0)
  })

  it('updates has_caregiver when the last caregiver domain is removed', () => {
    const client = { identifier: '123', dob: '2018-01-01' }
    const assessment = {
      ...mockAssessment,
      person: client,
      has_caregiver: true,
      state: {
        ...mockAssessment.state,
        domains: [domainWithTwoCaregiver[0]],
      },
    }
    const onSetAssessment = jest.fn()
    const wrapper = render({ client, onSetAssessment, assessment })

    wrapper
      .find(AssessmentContainerInner)
      .props()
      .handleCaregiverRemove('a')
    expect(onSetAssessment).toHaveBeenCalledTimes(1)
    const setAssessment = onSetAssessment.mock.calls[0][0]
    expect(setAssessment.has_caregiver).toBe(false)
    expect(setAssessment.state.domains.length).toBe(0)
  })

  it('renders nothing when there is no assessment', () => {
    const wrapper = render({ assessment: null })

    expect(wrapper.type()).toBe(null)
  })

  it('is editable when a new assessment has not yet been saved', () => {
    const assessment = initialAssessment
    expect(assessment.id).toBeUndefined()
    const wrapper = render({ assessment })

    expect(wrapper.find(AssessmentContainerInner).props().isEditable).toBe(true)
  })

  it('is editable when allowed to update the assessment', () => {
    const assessment = {
      ...mockAssessment,
      metadata: {
        allowed_operations: ['update'],
      },
    }

    const wrapper = render({ assessment })
    expect(wrapper.find(AssessmentContainerInner).props().isEditable).toBe(true)
  })

  it('is not editable when not allowed to update the assessment', () => {
    const assessment = {
      ...mockAssessment,
      metadata: {
        allowed_operations: ['read', 'create', 'complete', 'write', 'delete'],
      },
    }

    const wrapper = render({ assessment })
    expect(wrapper.find(AssessmentContainerInner).props().isEditable).toBe(false)
  })

  it('updates the draft assessment upon request', () => {
    const client = { identifier: 'hello', dob: '2018-01-01' }
    const onSetAssessment = jest.fn()
    const wrapper = render({ client, onSetAssessment })

    wrapper
      .find(AssessmentContainerInner)
      .props()
      .onAssessmentUpdate(mockAssessment)

    expect(onSetAssessment).toHaveBeenCalledTimes(1)
    expect(onSetAssessment).toHaveBeenCalledWith({
      ...mockAssessment,
      person: client,
    })
  })

  it('tracks draft event_date as the user types', () => {
    const assessment = { ...mockAssessment, event_date: '2018-01-01' }
    const wrapper = render({ assessment })

    expect(wrapper.state().isValidDate).toBe(true)

    wrapper
      .find(AssessmentContainerInner)
      .props()
      .onEventDateFieldKeyUp({ target: { value: 'invalid' } })
    wrapper.update()
    expect(wrapper.state().isValidDate).toBe(false)

    wrapper
      .find(AssessmentContainerInner)
      .props()
      .onEventDateFieldKeyUp({ target: { value: '10/09/2018' } })
    wrapper.update()
    expect(wrapper.state().isValidDate).toBe(true)
  })

  it('validates event date against dob as the user types', () => {
    const assessment = { ...mockAssessment, event_date: '2018-01-01' }
    const client = { identifier: 'foo', dob: '2017-02-02' }
    const wrapper = render({ assessment, client })

    expect(wrapper.state().isEventDateBeforeDob).toBe(false)

    wrapper
      .find(AssessmentContainerInner)
      .props()
      .onEventDateFieldKeyUp({ target: { value: '01/01/2017' } })
    wrapper.update()
    expect(wrapper.state().isEventDateBeforeDob).toBe(true)

    wrapper
      .find(AssessmentContainerInner)
      .props()
      .onEventDateFieldKeyUp({ target: { value: '10/09/2018' } })
    wrapper.update()
    expect(wrapper.state().isEventDateBeforeDob).toBe(false)
  })

  it('passes isValidDate and isEventDateBeforeDob to the page header for validation', () => {
    const wrapper = render()
    wrapper.setState({ isValidDate: false, isEventDateBeforeDob: true })
    wrapper.update()
    expect(wrapper.find(AssessmentPageHeader).props().isValidDate).toBe(false)
    expect(wrapper.find(AssessmentPageHeader).props().isEventDateBeforeDob).toBe(true)

    wrapper.setState({ isValidDate: true, isEventDateBeforeDob: false })
    wrapper.update()
    expect(wrapper.find(AssessmentPageHeader).props().isValidDate).toBe(true)
    expect(wrapper.find(AssessmentPageHeader).props().isEventDateBeforeDob).toBe(false)
  })

  it('passes isEventDateBeforeDob to the page header for validation, if event date is valid', () => {
    const wrapper = render()
    wrapper.setState({ isValidDate: true, isEventDateBeforeDob: true })
    wrapper.update()
    expect(wrapper.find(AssessmentContainerInner).props().isEventDateBeforeDob).toBe(true)

    wrapper.setState({ isValidDate: true, isEventDateBeforeDob: false })
    wrapper.update()
    expect(wrapper.find(AssessmentContainerInner).props().isEventDateBeforeDob).toBe(false)
  })

  it('passes isEventDateBeforeDob to the page header as false, if event date is not valid', () => {
    const wrapper = render()
    wrapper.setState({ isValidDate: false, isEventDateBeforeDob: true })
    wrapper.update()
    expect(wrapper.find(AssessmentContainerInner).props().isEventDateBeforeDob).toBe(false)

    wrapper.setState({ isValidDate: false, isEventDateBeforeDob: false })
    wrapper.update()
    expect(wrapper.find(AssessmentContainerInner).props().isEventDateBeforeDob).toBe(false)
  })

  it('uses the AssessmentHelper to validate the assessment for submit when valid', () => {
    jest.spyOn(AssessmentHelper, 'validateAssessmentForSubmit').mockReturnValue(true)

    const wrapper = render()
    expect(wrapper.find(AssessmentContainerInner).props().isValidForSubmit).toBe(true)
  })

  it('uses the AssessmentHelper to validate the assessment for submit when invalid', () => {
    jest.spyOn(AssessmentHelper, 'validateAssessmentForSubmit').mockReturnValue(false)

    const wrapper = render()
    expect(wrapper.find(AssessmentContainerInner).props().isValidForSubmit).toBe(false)
  })

  describe('when not canDisplaySummaryOnSave', () => {
    let wrapper

    beforeEach(() => {
      wrapper = render({ assessment: initialAssessment })
    })

    it('passes false to AssessmentSummaryScroller', () => {
      expect(wrapper.find(AssessmentSummaryScroller).props().canDisplaySummaryOnSave).toBe(false)
    })

    it('passes false to AssessmentContainerInner', () => {
      expect(wrapper.find(AssessmentContainerInner).props().canDisplaySummaryOnSave).toBe(false)
    })
  })
})
// TODO
// Unsaved changes
// NewRelic
// Cancel button
