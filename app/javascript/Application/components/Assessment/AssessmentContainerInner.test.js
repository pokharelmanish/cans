import React from 'react'
import { shallow } from 'enzyme'
import AssessmentContainerInner from './AssessmentContainerInner'
import { assessment } from './assessment.mocks.test'
import AssessmentSummaryCard from './AssessmentSummary/AssessmentSummaryCard'
import AssessmentFormHeader from './AssessmentFormHeader'
import ChangelogLink from './ChangelogLink'
import RenderWarning from '../common/RenderWarning'
import { Assessment } from './index'

const getLength = (wrapper, component) => wrapper.find(component).length

const props = {
  assessment: assessment,
  assessmentServiceStatus: 'IDLE',
  client: {},
  handleCaregiverRemove: jest.fn(),
  handleCompleteAssessment: jest.fn(),
  handleSaveAssessment: jest.fn(),
  onEventDateFieldKeyUp: jest.fn(),
  isCompleteModalShown: false,
  i18n: {},
  isValidForSubmit: false,
  onAssessmentUpdate: jest.fn(),
  onCancelClick: jest.fn(),
  handleCompleteWarning: jest.fn(),
  onKeyUp: jest.fn(),
  isEventDateBeforeDob: false,
  substanceUseItemsIds: { underSix: ['41'], aboveSix: ['8', '48'] },
}

