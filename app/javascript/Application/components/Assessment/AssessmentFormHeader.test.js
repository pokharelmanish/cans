import React from 'react'
import { shallow, mount } from 'enzyme'
import { AssessmentFormHeader } from './index'
import { assessment, client } from './assessment.mocks.test'
import { clone } from '../../util/common'
import ConductedByField from './AssessmentFormHeader/ConductedByField'
import ConfidentialityAlert from './AssessmentFormHeader/ConfidentialityAlert'
import UnderSixQuestion from './AssessmentFormHeader/UnderSixQuestion'
import { Card, CardHeader, CardContent } from '@material-ui/core'

describe('<AssessmentFormHeader />', () => {
  it('renders with 1 <ConductedByField> component', () => {
    const wrapper = shallow(<AssessmentFormHeader {...{ assessment, client, onAssessmentUpdate: jest.fn() }} />)
    expect(wrapper.find(ConductedByField).exists()).toBe(true)
  })

  it('renders the under_six question when under_six is unknown', () => {
    const agelessAssessment = {
      ...assessment,
      state: { ...assessment.state, under_six: undefined },
    }
    const wrapper = shallow(
      <AssessmentFormHeader assessment={agelessAssessment} client={client} onAssessmentUpdate={jest.fn()} />
    )
    expect(wrapper.find(UnderSixQuestion).props().isUnderSix).toBe(null)
  })

  it('renders the under_six question when under_six is set', () => {
    const underSixAssessment = {
      ...assessment,
      state: { ...assessment.state, under_six: true },
    }
    const wrapper = shallow(
      <AssessmentFormHeader assessment={underSixAssessment} client={client} onAssessmentUpdate={jest.fn()} />
    )
    expect(wrapper.find(UnderSixQuestion).props().isUnderSix).toBe(true)
  })

  describe('case number', () => {
    it('renders with case number', () => {
      const assessmentWithCaseNumber = {
        ...assessment,
        service_source_ui_id: '0687-9473-7673-8000672',
      }
      const props = {
        assessment: assessmentWithCaseNumber,
        client,
        onAssessmentUpdate: jest.fn(),
        onKeyUp: jest.fn(),
      }
      const caseNumber = shallow(<AssessmentFormHeader {...props} />).find('#case-number')
      expect(caseNumber.text()).toBe('0687-9473-7673-8000672')
    })

    it('renders without case number when not exists', () => {
      const props = {
        assessment,
        client,
        onAssessmentUpdate: jest.fn(),
        onKeyUp: jest.fn(),
      }
      const caseNumber = shallow(<AssessmentFormHeader {...props} />).find('#case-number')
      expect(caseNumber.text()).toBe('')
    })
  })

  describe('labels', () => {
    let wrapped
    beforeEach(() => {
      wrapped = shallow(<AssessmentFormHeader {...{ assessment, client, onAssessmentUpdate: jest.fn() }} />)
    })

    it('renderDateSelect() returns correct label text', () => {
      expect(
        mount(wrapped.instance().renderDateSelect())
          .find('Label')
          .text()
      ).toBe('Assessment Date *')
    })

    it('renderHasCaregiverQuestion() returns correct label text', () => {
      expect(
        mount(wrapped.instance().renderHasCaregiverQuestion())
          .find('Typography')
          .first()
          .text()
      ).toBe('Child/Youth has Caregiver?')
    })

    it('renderCanReleaseInfoQuestion() returns correct label text', () => {
      expect(
        mount(wrapped.instance().renderCanReleaseInfoQuestion())
          .find('Typography')
          .first()
          .text()
      ).toBe('Authorization for release of information on file?')
    })
  })

  describe('#handleValueChange()', () => {
    it('will update event_date in assessment', () => {
      // given
      const mockFn = jest.fn()
      const props = { assessment, client, onAssessmentUpdate: mockFn }
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

  describe('HasCaregiverQuestion onHasCaregiverChange', () => {
    it('will update has_caregiver in assessment', () => {
      // given
      const mockFn = jest.fn()
      const sentAssessment = clone(assessment)
      sentAssessment.has_caregiver = true
      const props = {
        assessment: sentAssessment,
        client,
        onAssessmentUpdate: mockFn,
      }
      const hasCaregiverQuestion = shallow(<AssessmentFormHeader {...props} />).find('HasCaregiverQuestion')

      // when
      const event = { target: { name: 'has_caregiver', value: 'false' } }
      hasCaregiverQuestion.props().onHasCaregiverChange(event)

      // then
      const updatedAssessment = clone(assessment)
      updatedAssessment.has_caregiver = false
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
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
      }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      expect(sentAssessment.state.domains[0].items[3].confidential).toBe(false)
      // when
      const event = {
        target: { name: 'can_release_confidential_info', value: 'false' },
      }
      wrapper.instance().handleCanReleaseInfoChange(event)
      // then
      const updatedAssessment = clone(assessment)
      updatedAssessment.can_release_confidential_info = false
      updatedAssessment.state.domains[0].items[3].confidential = true
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
    })
  })

  describe('UnderSixQuestion onChange', () => {
    it('will set under_six to its opposite', () => {
      // given
      const mockFn = jest.fn()
      const props = { assessment, client, onAssessmentUpdate: mockFn }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      expect(assessment.state.under_six).toBe(false)
      // when
      wrapper
        .find(UnderSixQuestion)
        .props()
        .onChange(true)
      // then
      const updatedAssessment = clone(assessment)
      updatedAssessment.state.under_six = true
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
    })
  })

  describe('with client', () => {
    it('displays correct client name', () => {
      const props = { assessment, client, onAssessmentUpdate: jest.fn() }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      const headerTitle = shallow(wrapper.find(CardHeader).props().title)
      expect(headerTitle.find('#child-name').text()).toBe('Doe, John')
    })
  })

  describe('with no client', () => {
    it('displays default message', () => {
      const props = { assessment, client: {}, onAssessmentUpdate: jest.fn() }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      const headerTitle = shallow(wrapper.find(CardHeader).props().title)
      expect(headerTitle.find('#no-data').text()).toBe('Client Info')
    })
  })

  describe('with county', () => {
    it('displays correct county name', () => {
      const props = { assessment, client, onAssessmentUpdate: jest.fn() }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      const headerAction = shallow(wrapper.find(CardHeader).props().action)
      expect(headerAction.find('#county-name').text()).toBe('Calaveras County')
    })
  })

  it('renders a confidentiality warning alert', () => {
    const sentAssessment = clone(assessment)
    sentAssessment.can_release_confidential_info = true
    const props = {
      assessment: sentAssessment,
      client,
      onAssessmentUpdate: jest.fn(),
    }

    const wrapper = shallow(<AssessmentFormHeader {...props} />)
    const alert = wrapper.find(ConfidentialityAlert)
    expect(alert.exists()).toBe(true)
    expect(alert.props().canReleaseInformation).toBe(true)
  })

  describe('Assessment Conducted by', () => {
    const mockFn = jest.fn()
    it('renders input', () => {
      const props = { assessment, client, onAssessmentUpdate: mockFn }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      expect(wrapper.find('#conducted-by').length).toBe(1)
    })

    it('disabled when assessment completed ', () => {
      const completedAssessment = clone(assessment)
      completedAssessment.status = 'COMPLETED'
      const props = {
        assessment: completedAssessment,
        client,
        onAssessmentUpdate: mockFn,
      }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      expect(wrapper.find('#conducted-by').prop('isDisabled')).toBeTruthy()
    })

    describe('#handleConductedByChange', () => {
      it('calls onAssessmentUpdate when conducted_by is changed', () => {
        const conductedByValue = 'NAME'
        const props = { assessment, client, onAssessmentUpdate: mockFn }
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
      const props = { assessment, client, onAssessmentUpdate: jest.fn() }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)

      it('renders AssessmentFormHeader Card ', () => {
        const card = wrapper.find(Card)
        expect(card.exists()).toBe(true)
      })

      it('has a card header', () => {
        expect(wrapper.find(CardHeader).exists()).toBe(true)
      })

      it('has a card content', () => {
        expect(wrapper.find(CardContent).exists()).toBe(true)
      })
    })
  })
})
