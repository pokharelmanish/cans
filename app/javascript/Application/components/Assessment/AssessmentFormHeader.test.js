import React from 'react'
import { shallow } from 'enzyme'
import { AssessmentFormHeader } from './index'
import { assessment, client, clientWithEstimatedDob } from './assessment.mocks.test'
import { clone } from '../../util/common'
import ConductedByField from './AssessmentFormHeader/ConductedByField'
import AgeRangeSwitch from '../common/AgeRangeSwitch'
import { Card, CardBody, CardHeader, CardTitle } from '@cwds/components'
import moment from 'moment'

describe('<AssessmentFormHeader />', () => {
  const defaultProps = {
    assessment,
    client,
    onAssessmentUpdate: jest.fn(),
    substanceUseItemsIds: { underSix: ['41'], aboveSix: ['8', '48'] },
  }
  const propsWithEstimatedDob = {
    assessment,
    client: clientWithEstimatedDob,
    onAssessmentUpdate: jest.fn(),
    substanceUseItemsIds: { underSix: ['41'], aboveSix: ['8', '48'] },
  }

  it('renders with 1 <ConductedByField> component', () => {
    const wrapper = shallow(<AssessmentFormHeader {...defaultProps} />)
    expect(wrapper.find(ConductedByField).exists()).toBe(true)
  })

  it('renders the under_six question when under_six is unknown', () => {
    const agelessAssessment = {
      ...assessment,
      state: { ...assessment.state, under_six: undefined },
    }
    const wrapper = shallow(
      <AssessmentFormHeader
        assessment={agelessAssessment}
        client={client}
        onAssessmentUpdate={jest.fn()}
        substanceUseItemsIds={defaultProps.substanceUseItemsIds}
      />
    )
    expect(wrapper.find(AgeRangeSwitch).props().isUnderSix).toBe(null)
  })

  it('renders the under_six question when under_six is set', () => {
    const underSixAssessment = {
      ...assessment,
      state: { ...assessment.state, under_six: true },
    }
    const wrapper = shallow(
      <AssessmentFormHeader
        assessment={underSixAssessment}
        client={client}
        onAssessmentUpdate={jest.fn()}
        substanceUseItemsIds={defaultProps.substanceUseItemsIds}
      />
    )
    expect(wrapper.find(AgeRangeSwitch).props().isUnderSix).toBe(true)
  })

  describe('case number', () => {
    it('renders with case number and Case Number label', () => {
      const assessmentWithCaseNumber = {
        ...assessment,
        service_source_ui_id: '0687-9473-7673-8000672',
        service_source: 'CASE',
      }
      const props = {
        assessment: assessmentWithCaseNumber,
        client,
        onAssessmentUpdate: jest.fn(),
        onEventDateFieldKeyUp: jest.fn(),
        substanceUseItemsIds: defaultProps.substanceUseItemsIds,
      }
      const caseWrapper = shallow(<AssessmentFormHeader {...props} />)
      const caseNumber = caseWrapper.find('#case-or-referral-number')
      const caseNumberLabel = caseWrapper.find('#case-or-referral-number-label')
      expect(caseNumber.text()).toBe('0687-9473-7673-8000672')
      expect(caseNumberLabel.children().text()).toBe('Case Number')
    })

    it('renders with referral number and Referral Number label', () => {
      const assessmentWithReferralNumber = {
        ...assessment,
        service_source_ui_id: '4704-9166-3831-2001287',
        service_source: 'REFERRAL',
      }
      const props = {
        assessment: assessmentWithReferralNumber,
        client,
        onAssessmentUpdate: jest.fn(),
        onEventDateFieldKeyUp: jest.fn(),
        substanceUseItemsIds: defaultProps.substanceUseItemsIds,
      }
      const referralWrapper = shallow(<AssessmentFormHeader {...props} />)
      const referralNumber = referralWrapper.find('#case-or-referral-number')
      const referralNumberLabel = referralWrapper.find('#case-or-referral-number-label')
      expect(referralNumber.text()).toBe('4704-9166-3831-2001287')
      expect(referralNumberLabel.children().text()).toBe('Referral Number')
    })

    it('renders without case/referral number when not exists and Case/Referral Number label', () => {
      const props = {
        assessment,
        client,
        onAssessmentUpdate: jest.fn(),
        onEventDateFieldKeyUp: jest.fn(),
        substanceUseItemsIds: defaultProps.substanceUseItemsIds,
      }
      const caseReferralWrapper = shallow(<AssessmentFormHeader {...props} />)
      const caseNumber = caseReferralWrapper.find('#case-or-referral-number')
      const referralNumberLabel = caseReferralWrapper.find('#case-or-referral-number-label')
      expect(caseNumber.text()).toBe('')
      expect(referralNumberLabel.children().text()).toBe('Case/Referral Number')
    })
  })

  describe('date field', () => {
    it('should be invalid when the event date is before person.dob', () => {
      const props = { ...defaultProps, isEventDateBeforeDob: true }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      expect(wrapper.find('DateField').prop('isValid')).toEqual(false)
    })
  })

  describe('labels', () => {
    let wrapped
    beforeEach(() => {
      wrapped = shallow(<AssessmentFormHeader {...defaultProps} />)
    })

    it('renders top 4 labels', () => {
      const labels = wrapped.find('.assessment-form-header-label').map(label => label.children().text())
      expect(labels).toEqual([
        'Assessment Date *',
        'Select CANS Template *',
        'Assessment Conducted by',
        'Case/Referral Number',
      ])
    })
  })

  describe('#handleValueChange()', () => {
    it('will update event_date in assessment', () => {
      // given
      const mockFn = jest.fn()
      const props = {
        assessment,
        client,
        onAssessmentUpdate: mockFn,
        substanceUseItemsIds: defaultProps.substanceUseItemsIds,
      }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      expect(assessment.event_date).toBe('2018-06-11')
      // when
      const event = { target: { name: 'event_date', value: '2000-01-11' } }
      wrapper.instance().handleValueChange(event)
      // then
      const updatedAssessment = clone(assessment)
      updatedAssessment.event_date = '2000-01-11'
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
    })
  })

  describe('AssessmentOptions onHasCaregiverChange', () => {
    it('will update has_caregiver in assessment', () => {
      // given
      const mockFn = jest.fn()
      const sentAssessment = clone(assessment)
      sentAssessment.has_caregiver = false
      const props = {
        assessment: sentAssessment,
        client,
        onAssessmentUpdate: mockFn,
        substanceUseItemsIds: defaultProps.substanceUseItemsIds,
      }
      const options = shallow(<AssessmentFormHeader {...props} />).find('AssessmentOptions')

      // when
      const event = { target: { name: 'has_caregiver', value: 'true' } }
      options.props().onHasCaregiverChange(event)

      // then
      const updatedAssessment = clone(assessment)
      updatedAssessment.has_caregiver = true
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
    })

    it('will does not update has_caregiver when it is false, because a modal appears instead', () => {
      // given
      const mockFn = jest.fn()
      const sentAssessment = clone(assessment)
      sentAssessment.has_caregiver = true
      const props = {
        assessment: sentAssessment,
        client,
        onAssessmentUpdate: mockFn,
        substanceUseItemsIds: defaultProps.substanceUseItemsIds,
      }
      const options = shallow(<AssessmentFormHeader {...props} />).find('AssessmentOptions')

      // when
      const event = { target: { name: 'has_caregiver', value: 'false' } }
      options.props().onHasCaregiverChange(event)

      // then
      expect(mockFn).not.toHaveBeenCalled()
    })
  })

  describe('#handleCanReleaseInfoChange()', () => {
    it('will update can_release_confidential_info in assessment and set confidential_by_default items to confidential', () => {
      // given
      const mockFn = jest.fn()
      const sentAssessment = clone(assessment)
      sentAssessment.can_release_confidential_info = true
      const props = {
        assessment: sentAssessment,
        client,
        onAssessmentUpdate: mockFn,
        substanceUseItemsIds: defaultProps.substanceUseItemsIds,
      }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      expect(sentAssessment.state.domains[0].items[3].confidential).toBe(false)
      // when
      const event = {
        target: { name: 'can_release_confidential_info', value: 'false' },
      }
      let options = wrapper.find('AssessmentOptions')
      options.props().onCanReleaseInfoChange(event)
      // then
      const updatedAssessment = clone(assessment)
      updatedAssessment.can_release_confidential_info = false
      updatedAssessment.state.domains[0].items[3].confidential = true
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment)

      const switchToYesEvent = {
        target: { name: 'can_release_confidential_info', value: 'true' },
      }
      options = wrapper.find('AssessmentOptions')
      options.props().onCanReleaseInfoChange(switchToYesEvent)
      // then
      const secondUpdatedAssessment = clone(assessment)
      secondUpdatedAssessment.can_release_confidential_info = true
      secondUpdatedAssessment.state.domains[0].items[3].confidential = false
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
    })
  })

  describe('AgeRangeSwitch onChange', () => {
    it('will set under_six to its opposite and sets exapndAllDomains to false', () => {
      // given
      const assessmentUpdateMockFn = jest.fn()
      const expandCollapseMockFn = jest.fn()
      const props = {
        assessment,
        client,
        onAssessmentUpdate: assessmentUpdateMockFn,
        expandCollapse: expandCollapseMockFn,
        substanceUseItemsIds: defaultProps.substanceUseItemsIds,
      }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      expect(assessment.state.under_six).toBe(false)
      // when
      wrapper
        .find(AgeRangeSwitch)
        .props()
        .onChange(true)
      // then
      const updatedAssessment = clone(assessment)
      updatedAssessment.state.under_six = true
      expect(assessmentUpdateMockFn).toHaveBeenCalledWith(updatedAssessment)
      expect(expandCollapseMockFn).toHaveBeenCalledWith(false)
    })
  })

  describe('with client', () => {
    it('displays correct client name', () => {
      const title = shallow(<AssessmentFormHeader {...defaultProps} />)
        .find(CardTitle)
        .dive()
      expect(title.find('#child-name').text()).toBe('Doe, John')
    })

    it('displays client date of birth', () => {
      const title = shallow(<AssessmentFormHeader {...defaultProps} />)
        .find(CardTitle)
        .dive()
      expect(title.find('#child-dob').text()).toBe('DOB: 07/14/2007')
    })

    it('displays approximate date of birth', () => {
      const title = shallow(<AssessmentFormHeader {...propsWithEstimatedDob} />)
        .find(CardTitle)
        .dive()
      expect(title.find('#child-dob').text()).toBe('DOB: 07/14/2007 (approx.)')
    })

    it('displays client age', () => {
      const instance = shallow(<AssessmentFormHeader {...defaultProps} />).instance()
      const getCurrentDate = jest.spyOn(instance, 'getCurrentDate')
      getCurrentDate.mockReturnValue(moment('2019-02-08'))
      instance.forceUpdate()
      const title = shallow(<AssessmentFormHeader {...defaultProps} />)
        .find(CardTitle)
        .dive()
      expect(title.find('#child-age').text()).toBe('11 years old')
    })
  })

  describe('with no client', () => {
    const props = {
      assessment,
      client: {},
      onAssessmentUpdate: jest.fn(),
      substanceUseItemsIds: defaultProps.substanceUseItemsIds,
    }
    const headerTitle = shallow(<AssessmentFormHeader {...props} />)
      .find(CardTitle)
      .dive()

    it('displays default message', () => {
      expect(headerTitle.find('#no-data').text()).toBe('Client Info')
    })

    it('do not displays child name, age and DOB', () => {
      expect(headerTitle.find('#child-name').length).toBe(0)
      expect(headerTitle.find('#child-age').length).toBe(0)
      expect(headerTitle.find('#child-dob').length).toBe(0)
    })
  })

  describe('with county', () => {
    it('displays correct county name', () => {
      const title = shallow(<AssessmentFormHeader {...defaultProps} />)
        .find(CardTitle)
        .dive()
      expect(title.find('#county-name').text()).toBe('Calaveras County')
    })
  })

  describe('Assessment Conducted by', () => {
    const mockFn = jest.fn()
    it('renders input', () => {
      const props = {
        assessment,
        client,
        onAssessmentUpdate: mockFn,
        substanceUseItemsIds: defaultProps.substanceUseItemsIds,
      }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      expect(wrapper.find('#conducted-by').length).toBe(1)
    })

    it('disabled when assessment is read-only ', () => {
      const completedAssessment = clone(assessment)
      completedAssessment.metadata.allowed_operations = ['read', 'create', 'complete', 'delete']
      const props = {
        assessment: completedAssessment,
        client,
        onAssessmentUpdate: mockFn,
        substanceUseItemsIds: defaultProps.substanceUseItemsIds,
        disabled: true,
      }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      expect(wrapper.find('#conducted-by').prop('disabled')).toBeTruthy()
    })

    describe('#handleConductedByChange', () => {
      it('calls onAssessmentUpdate when conducted_by is changed', () => {
        const conductedByValue = 'NAME'
        const props = {
          assessment,
          client,
          onAssessmentUpdate: mockFn,
          substanceUseItemsIds: defaultProps.substanceUseItemsIds,
        }
        const wrapper = shallow(<AssessmentFormHeader {...props} />)
        const event = {
          target: { name: 'conducted_by', value: conductedByValue },
        }
        wrapper
          .find('#conducted-by')
          .props()
          .onChange(event)
        const updatedAssessment = clone(assessment)
        updatedAssessment.conducted_by = conductedByValue
        expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
      })
    })
  })

  describe('AssessmentFormHeader Card', () => {
    describe('when loading', () => {
      const wrapper = shallow(<AssessmentFormHeader {...defaultProps} />)

      it('renders AssessmentFormHeader Card ', () => {
        const card = wrapper.find(Card)
        expect(card.exists()).toBe(true)
      })

      it('has a card header', () => {
        expect(wrapper.find(CardHeader).exists()).toBe(true)
      })

      it('has a card content', () => {
        expect(wrapper.find(CardBody).exists()).toBe(true)
      })
    })
  })

  describe('read only mode', () => {
    const disabledProps = { ...defaultProps, disabled: true }
    const wrapper = shallow(<AssessmentFormHeader {...disabledProps} />)

    it('propagates disable props to <DateField> ', () => {
      expect(wrapper.find('DateField').prop('disabled')).toEqual(true)
    })

    it('propagates disable props to <AgeRangeSwitch> ', () => {
      expect(wrapper.find('AgeRangeSwitch').prop('disabled')).toEqual(true)
    })

    it('propagates disable props to <AssessmentOptions> ', () => {
      expect(wrapper.find('AssessmentOptions').prop('isDisabled')).toEqual(true)
    })

    it('propagates disable props to <ConductedByField> ', () => {
      expect(wrapper.find('ConductedByField').prop('disabled')).toEqual(true)
    })
  })
})