describe('AssessmentContainerInner />', () => {
  describe('renders component and shows warning', () => {
    it('renders with 1 <AssessmentSummaryCard /> component', () => {
      const wrapper = shallow(<AssessmentContainerInner {...props} />)
      expect(getLength(wrapper, AssessmentSummaryCard)).toBe(1)
    })

    it('renders with <AssessmentFormHeader /> component initially', () => {
      const wrapper = shallow(<AssessmentContainerInner {...props} />)
      expect(getLength(wrapper, AssessmentFormHeader)).toBe(1)
    })

    it('renders with <Assessment /> component initially', () => {
      const wrapper = shallow(<AssessmentContainerInner {...props} />)
      expect(getLength(wrapper, Assessment)).toBe(1)
    })

    describe('ChangelogLink', () => {
      it('renders ChangelogLink when assessment has an id', () => {
        const wrapper = shallow(<AssessmentContainerInner {...props} />)
        expect(wrapper.find(ChangelogLink).exists()).toBeTruthy()
      })

      it('hides ChangelogLink when assessment has no id yet', () => {
        const wrapper = shallow(<AssessmentContainerInner {...props} />)
        wrapper.setProps({ assessment: { ...assessment, id: null } })
        expect(wrapper.find(ChangelogLink).exists()).toBeFalsy()
      })

      it('sets props for ChangelogLink', () => {
        const changelogLink = shallow(<AssessmentContainerInner {...props} />).find(ChangelogLink)
        expect(changelogLink.props().assessmentId).toBe(1)
        expect(changelogLink.props().assessmentStatus).toEqual('IN_PROGRESS')
      })
    })
  })

  describe('renders a component which shows warning and sets the state', () => {
    it('verify the state is updated and sets isCaregiverWarningShown to false', () => {
      const wrapper = shallow(<AssessmentContainerInner {...props} />)
      wrapper.instance().setState({
        isCaregiverWarningShown: true,
        focusedCaregiverId: 0,
      })
      wrapper
        .find(RenderWarning)
        .props()
        .handleWarningShow(false)
      wrapper.instance().handleWarningShow(false)
      expect(wrapper.state().isCaregiverWarningShown).toEqual(false)
    })

    it('verify the state is updated and sets isCaregiverWarningShown to true', () => {
      const wrapper = shallow(<AssessmentContainerInner {...props} />)
      wrapper.instance().setState({
        isCaregiverWarningShown: false,
        focusedCaregiverId: 0,
      })
      wrapper
        .find(RenderWarning)
        .props()
        .handleWarningShow(true)
      wrapper.instance().handleWarningShow(true)
      expect(wrapper.state().isCaregiverWarningShown).toEqual(true)
    })
  })

  describe('verifies if caregiver id is removed when the state is updated', () => {
    it('should set cargiver value to null', () => {
      const wrapper = shallow(<AssessmentContainerInner {...props} />)
      wrapper.instance().setState({
        isCaregiverWarningShown: true,
        focusedCaregiverId: 0,
      })
      wrapper.instance().handleWarningShow(false)
      expect(wrapper.state().isCaregiverWarningShown).toEqual(false)
      expect(wrapper.state().focusedCaregiverId).toEqual(null)
    })

    it('should update cargiver value in state', () => {
      const wrapper = shallow(<AssessmentContainerInner {...props} />)
      wrapper.instance().setState({
        isCaregiverWarningShown: true,
        focusedCaregiverId: 1,
      })
      wrapper.instance().handleWarningShow(false, 1)
      expect(wrapper.state().isCaregiverWarningShown).toEqual(false)
      expect(wrapper.state().focusedCaregiverId).toEqual(1)
    })
  })

  describe('isComplete warning shown', () => {
    it('isCompleteModalShown is false it does not renders the Modal component', () => {
      const wrapper = shallow(<AssessmentContainerInner {...props} />)
      wrapper.instance().setState({
        isCompleteModalShown: false,
      })
      const completeModal = wrapper.find('CompleteModal').dive()
      expect(completeModal.find('Modal').props().isOpen).toBe(false)
    })

    it('isCompleteModalShown is true it renders the Modal component', () => {
      const wrapper = shallow(<AssessmentContainerInner {...props} />)
      wrapper.instance().setState({
        isCompleteModalShown: true,
      })
      const completeModal = wrapper.find('CompleteModal').dive()
      expect(completeModal.find('Modal').props().isOpen).toBe(true)
    })
  })

  describe('changes the state of the component when handleCompleteWarning is invoked', () => {
    it('sets isCompleteModalShown to false when handleCompleteWarning is called', () => {
      const wrapper = shallow(<AssessmentContainerInner {...props} />)
      wrapper.instance().setState({
        isCompleteModalShown: true,
      })
      wrapper
        .find('CompleteModal')
        .props()
        .handleCompleteWarning(false)
      expect(wrapper.state().isCompleteModalShown).toEqual(false)
    })

    it('sets isCompleteModalShown to true when handleCompleteWarning is called', () => {
      const wrapper = shallow(<AssessmentContainerInner {...props} />)
      wrapper.instance().setState({
        isCompleteModalShown: false,
      })
      wrapper
        .find('CompleteModal')
        .props()
        .handleCompleteWarning(true)
      expect(wrapper.state().isCompleteModalShown).toEqual(true)
    })

    describe('#handleExpandAllDomains()', () => {
      const wrapper = shallow(<AssessmentContainerInner {...props} />)
      it('toggles isDefaultExpanded state when called with no parameter', () => {
        wrapper.instance().setState({
          isDefaultExpanded: false,
        })
        wrapper.instance().handleExpandAllDomains()
        expect(wrapper.state().isDefaultExpanded).toEqual(true)
      })

      it('updates isDefaultExpanded state to false when called with false', () => {
        wrapper.instance().setState({
          isDefaultExpanded: true,
        })
        wrapper.instance().handleExpandAllDomains(false)
        expect(wrapper.state().isDefaultExpanded).toEqual(false)
      })
    })
  })

  describe('<AssessmentFormHeader />', () => {
    it('should set isEventDateBeforeDob prop to true', () => {
      const wrapper = shallow(<AssessmentContainerInner {...props} />)
      wrapper.setProps({ isEventDateBeforeDob: true })
      expect(wrapper.find('AssessmentFormHeader').prop('isEventDateBeforeDob')).toEqual(true)
    })

    it('should set isEventDateBeforeDob prop to false', () => {
      const wrapper = shallow(<AssessmentContainerInner {...props} />)
      expect(wrapper.find('AssessmentFormHeader').prop('isEventDateBeforeDob')).toEqual(false)
    })
  })

  describe('isEditable', () => {
    const wrapper = shallow(<AssessmentContainerInner {...props} />)

    it('should enable <AssessmentFormHeader/> when isEditable=true and disable when isEditable=false', () => {
      wrapper.setProps({ isEditable: true })
      expect(wrapper.find('AssessmentFormHeader').prop('disabled')).toEqual(false)

      wrapper.setProps({ isEditable: false })
      expect(wrapper.find('AssessmentFormHeader').prop('disabled')).toEqual(true)
    })

    it('should enable  <AssessmentSummaryCard/> when isEditable=true and disable when isEditable=false', () => {
      wrapper.setProps({ isEditable: true })
      expect(wrapper.find('AssessmentSummaryCard').prop('disabled')).toEqual(false)

      wrapper.setProps({ isEditable: false })
      expect(wrapper.find('AssessmentSummaryCard').prop('disabled')).toEqual(true)
    })

    it('should enable  <Assessment/> when isEditable=true and disable when isEditable=false', () => {
      wrapper.setProps({ isEditable: true })
      expect(wrapper.find('Assessment').prop('disabled')).toEqual(false)

      wrapper.setProps({ isEditable: false })
      expect(wrapper.find('Assessment').prop('disabled')).toEqual(true)
    })
  })
})
