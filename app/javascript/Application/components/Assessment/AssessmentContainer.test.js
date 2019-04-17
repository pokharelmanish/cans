import { globalAlertService } from '../../util/GlobalAlertService'
import React from 'react'
import { AssessmentContainer, AssessmentService, AssessmentStatus } from './index'
import { I18nService } from '../common/'
import * as AHelper from './AssessmentHelper'
import * as ReassessmentHelper from './ReassessmentHelper'
import { childInfoJson } from '../Client/Client.helper.test'
import ClientService from '../Client/Client.service'
import { mount, shallow } from 'enzyme'
import AssessmentFormFooter from './FormFooter/AssessmentFormFooter'
import * as AssessmentAutoScroll from '../../util/assessmentAutoScroll'
import AssessmentContainerInner from '../Assessment/AssessmentContainerInner'
import PageModal from '../common/PageModal'
import pageLockService from '../common/PageLockService'
import {
  assessment,
  domainWithTwoCaregiver,
  initialAssessment,
  subsequentAssessment,
  updatedAssessment,
  updatedAssessmentDomains,
  updatedAssessmentWithDomains,
} from './assessment.mocks.test'
import { LoadingState } from '../../util/loadingHelper'
import { getCurrentIsoDate } from '../../util/dateHelper'
import * as Analytics from '../../util/analytics'

jest.mock('../../util/analytics')

const defaultProps = {
  location: { childId: 1 },
  match: { params: { id: 1 }, url: 'someurl/someid/someending' },
  pageHeaderController: {
    updateHeaderButtons: () => {},
    updateHeaderButtonsToDefault: () => {},
    updateHeaderTitle: () => {},
  },
  client: childInfoJson,
}

describe('<AssessmentContainer />', () => {
  const analyticsSpy = jest.spyOn(Analytics, 'logPageAction')
  beforeEach(() => {
    analyticsSpy.mockReset()
  })

  describe('init AssessmentContainer', () => {
    describe('page layout', () => {
      const props = {
        location: { childId: 10 },
        match: { params: { id: 1 }, url: 'someUrl' },
        pageHeaderController: { ...defaultProps.pageHeaderController },
        client: {},
        assessment: {},
      }

      const getLength = (wrapper, component) => wrapper.find(component).length

      it('renders with 1 <AssessmentContainerInner/> component', async () => {
        const wrapper = await shallow(<AssessmentContainer {...props} />)
        expect(getLength(wrapper, AssessmentContainerInner)).toBe(1)
      })
    })

    describe('page header buttons', () => {
      it('should update page header buttons when all data loaded', async () => {
        const updateHeaderButtonsMock = jest.fn()
        const props = {
          ...defaultProps,
          match: { params: {} },
          pageHeaderController: {
            updateHeaderButtons: updateHeaderButtonsMock,
            updateHeaderButtonsToDefault: () => {},
            updateHeaderTitle: () => {},
          },
        }
        const wrapper = shallow(<AssessmentContainer {...props} />, { disableLifecycleMethods: true })
        await wrapper.instance().onFetchI18nSuccess({ key: 'value' })
        expect(updateHeaderButtonsMock).toHaveBeenCalledTimes(1)
      })

      it('should update page header buttons on componentDidUpdate', async () => {
        jest.spyOn(I18nService, 'fetchByInstrumentId').mockReturnValue(Promise.resolve({ key: 'value' }))
        const updateHeaderButtonsMock = jest.fn()
        const props = {
          ...defaultProps,
          match: { params: {} },
          pageHeaderController: {
            updateHeaderButtons: updateHeaderButtonsMock,
            updateHeaderButtonsToDefault: () => {},
            updateHeaderTitle: () => {},
          },
        }
        const wrapper = shallow(<AssessmentContainer {...props} />, { disableLifecycleMethods: true })
        wrapper.instance().shouldSaveButtonBeEnabled = jest.fn(() => true)
        wrapper.instance().componentDidUpdate({}, { isUnsaved: false })
        expect(updateHeaderButtonsMock).toHaveBeenCalledTimes(1)
      })

      describe('#updateSaveButtonStatusIfNeeded()', () => {
        it('should update page header buttons when needed', () => {
          const updateHeaderButtonsMock = jest.fn()
          const props = {
            ...defaultProps,
            match: { params: {} },
            pageHeaderController: {
              updateHeaderButtons: updateHeaderButtonsMock,
              updateHeaderButtonsToDefault: () => {},
              updateHeaderTitle: () => {},
            },
          }
          const wrapper = shallow(<AssessmentContainer {...props} />, { disableLifecycleMethods: true })
          wrapper.instance().shouldSaveButtonBeEnabled = jest.fn(() => true)
          wrapper.instance().componentDidUpdate({}, { isUnsaved: false })
          expect(updateHeaderButtonsMock).toHaveBeenCalledTimes(1)
        })

        it('should not update page header buttons when it is not needed', () => {
          const updateHeaderButtonsMock = jest.fn()
          const props = {
            ...defaultProps,
            match: { params: {} },
            pageHeaderController: {
              updateHeaderButtons: updateHeaderButtonsMock,
              updateHeaderButtonsToDefault: () => {},
              updateHeaderTitle: () => {},
            },
          }
          const wrapper = shallow(<AssessmentContainer {...props} />, { disableLifecycleMethods: true })
          wrapper.instance().shouldSaveButtonBeEnabled = jest.fn(() => false)
          wrapper.instance().componentDidUpdate({}, { isUnsaved: false })
          expect(updateHeaderButtonsMock).toHaveBeenCalledTimes(0)
        })
      })

      it('should reset page header buttons to default values on component will unmount ', () => {
        const updateToDefaultMock = jest.fn()
        const props = {
          ...defaultProps,
          match: { params: {} },
          pageHeaderController: {
            updateHeaderButtons: () => {},
            updateHeaderButtonsToDefault: updateToDefaultMock,
            updateHeaderTitle: () => {},
          },
        }
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().componentWillUnmount()
        expect(updateToDefaultMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('renders a component which shows warning and sets the state', () => {
      const props = { ...defaultProps }
      it('verify the state is updated and removed domains ', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().setState({
          assessment: assessment,
        })
        wrapper.instance().handleCaregiverRemove(1)
        wrapper.state().assessment.state.domains = updatedAssessmentDomains
        wrapper.instance().updateAssessment(wrapper.state().assessment)
        expect(wrapper.state().assessment).toEqual(updatedAssessmentWithDomains)
      })

      it('verify the state is updated and the modal is closed', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().setState({
          assessment: assessment,
        })
        wrapper
          .find(AssessmentContainerInner)
          .props()
          .handleCaregiverRemove(null)
        wrapper.instance().handleCaregiverRemove(null)
        wrapper.instance().handleCaregiverRemoveAll('has_caregiver', false)
        expect(wrapper.state().assessment.has_caregiver).toEqual(false)
      })
    })

    describe('when user clicks remove or switches radio to no caregiver doamins are removed', () => {
      const props = { ...defaultProps }
      it('will delete the caregiver by id ', () => {
        const wrapper = mount(<AssessmentContainer {...props} />)
        wrapper.setState({
          assessment: {
            ...assessment,
            has_caregiver: true,
            state: {
              ...assessment.state,
              domains: [...domainWithTwoCaregiver],
            },
          },
        })
        wrapper
          .find(AssessmentContainerInner)
          .props()
          .handleCaregiverRemove('a')

        wrapper.update()
        expect(wrapper.state().assessment.state.domains.length).toEqual(1)
        expect(wrapper.state().assessment.state.domains[0].caregiver_index).toEqual('b')
      })

      it('removes all caregiver domains when user confirms after switching radio button to no', () => {
        const wrapper = mount(<AssessmentContainer {...props} />)
        wrapper.setState({
          assessment: {
            ...assessment,
            has_caregiver: true,
            state: {
              ...assessment.state,
              domains: [...domainWithTwoCaregiver],
            },
          },
        })
        wrapper
          .find(AssessmentContainerInner)
          .props()
          .handleCaregiverRemove()
        wrapper.update()
        expect(wrapper.state().assessment.state.domains.length).toEqual(0)
      })

      it('removes a single caregiver domain and the cargiver value is updated', () => {
        const wrapper = mount(<AssessmentContainer {...props} />)
        const single = [domainWithTwoCaregiver[1]]
        wrapper.setState({
          assessment: {
            ...assessment,
            has_caregiver: true,
            state: { ...assessment.state, domains: [...single] },
          },
        })
        wrapper
          .find(AssessmentContainerInner)
          .props()
          .handleCaregiverRemove()

        wrapper.update()
        expect(wrapper.state().assessment.state.domains.length).toEqual(0)
        expect(wrapper.state().assessment.has_caregiver).toEqual(false)
      })
    })

    describe('warning modal when warning is canceled', () => {
      const props = { ...defaultProps }
      it('should not render PageModal component when warningShow is not true', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().setState({
          assessment: assessment,
          isCaregiverWarningShown: false,
        })
        expect(wrapper.find(PageModal).length).toBe(0)
      })
    })

    describe('assessment form with no existing assessment', () => {
      const props = {
        client: childInfoJson,
        pageHeaderController: {
          updateHeaderButtons: () => {},
          updateHeaderButtonsToDefault: () => {},
          updateHeaderTitle: () => {},
        },
      }

      it('calls initializeAssessment', async () => {
        const assessmentServiceGetSpy = jest.spyOn(AssessmentService, 'initializeAssessment')
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
        assessmentServiceGetSpy.mockReturnValue(Promise.resolve(initialAssessment))
        const wrapper = shallow(<AssessmentContainer {...props} />)
        await wrapper.instance().componentDidMount()
        expect(assessmentServiceGetSpy).toHaveBeenCalledWith('aaaaaaaaaa')
      })

      it('sets a new assessment on component state', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        expect(wrapper.state('assessment').instrument_id).toBeFalsy()
        wrapper.instance().onFetchNewAssessmentSuccess(initialAssessment)
        expect(wrapper.state('assessment')).toEqual(initialAssessment)
      })

      it('hides the complete validation message', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().onFetchNewAssessmentSuccess(initialAssessment)
        expect(wrapper.find('.submit-validation-message').exists()).toBe(false)
      })

      it('hides the assessment footer', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.setState({
          assessment: {
            ...assessment,
          },
        })
        wrapper.instance().updateIsEditableState()
        wrapper.update()
        expect(wrapper.find(AssessmentFormFooter).exists()).toBeFalsy()
      })

      it('shows the assessment footer', () => {
        const wrapper = mount(<AssessmentContainer {...defaultProps} />)
        wrapper.setState({
          assessment: {
            ...assessment,
          },
        })
        wrapper.instance().updateIsEditableState()
        wrapper.update()
        expect(wrapper.find('AssessmentFormFooter').exists()).toBeTruthy()
      })
    })

    describe('assessment form with an existing assessment', () => {
      const props = {
        match: { params: { id: 123 } },
        pageHeaderController: {
          updateHeaderButtons: () => {},
          updateHeaderButtonsToDefault: () => {},
          updateHeaderTitle: () => {},
        },
        client: {},
      }

      it('calls fetchAssessment', async () => {
        const assessmentServiceGetSpy = jest.spyOn(AssessmentService, 'fetch')
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
        assessmentServiceGetSpy.mockReturnValue(Promise.resolve(assessment))
        const wrapper = shallow(<AssessmentContainer {...props} />)
        await wrapper.instance().componentDidMount()
        expect(assessmentServiceGetSpy).toHaveBeenCalledWith(123)
      })
    })
  })

  describe('save assessment', () => {
    describe('with a new assessment', () => {
      it('should call AssessmentService.postAssessment', () => {
        const assessmentServicePostSpy = jest.spyOn(AssessmentService, 'postAssessment')
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        const assessment = {
          event_date: getCurrentIsoDate(),
          has_caregiver: true,
          person: childInfoJson,
          state: { domains: [] },
        }
        wrapper.instance().handleSaveAssessment()
        assessmentServicePostSpy.mockReturnValue(Promise.resolve(assessment))
        expect(assessmentServicePostSpy).toHaveBeenCalledWith(assessment)
      })

      it('should show success message on initial save', async () => {
        // given
        const postSuccessSpy = jest.spyOn(AHelper, 'postSuccessMessage')
        jest.spyOn(AssessmentService, 'postAssessment').mockReturnValue(Promise.resolve(assessment))
        const wrapper = await shallow(<AssessmentContainer {...defaultProps} />)

        // when
        await wrapper.instance().handleSaveAssessment()
        wrapper.update()

        // then
        expect(postSuccessSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('with an existing assessment', () => {
      it('should call AssessmentService.update', () => {
        const assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update')
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        assessmentServicePutSpy.mockReturnValue(Promise.resolve(assessment))
        wrapper.setState({ assessment: { ...assessment, id: 1 } })
        wrapper.instance().handleSaveAssessment()
        expect(assessmentServicePutSpy).toHaveBeenCalledWith(1, {
          ...assessment,
          id: 1,
          person: childInfoJson,
        })
      })

      it('should update state with assessment', async () => {
        const assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update')
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        assessmentServicePutSpy.mockReturnValue(Promise.resolve(assessment))
        wrapper.setState({ assessment: { ...assessment, id: 1 } })
        await wrapper.instance().handleSaveAssessment()
        expect(assessmentServicePutSpy).toHaveBeenCalledWith(1, {
          ...assessment,
          id: 1,
          person: childInfoJson,
        })
        expect(wrapper.state('assessment').id).toBe(1)
        expect(wrapper.state('assessment').state.domains).toBeTruthy()
      })

      it('should post success message on save', async () => {
        // given
        const postSuccessSpy = jest.spyOn(AHelper, 'postSuccessMessage')
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
        jest.spyOn(AssessmentService, 'update').mockReturnValue(Promise.resolve(assessment))
        const wrapper = await shallow(<AssessmentContainer {...defaultProps} />)
        wrapper.setState({ assessment: { ...assessment, id: 1 } })
        // when
        await wrapper.instance().handleSaveAssessment()
        wrapper.update()

        // then
        expect(postSuccessSpy).toHaveBeenCalledTimes(1)
      })

      it('should post success message on complete', async () => {
        // given
        const postSuccessSpy = jest.spyOn(globalAlertService, 'postSuccess')
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
        jest.spyOn(AssessmentService, 'update').mockReturnValue(Promise.resolve(assessment))
        const wrapper = await shallow(<AssessmentContainer {...defaultProps} />)
        wrapper.setState({ assessment: { ...assessment, id: 1 } })
        // when
        await wrapper.instance().handleCompleteAssessment()
        wrapper.update()

        // then
        expect(postSuccessSpy).toHaveBeenCalledTimes(1)
      })

      it('should set isEditable to false after complete', async () => {
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
        const wrapper = await shallow(<AssessmentContainer {...defaultProps} />)
        wrapper.setState({ assessment: { ...assessment, id: 1 }, isEditable: true })

        expect(wrapper.instance().state.isEditable).toBe(true)
        const assessmentAfterUpdate = { ...assessment, metadata: { allowed_operations: [] } }
        jest.spyOn(AssessmentService, 'update').mockReturnValue(Promise.resolve(assessmentAfterUpdate))
        await wrapper.instance().handleCompleteAssessment()
        wrapper.update()

        expect(wrapper.instance().state.isEditable).toBe(false)
      })
    })

    it('should log analytics to New Relic when assessment is saved', async () => {
      const assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update')
      const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
      assessmentServicePutSpy.mockReturnValue(Promise.resolve(assessment))
      wrapper.setState({ assessment: assessment })
      await wrapper.instance().handleSaveAssessment()
      expect(analyticsSpy).toHaveBeenCalledWith('assessmentSave', {
        assessment_id: 1,
        assessment_county: assessment.county.name,
      })
    })

    describe('#assessment summary card', () => {
      describe('when all required fields are not filled in and all items are not selected', () => {
        const wrapper = mount(<AssessmentContainer {...defaultProps} />)
        wrapper.setState({
          assessment: initialAssessment,
          isEditable: true,
        })
        wrapper.instance().updateAssessment(initialAssessment)
        it('does not display summary card', () => {
          expect(wrapper.find('AssessmentSummaryCard').prop('isSummaryAvailableOnSave')).toEqual(false)
        })
      })

      describe('when all required fields are filled in and all items are selected', () => {
        let wrapper
        let assessmentServicePutSpy
        beforeEach(() => {
          assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update')
          wrapper = shallow(<AssessmentContainer {...defaultProps} />)
          assessmentServicePutSpy.mockReturnValue(Promise.resolve(updatedAssessmentWithDomains))
          wrapper.setState({
            assessment: updatedAssessmentWithDomains,
            isEditable: true,
          })
          wrapper.instance().updateAssessment(updatedAssessmentWithDomains)
        })

        it('returns canDisplaySummaryOnSave true', async () => {
          await wrapper.instance().handleSaveAssessment()
          expect(wrapper.state('canDisplaySummaryOnSave')).toEqual(true)
        })
      })
    })
  })

  describe('complete assessment', () => {
    describe('when a new assessment', () => {
      let wrapper
      let assessmentServicePostSpy
      let assessmentServiceUpdateSpy
      beforeEach(() => {
        wrapper = shallow(<AssessmentContainer {...props} />)
        assessmentServicePostSpy = jest.spyOn(AssessmentService, 'postAssessment')
        assessmentServiceUpdateSpy = jest.spyOn(AssessmentService, 'update')
        assessmentServicePostSpy.mockReturnValue(Promise.resolve(assessment))
        assessmentServiceUpdateSpy.mockReturnValue(Promise.resolve(assessment))
      })
      const props = {
        match: { params: { id: 1 }, url: 'someurl/someid/someending' },
        client: childInfoJson,
        pageHeaderController: {
          updateHeaderButtons: () => {},
          updateHeaderButtonsToDefault: () => {},
          updateHeaderTitle: () => {},
        },
      }

      it('should call AssessmentService.postAssessment', () => {
        wrapper.instance().handleCompleteAssessment()
        const expectedArgument = {
          event_date: getCurrentIsoDate(),
          has_caregiver: true,
          person: childInfoJson,
          state: { domains: [] },
          status: 'COMPLETED',
        }
        expect(assessmentServicePostSpy).toHaveBeenCalledWith(expectedArgument)
      })

      it('should call completeAutoScroll with right parameters', async () => {
        const completeAutoScrollSpy = jest.spyOn(AssessmentAutoScroll, 'completeAutoScroll')
        const tuner = 15
        await wrapper.instance().handleCompleteAssessment()
        expect(completeAutoScrollSpy).toHaveBeenCalledWith(0, tuner)
      })

      it('should call postSuccessMessage with right parameters', async () => {
        const postSuccessSpy = jest.spyOn(AHelper, 'postSuccessMessage')
        jest.spyOn(AssessmentService, 'postAssessment').mockReturnValue(Promise.resolve(assessment))
        await wrapper.instance().handleCompleteAssessment()
        expect(postSuccessSpy).toHaveBeenCalledTimes(1)
        expect(postSuccessSpy).toHaveBeenCalledWith('someurl/someid/someending', 'COMPLETE')
      })
    })

    describe('when an existing assessment', () => {
      it('should call AssessmentService.update', () => {
        const assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update')
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        assessmentServicePutSpy.mockReturnValue(Promise.resolve(assessment))
        wrapper.setState({ assessment: { ...assessment, id: 1 } })
        wrapper.instance().handleCompleteAssessment()
        expect(assessmentServicePutSpy).toHaveBeenCalledWith(1, {
          ...assessment,
          id: 1,
          person: childInfoJson,
          status: 'COMPLETED',
        })
      })
    })

    it('should log analytics to New Relic when assessment is completed', async () => {
      const assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update')
      const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
      assessmentServicePutSpy.mockReturnValue(Promise.resolve(assessment))
      wrapper.setState({ assessment: assessment })
      await wrapper.instance().handleCompleteAssessment()
      expect(analyticsSpy).toHaveBeenCalledWith('assessmentSubmit', {
        assessment_id: 1,
        assessment_county: assessment.county.name,
      })
    })
  })

  describe('update assessment', () => {
    describe('is passed updated data', () => {
      it('will update the assessment on the component state', () => {
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        wrapper.setState({ assessment: assessment })
        expect(wrapper.state('assessment')).toEqual(assessment)
        wrapper.instance().updateAssessment(updatedAssessment)
        expect(wrapper.state('assessment')).toEqual(updatedAssessment)
      })

      it('validates assessment for complete', () => {
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        wrapper.setState({ assessment: updatedAssessment })
        expect(wrapper.state('isValidForSubmit')).toEqual(false)
        wrapper.instance().updateAssessment(assessment)
        expect(wrapper.state('isValidForSubmit')).toEqual(true)
      })
    })
  })

  describe('initial save', () => {
    it('will update the assessment on the component state', () => {
      const props = {
        location: { childId: 1 },
        match: { params: { id: 1 }, url: 'someUrl' },
        history: { replace: jest.fn() },
        client: childInfoJson,
        pageHeaderController: { ...defaultProps.pageHeaderController },
      }
      const wrapper = shallow(<AssessmentContainer {...props} />)

      wrapper.setState({ assessment: assessment })
      expect(wrapper.state('assessment')).toEqual(assessment)
      wrapper.instance().initialSave(updatedAssessment)
      expect(wrapper.state('assessment')).toEqual(updatedAssessment)
    })

    it('will update the url with the assessment id', () => {
      const historyPushMock = { replace: jest.fn() }
      const wrapper = shallow(<AssessmentContainer {...defaultProps} history={historyPushMock} />)

      wrapper.setState({ child: childInfoJson })
      wrapper.instance().initialSave(updatedAssessment)

      expect(historyPushMock.replace).toHaveBeenCalledWith('someurl/someid/someending/1')
    })
  })

  describe('buttons', () => {
    describe('Cancel button', () => {
      it('redirects to client page', async () => {
        const trimUrlForClientProfileSpy = jest.spyOn(AHelper, 'trimUrlForClientProfile')
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />, {
          disableLifecycleMethods: true,
        })
        pageLockService.unlock()
        await wrapper.instance().handleCancelClick()
        expect(wrapper.state().shouldRedirectToClientProfile).toEqual(true)
        expect(wrapper.find('Redirect').exists()).toBe(true)
        expect(trimUrlForClientProfileSpy).toHaveBeenCalledWith(defaultProps.match.url)
      })
    })

    describe('Complete button', () => {
      it('is disabled/enabled based on the assessment validity', () => {
        const wrapper = mount(<AssessmentContainer {...defaultProps} />)
        wrapper.setState({
          isValidForSubmit: false,
          assessmentServiceStatus: LoadingState.ready,
          isEditable: true,
          assessment,
        })
        expect(wrapper.find('AssessmentFormFooter').prop('isSubmissionEnabled')).toBe(false)

        wrapper.setState({
          isValidForSubmit: true,
          assessmentServiceStatus: LoadingState.ready,
          isEditable: true,
          assessment,
        })
        expect(wrapper.find('AssessmentFormFooter').prop('isSubmissionEnabled')).toBe(true)
      })
    })

    describe('handleEventDateFieldKeyUp', () => {
      let wrapper
      let instance
      beforeEach(() => {
        wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        instance = wrapper.instance()
      })

      it('should default isValidDate to true', () => {
        expect(instance.state.isValidDate).toEqual(true)
      })

      it('should set isValidDate to true when date is valid', () => {
        instance.setState({ isValidDate: false })
        instance.handleEventDateFieldKeyUp({ target: { value: '10/09/2018' } })
        expect(instance.state.isValidDate).toEqual(true)
      })

      it('should set isValidDate to false when date is invalid', () => {
        instance.handleEventDateFieldKeyUp({ target: { value: '325982323' } })
        expect(instance.state.isValidDate).toEqual(false)
        instance.handleEventDateFieldKeyUp({ target: { value: '10/2019/21' } })
        expect(instance.state.isValidDate).toEqual(false)
        instance.handleEventDateFieldKeyUp({ target: { value: '' } })
        expect(instance.state.isValidDate).toEqual(false)
        instance.handleEventDateFieldKeyUp({ target: {} })
        expect(instance.state.isValidDate).toEqual(false)
      })
    })

    describe('isEventDateBeforeDob', () => {
      const getWrapper = () => shallow(<AssessmentContainer {...defaultProps} />)

      it('should default isEventDateBeforeDob to false', () => {
        expect(getWrapper().instance().state.isEventDateBeforeDob).toEqual(false)
      })

      describe('#handleEventDateFieldKeyUp()', () => {
        it('should set isEventDateBeforeDob to true when date is before person.dob', () => {
          const instance = getWrapper().instance()
          instance.setState({ isValidDate: false, isEventDateBeforeDob: false }) // dob: 2014-01-28
          instance.handleEventDateFieldKeyUp({ target: { value: '10/09/2000' } })
          expect(instance.state.isEventDateBeforeDob).toEqual(true)
        })

        it('should set isEventDateBeforeDob to false when date is after person.dob', () => {
          const instance = getWrapper().instance()
          instance.setState({ isValidDate: false, isEventDateBeforeDob: false }) // dob: 2014-01-28
          instance.handleEventDateFieldKeyUp({ target: { value: '10/09/2018' } })
          expect(instance.state.isEventDateBeforeDob).toEqual(false)
        })
      })

      describe('<AssessmentFormHeader />', () => {
        it('should set isEventDateBeforeDob prop to true', () => {
          const wrapper = getWrapper()
          wrapper.instance().setState({ isValidDate: true, isEventDateBeforeDob: true })
          expect(wrapper.find('AssessmentContainerInner').prop('isEventDateBeforeDob')).toEqual(true)
        })

        it('should set isEventDateBeforeDob prop to false', () => {
          const wrapper = getWrapper()
          wrapper.instance().setState({ isValidDate: false })
          expect(wrapper.find('AssessmentContainerInner').prop('isEventDateBeforeDob')).toEqual(false)
          wrapper.instance().setState({ isValidDate: true, isEventDateBeforeDob: false })
          expect(wrapper.find('AssessmentContainerInner').prop('isEventDateBeforeDob')).toEqual(false)
        })
      })
    })

    describe('complete button', () => {
      it('should be disabled when assessment service is working', () => {
        const wrapper = mount(<AssessmentContainer {...defaultProps} />)

        // when
        wrapper.setState({
          isValidForSubmit: true,
          isEditable: true,
          assessmentServiceStatus: LoadingState.waiting,
          assessment,
        })

        // then
        expect(wrapper.find('AssessmentFormFooter').props().isSubmissionEnabled).toBeFalsy()
      })

      it('should be enabled when assessment service is done loading', () => {
        const wrapper = mount(<AssessmentContainer {...defaultProps} />)

        // when
        wrapper.setState({
          isValidForSubmit: true,
          assessmentServiceStatus: LoadingState.ready,
          isEditable: true,
          assessment,
        })

        // then
        expect(wrapper.find('AssessmentFormFooter').props().isSubmissionEnabled).toBeTruthy()
      })

      it('should not be rendered when assessment is not editable', () => {
        const wrapper = mount(<AssessmentContainer {...defaultProps} />)

        // when
        wrapper.setState({
          isValidForSubmit: false,
          assessmentServiceStatus: LoadingState.ready,
          isEditable: false,
          assessment,
        })

        // then
        expect(wrapper.find('CompleteAssessmentButton').exists()).toBeFalsy()
      })
    })
  })

  describe('#shouldDisplaySummaryOnSave()', () => {
    const getInstance = () => shallow(<AssessmentContainer {...defaultProps} />).instance()

    it('should return true when summary should be visible for in-progress assessment', () => {
      const instance = getInstance()
      instance.setState({
        isValidForSubmit: true,
        isEditable: true,
        assessment: {
          id: 1,
          status: 'IN_PROGRESS',
          event_date: '2010-10-13',
          metadata: {
            allowed_operations: ['update'],
          },
          state: {
            domains: [],
            under_six: false,
          },
        },
        assessmentServiceStatus: LoadingState.ready,
      })
      expect(instance.shouldDisplaySummaryOnSave()).toBeTruthy()
    })

    it('should return false when summary should be hidden for in-progress read-only assessment', () => {
      const instance = getInstance()
      instance.setState({
        isValidForSubmit: true,
        isEditable: true,
        assessment: {
          id: 1,
          status: 'IN_PROGRESS',
          event_date: '2010-10-13',
          metadata: {
            allowed_operations: ['read'],
          },
          state: {
            domains: [],
            under_six: false,
          },
        },
        assessmentServiceStatus: LoadingState.ready,
      })
      expect(instance.shouldDisplaySummaryOnSave()).toBeFalsy()
    })

    it('should return false when summary should be hidden for in-progress assessment without all fields filled', () => {
      const instance = getInstance()
      instance.setState({
        isValidForSubmit: false,
        isEditable: true,
        assessment: {
          id: 1,
          status: 'IN_PROGRESS',
          event_date: '2010-10-13',
          metadata: {
            allowed_operations: ['update'],
          },
          state: {
            domains: [],
            under_six: false,
          },
        },
        assessmentServiceStatus: LoadingState.ready,
      })
      expect(instance.shouldDisplaySummaryOnSave()).toBeFalsy()
    })

    it('should return false when summary should be hidden for assessment with status different from in-progress', () => {
      const instance = getInstance()
      instance.setState({
        isValidForSubmit: false,
        isEditable: true,
        assessment: {
          id: 1,
          status: 'DELETED',
          event_date: '2010-10-13',
          metadata: {
            allowed_operations: ['update'],
          },
          state: {
            domains: [],
            under_six: false,
          },
        },
        assessmentServiceStatus: LoadingState.ready,
      })
      expect(instance.shouldDisplaySummaryOnSave()).toBeFalsy()
    })
  })

  describe('#shouldSaveButtonBeEnabled()', () => {
    const getInstance = () => shallow(<AssessmentContainer {...defaultProps} />).instance()

    it('should return true when save button should be enabled', () => {
      const instance = getInstance()
      instance.setState({
        isValidDate: true,
        isEditable: true,
        assessment: {
          event_date: '2010-10-13',
          state: {
            domains: [],
            under_six: false,
          },
        },
        assessmentServiceStatus: LoadingState.ready,
      })
      expect(instance.shouldSaveButtonBeEnabled()).toBeTruthy()

      instance.setState({
        isValidDate: true,
        isEditable: true,
        assessment: {
          ...assessment,
          event_date: '2010-10-13',
          state: {
            domains: [],
            under_six: true,
          },
        },
        assessmentServiceStatus: LoadingState.idle,
      })
      expect(instance.shouldSaveButtonBeEnabled()).toBeTruthy()
    })

    describe('false response', () => {
      it('should return false when date is invalid', () => {
        const instance = getInstance()
        instance.setState({
          isValidDate: false,
          isEditable: true,
          assessment: {
            event_date: '2010-10-13',
            state: {
              domains: [],
              under_six: false,
            },
          },
          assessmentServiceStatus: LoadingState.ready,
        })
        expect(instance.shouldSaveButtonBeEnabled()).toBeFalsy()
      })

      it('should return false when is not editable by user', () => {
        const instance = getInstance()
        instance.setState({
          isValidDate: true,
          isEditable: false,
          assessment: {
            event_date: '2010-10-13',
            state: {
              domains: [],
              under_six: false,
            },
          },
          assessmentServiceStatus: LoadingState.ready,
        })
        expect(instance.shouldSaveButtonBeEnabled()).toBeFalsy()
      })

      it('should return false when is no event date', () => {
        const instance = getInstance()
        instance.setState({
          isValidDate: true,
          isEditable: true,
          assessment: {
            event_date: null,
            state: {
              domains: [],
              under_six: false,
            },
          },
          assessmentServiceStatus: LoadingState.ready,
        })
        expect(instance.shouldSaveButtonBeEnabled()).toBeFalsy()
      })

      it('should return false when under_six flag is undefined', () => {
        const instance = getInstance()
        instance.setState({
          isValidDate: true,
          isEditable: true,
          assessment: {
            event_date: '2010-10-13',
            state: {
              domains: [],
              under_six: undefined,
            },
          },
          assessmentServiceStatus: LoadingState.ready,
        })
        expect(instance.shouldSaveButtonBeEnabled()).toBeFalsy()
      })

      it('should return false when isEventDateBeforeDob is true', () => {
        const instance = getInstance()
        instance.setState({
          isValidDate: true,
          isEventDateBeforeDob: true,
          isEditable: true,
          assessment: {
            event_date: '2010-10-13',
            state: {
              domains: [],
              under_six: true,
            },
          },
          assessmentServiceStatus: LoadingState.ready,
        })
        expect(instance.shouldSaveButtonBeEnabled()).toBeFalsy()
      })
    })
  })

  describe('isEditable', () => {
    const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
    wrapper.instance().onFetchAssessmentSuccess(assessment)

    describe('when assessment status=COMPLETED', () => {
      const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
      wrapper.instance().setState({
        assessment: {
          id: 1,
          event_date: '2010-10-13',
          state: {
            domains: [],
            under_six: undefined,
          },
          person: {
            dob: '2019-01-01',
          },
          status: AHelper.AssessmentStatus.completed,
        },
        isEditable: false,
      })

      it('should post Info', async () => {
        const postInfoSpy = jest.spyOn(globalAlertService, 'postInfo')
        await wrapper.instance().postReadOnlyMessageIfNeeded()
        expect(postInfoSpy).toHaveBeenCalledWith({
          message: 'This assessment was completed and is available for view only.',
          isAutoCloseable: false,
          componentId: 'infoMessages',
          messageId: 'readonlyMessage',
        })
      })

      it('"isUnsaved" flag should be false when assessment state is updated', async () => {
        await wrapper.instance().updateAssessment(assessment)
        expect(wrapper.instance().state.isUnsaved).toBeFalsy()
      })
    })

    describe('when assessment status=IN_PROGRESS', () => {
      const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
      wrapper.instance().setState({
        assessment: {
          id: 1,
          event_date: '2010-10-13',
          state: {
            domains: [],
            under_six: undefined,
          },
          status: AHelper.AssessmentStatus.inProgress,
        },
        isEditable: false,
      })

      it('should display alert box', async () => {
        const postInfoSpy = jest.spyOn(globalAlertService, 'postInfo')
        await wrapper.instance().postReadOnlyMessageIfNeeded()
        expect(postInfoSpy).toHaveBeenCalledWith({
          message: 'This CANS is under the jurisdiction of another county. Available for view only.',
          isAutoCloseable: false,
          componentId: 'infoMessages',
          messageId: 'readonlyMessage',
        })
      })
    })
  })

  describe('reassessment', () => {
    it('renders a reassessment modal when new assessment is of SUBSEQUENT type', () => {
      const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
      expect(wrapper.find('ReassessmentModal').props().isOpen).toBeFalsy()
      wrapper.instance().onFetchNewAssessmentSuccess(subsequentAssessment)
      expect(wrapper.find('ReassessmentModal').props().isOpen).toBeTruthy()
    })

    it('starts an empty reassessment form', () => {
      const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
      wrapper.instance().onFetchNewAssessmentSuccess(subsequentAssessment)
      wrapper
        .find('ReassessmentModal')
        .props()
        .startEmpty()
      expect(wrapper.state().assessment.preceding_assessment_id).toBeNull()
      expect(wrapper.state().isReassessmentModalShown).toBeFalsy()
    })

    it('starts a reassessment form with preceding assessment data', async () => {
      // given
      const precedingAssessment = { ...assessment, status: 'COMPLETED' }
      jest.spyOn(AssessmentService, 'fetch').mockReturnValue(Promise.resolve({ ...precedingAssessment }))
      const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
      wrapper.instance().onFetchNewAssessmentSuccess(subsequentAssessment)

      // when
      await wrapper
        .find('ReassessmentModal')
        .props()
        .fillPrecedingData()

      // then
      expect(wrapper.state().isReassessmentModalShown).toBeFalsy()
      expect(wrapper.state().isShowReassessmentAlert).toBeTruthy()
      const expectedRatingsMap = ReassessmentHelper.createRatingsMap(precedingAssessment)
      const preparedReassessment = ReassessmentHelper.prepareReassessment(
        subsequentAssessment,
        precedingAssessment,
        expectedRatingsMap
      )
      expect(wrapper.state().assessment).toEqual(preparedReassessment)
      expect(wrapper.state().previousRatingsMap).toEqual(expectedRatingsMap)
    })

    describe('after assessment is fetched', () => {
      it('loads previous ratings', async () => {
        const precedingAssessment = { ...assessment }
        jest.spyOn(AssessmentService, 'fetch').mockReturnValue(Promise.resolve(precedingAssessment))
        jest.spyOn(I18nService, 'fetchByInstrumentId').mockReturnValue(Promise.resolve({}))
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        await wrapper.instance().onFetchAssessmentSuccess({ ...assessment, preceding_assessment_id: 12345 })
        const expectedPreviousRatingsMap = ReassessmentHelper.createRatingsMap(precedingAssessment)
        expect(wrapper.state().previousRatingsMap).toEqual(expectedPreviousRatingsMap)
      })

      it('does not load previous ratings when no preceding assessment', async () => {
        jest.spyOn(I18nService, 'fetchByInstrumentId').mockReturnValue(Promise.resolve({}))
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        await wrapper.instance().onFetchAssessmentSuccess(assessment)
        expect(wrapper.state().previousRatingsMap).toEqual({})
      })

      it('does not load previous ratings when assessment is completed', async () => {
        jest.spyOn(I18nService, 'fetchByInstrumentId').mockReturnValue(Promise.resolve({}))
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        await wrapper.instance().onFetchAssessmentSuccess({
          ...assessment,
          preceding_assessment_id: 12345,
          status: AssessmentStatus.completed,
        })
        expect(wrapper.state().previousRatingsMap).toEqual({})
      })
    })
  })

  describe('page title', () => {
    let updateHeaderTitleMock
    let props

    beforeEach(() => {
      updateHeaderTitleMock = jest.fn()
      props = {
        ...defaultProps,
        pageHeaderController: {
          updateHeaderButtons: () => {},
          updateHeaderButtonsToDefault: () => {},
          updateHeaderTitle: updateHeaderTitleMock,
        },
      }
    })

    describe('with assessment (not reassessment) form', () => {
      it('updates page title when assessment fetched', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().onFetchNewAssessmentSuccess(assessment)
        expect(updateHeaderTitleMock).toHaveBeenCalledWith('CANS Assessment Form')
      })

      it('updates page title when loading existent assessment', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().onFetchAssessmentSuccess(assessment)
        expect(updateHeaderTitleMock).toHaveBeenCalledWith('CANS Assessment Form')
      })
    })

    describe('with reassessment form', () => {
      it('updates page title when new reassessment', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().onFetchNewAssessmentSuccess(subsequentAssessment)
        expect(updateHeaderTitleMock).toHaveBeenCalledWith('CANS Reassessment Form')
      })

      it('updates page title when loading existent reassessment', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().onFetchAssessmentSuccess(subsequentAssessment)
        expect(updateHeaderTitleMock).toHaveBeenCalledWith('CANS Reassessment Form')
      })
    })
  })

  describe('Reassessment CloseableAlert', () => {
    describe('render', () => {
      const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
      wrapper.instance().setState({ isShowReassessmentAlert: true })
      it('renders Reassessment CloseableAlert when choosed to Use previous ratings', () => {
        expect(wrapper.find('CloseableAlert').exists()).toBe(true)
        expect(wrapper.find('CloseableAlert').props().type).toBe('info')
        expect(wrapper.find('CloseableAlert').props().isOpen).toBe(true)
      })

      it('shows reassessment alert message when choosed to Use previous ratings', () => {
        expect(wrapper.find('CloseableAlert').props().message).toBe(
          'If this child has turned 6 years old since the last assessment, only the common domain items for both age groups will carry over.'
        )
      })
    })
  })
})
