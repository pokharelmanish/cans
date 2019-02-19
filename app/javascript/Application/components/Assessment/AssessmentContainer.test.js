import React from 'react';
import { AssessmentContainer, AssessmentFormHeader, AssessmentService, SecurityService } from './index';
import { childInfoJson } from '../Client/Client.helper.test';
import ClientService from '../Client/Client.service';
import { shallow, mount } from 'enzyme';
import { PageInfo } from '../Layout';
import Typography from '@material-ui/core/Typography/Typography';
import AssessmentFormFooter from './AssessmentFormFooter';
import { MemoryRouter, Link } from 'react-router-dom';
import { assessment, updatedAssessment, initialAssessment, instrument } from './assessment.mocks.test';
import { LoadingState } from '../../util/loadingHelper';
import { CloseableAlert } from '../common/CloseableAlert';
import { getCurrentIsoDate } from '../../util/dateHelper';
import { Print } from '../Print';

jest.useFakeTimers();

const defaultProps = {
  location: { childId: 1 },
  match: { params: { id: 1 } },
  isNewForm: false,
  client: childInfoJson,
};

const mountWithRouter = async component => mount(<MemoryRouter initialEntries={['/random']}>{component}</MemoryRouter>);

describe('<AssessmentContainer />', () => {
  describe('init AssessmentContainer', () => {
    describe('page layout', () => {
      const props = {
        location: { childId: 10 },
        match: { params: { id: 1 } },
      };

      beforeEach(() => {
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson));
        jest.spyOn(SecurityService, 'checkPermission').mockReturnValue(Promise.resolve(true));
        jest.spyOn(AssessmentService, 'fetch').mockReturnValue(Promise.resolve(assessment));
      });

      const getLength = (wrapper, component) => wrapper.find(component).length;

      it('renders with 1 <PageInfo /> component', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />);
        expect(getLength(wrapper, PageInfo)).toBe(1);
      });

      it('renders with 1 <AssessmentFormHeader /> component', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />);
        expect(getLength(wrapper, AssessmentFormHeader)).toBe(1);
      });

      it('renders with 1 <Typography /> component', async () => {
        const wrapper = shallow(<AssessmentContainer {...props} />);
        await wrapper.instance().componentDidMount();
        expect(getLength(wrapper, Typography)).toBe(1);
      });

      it('renders with 1 <AssessmentFormFooter /> component', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />);
        expect(getLength(wrapper, AssessmentFormFooter)).toBe(1);
      });
    });

    describe('page title', () => {
      it('should be "New CANS" for new assessment', () => {
        const wrapper = shallow(<AssessmentContainer isNewForm={true} />);
        const pageInfoText = wrapper
          .find('PageInfo')
          .render()
          .text();
        expect(pageInfoText).toMatch(/New CANS/);
        expect(pageInfoText).toMatch(/Print/);
      });

      it('should be "CANS Assessment Form" for the existent assessment', () => {
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />);
        const pageInfoText = wrapper
          .find('PageInfo')
          .render()
          .text();
        expect(pageInfoText).toMatch(/CANS Assessment Form/);
        expect(pageInfoText).toMatch(/Print/);
      });
    });

    describe('print assessment', () => {
      it('should render <Print /> on print button click', () => {
        // given
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />);
        expect(wrapper.find(Print).length).toBe(0);

        // when
        wrapper
          .find('PageInfo')
          .dive()
          .find('.print-link')
          .simulate('click');
        wrapper.update();

        // then
        expect(wrapper.find(Print).length).toBe(1);
      });
    });

    describe('warning message on absence of edit permission', () => {
      it('should render warning message', async () => {
        const props = {
          location: { childId: 1 },
          match: { params: { id: 1 } },
        };
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson));
        jest.spyOn(SecurityService, 'checkPermission').mockReturnValue(Promise.resolve(false));
        jest.spyOn(AssessmentService, 'fetch').mockReturnValue(Promise.resolve(assessment));
        const wrapper = await shallow(<AssessmentContainer {...props} />);
        await wrapper.instance().componentDidMount();
        expect(wrapper.find(CloseableAlert).length).toBe(1);
        const warning = wrapper.find(CloseableAlert).first();
        expect(warning.props().message).toBe(
          'This assessment was initiated in a county that is different than the User’s ' +
            'County. Saving and Submitting are disabled'
        );
        expect(wrapper.find(Typography).length).toBe(0);
      });

      it('should not render warning message', async () => {
        const props = {
          location: { childId: 10 },
        };
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson));
        jest.spyOn(SecurityService, 'checkPermission').mockReturnValue(Promise.resolve(true));
        jest.spyOn(AssessmentService, 'fetchNewAssessment').mockReturnValue(Promise.resolve(assessment));
        const wrapper = await shallow(<AssessmentContainer {...props} />);
        await wrapper.instance().componentDidMount();
        expect(wrapper.find(CloseableAlert).length).toBe(0);
      });

      it('should not render warning message when assessment is new', async () => {
        const props = {
          location: { childId: 10 },
        };
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson));
        jest.spyOn(AssessmentService, 'fetchNewAssessment').mockReturnValue(Promise.resolve(assessment));
        const wrapper = await shallow(<AssessmentContainer {...props} />);
        await wrapper.instance().componentDidMount();
        expect(wrapper.find(CloseableAlert).length).toBe(0);
      });
    });

    describe('assessment form with no existing assessment', () => {
      const props = {
        client: childInfoJson,
      };

      it('calls fetchNewAssessment', async () => {
        const assessmentServiceGetSpy = jest.spyOn(AssessmentService, 'fetchNewAssessment');
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson));
        jest.spyOn(SecurityService, 'checkPermission').mockReturnValue(Promise.resolve(true));
        const wrapper = shallow(<AssessmentContainer {...props} />);
        await wrapper.instance().componentDidMount();
        expect(assessmentServiceGetSpy).toHaveBeenCalledWith();
      });

      it('sets a new assessment on component state', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />);
        expect(wrapper.state('assessment').instrument_id).toBeFalsy();
        wrapper.instance().onFetchNewAssessmentSuccess(instrument);
        const assessment = wrapper.state('assessment');
        expect(assessment).toEqual(initialAssessment);
        expect(assessment.person).toEqual(childInfoJson);
        expect(assessment.county).toEqual(childInfoJson.county);
      });
    });

    describe('assessment form with an existing assessment', () => {
      it('calls fetchAssessment', async () => {
        const props = {
          location: { childId: 1 },
        };
        const assessmentServiceGetSpy = jest.spyOn(AssessmentService, 'fetchNewAssessment');
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson));
        jest.spyOn(SecurityService, 'checkPermission').mockReturnValue(Promise.resolve(true));
        const wrapper = shallow(<AssessmentContainer {...props} />);
        await wrapper.instance().componentDidMount();
        expect(assessmentServiceGetSpy).toHaveBeenCalledWith();
      });
    });
  });

  describe('save assessment', () => {
    describe('with a new assessment', () => {
      it('should call AssessmentService.postAssessment', () => {
        const assessmentServicePostSpy = jest.spyOn(AssessmentService, 'postAssessment');
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />);
        const assessment = {
          event_date: getCurrentIsoDate(),
          has_caregiver: true,
          person: childInfoJson,
          state: { domains: [] },
        };
        wrapper.instance().handleSaveAssessment();
        assessmentServicePostSpy.mockReturnValue(Promise.resolve(assessment));
        expect(assessmentServicePostSpy).toHaveBeenCalledWith(assessment);
      });

      it('should render save success message on initial save', async () => {
        // given
        jest.spyOn(AssessmentService, 'postAssessment').mockReturnValue(Promise.resolve(assessment));
        const wrapper = await shallow(<AssessmentContainer {...{ client: childInfoJson }} />);

        // when
        await wrapper.instance().handleSaveAssessment();
        wrapper.update();

        // then
        expect(wrapper.find(CloseableAlert).length).toBe(1);
      });
    });

    describe('with an existing assessment', () => {
      it('should call AssessmentService.update', () => {
        const assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update');
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />);
        assessmentServicePutSpy.mockReturnValue(Promise.resolve(assessment));
        wrapper.setState({ assessment: { id: 1 } });
        wrapper.instance().handleSaveAssessment();
        expect(assessmentServicePutSpy).toHaveBeenCalledWith(1, { id: 1, person: childInfoJson });
      });

      it('should update state with assessment', async () => {
        const assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update');
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />);
        assessmentServicePutSpy.mockReturnValue(Promise.resolve(assessment));
        wrapper.setState({ assessment: { id: 1 } });
        await wrapper.instance().handleSaveAssessment();
        expect(assessmentServicePutSpy).toHaveBeenCalledWith(1, { id: 1, person: childInfoJson });
        expect(wrapper.state('assessment').id).toBe(1);
        expect(wrapper.state('assessment').state.domains).toBeTruthy();
      });

      it('should render save success message on save', async () => {
        // given
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson));
        jest.spyOn(AssessmentService, 'update').mockReturnValue(Promise.resolve(assessment));
        jest.spyOn(SecurityService, 'checkPermission').mockReturnValue(Promise.resolve(true));
        jest.spyOn(AssessmentService, 'fetchNewAssessment').mockReturnValue(Promise.resolve(assessment));
        const wrapper = await shallow(<AssessmentContainer {...{ client: childInfoJson }} />);
        wrapper.setState({ assessment: { id: 1 } });

        // when
        await wrapper.instance().handleSaveAssessment();
        wrapper.update();

        // then
        const alertWrapper = wrapper.find(CloseableAlert);
        expect(alertWrapper.length).toBe(1);
        const linkWrapper = alertWrapper
          .first()
          .dive()
          .find(Link)
          .first();
        expect(linkWrapper.props().to).toBe('/clients/10');

        // when 2 (the message is auto closed)
        jest.runAllTimers();
        wrapper.update();

        // then 2
        expect(wrapper.find(CloseableAlert).length).toBe(0);
      });
    });
  });

  describe('submit assessment', () => {
    describe('when a new assessment', () => {
      it('should call AssessmentService.postAssessment', () => {
        const assessmentServicePostSpy = jest.spyOn(AssessmentService, 'postAssessment');
        const props = {
          match: { params: { id: 1 } },
          client: childInfoJson,
        };

        const wrapper = shallow(<AssessmentContainer {...props} />);
        wrapper.instance().handleSubmitAssessment();

        assessmentServicePostSpy.mockReturnValue(Promise.resolve(assessment));
        const expectedArgument = {
          event_date: getCurrentIsoDate(),
          has_caregiver: true,
          person: childInfoJson,
          state: { domains: [] },
          status: 'SUBMITTED',
        };
        expect(assessmentServicePostSpy).toHaveBeenCalledWith(expectedArgument);
      });
    });

    describe('when an existing assessment', () => {
      it('should call AssessmentService.update', () => {
        const assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update');
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />);
        assessmentServicePutSpy.mockReturnValue(Promise.resolve(assessment));
        wrapper.setState({ assessment: { id: 1 } });
        wrapper.instance().handleSubmitAssessment();
        expect(assessmentServicePutSpy).toHaveBeenCalledWith(1, { id: 1, person: childInfoJson, status: 'SUBMITTED' });
      });
    });
  });

  describe('update assessment', () => {
    describe('is passed updated data', () => {
      it('will update the assessment on the component state', () => {
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />);
        wrapper.setState({ assessment: assessment });
        expect(wrapper.state('assessment')).toEqual(assessment);
        wrapper.instance().updateAssessment(updatedAssessment);
        expect(wrapper.state('assessment')).toEqual(updatedAssessment);
      });

      it('validates assessment for submit', () => {
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />);
        wrapper.setState({ assessment: updatedAssessment });
        expect(wrapper.state('isValidForSubmit')).toEqual(false);
        wrapper.instance().updateAssessment(assessment);
        expect(wrapper.state('isValidForSubmit')).toEqual(true);
      });
    });
  });

  describe('initial save', () => {
    it('will update the assessment on the component state', () => {
      const props = {
        location: { childId: 1 },
        match: { params: { id: 1 } },
        history: { push: jest.fn() },
        client: childInfoJson,
      };
      const wrapper = shallow(<AssessmentContainer {...props} />);

      wrapper.setState({ assessment: assessment });
      expect(wrapper.state('assessment')).toEqual(assessment);
      wrapper.instance().initialSave(updatedAssessment);
      expect(wrapper.state('assessment')).toEqual(updatedAssessment);
    });

    it('will update the url with the assessment id', () => {
      const historyPushMock = { push: jest.fn() };
      const wrapper = shallow(<AssessmentContainer {...defaultProps} history={historyPushMock} />);

      wrapper.setState({ child: childInfoJson });
      wrapper.instance().initialSave(updatedAssessment);

      expect(historyPushMock.push).toHaveBeenCalledWith('/clients/10/assessments/1');
    });
  });

  describe('buttons', () => {
    describe('Cancel button', () => {
      it('redirects to client page', async () => {
        const wrapper = await mountWithRouter(
          <AssessmentContainer match={{ params: { id: 1 } }} client={childInfoJson} />
        );
        expect(wrapper.find('Redirect').length).toBe(0);
        await wrapper
          .find('AssessmentContainer')
          .instance()
          .handleCancelClick();
        const redirect = wrapper.update().find('Redirect');
        expect(redirect.length).toBe(1);
        expect(redirect.first().props().to.state.successAssessmentId).toBe(undefined);
      });
    });

    describe('Submit button', () => {
      it('is disabled/enabled based on the assessment validity', async () => {
        const wrapper = await mountWithRouter(
          <AssessmentContainer match={{ params: { childId: 123 } }} client={childInfoJson} />
        );
        await wrapper
          .find('AssessmentContainer')
          .instance()
          .setState({
            isValidForSubmit: false,
            assessmentServiceStatus: LoadingState.ready,
            isEditable: true,
          });
        await wrapper.update();
        expect(
          wrapper
            .find('button#submit-assessment')
            .first()
            .props().disabled
        ).toBe(true);
        await wrapper
          .find('AssessmentContainer')
          .instance()
          .setState({
            isValidForSubmit: true,
            assessmentServiceStatus: LoadingState.ready,
            isEditable: true,
          });
        await wrapper.update();
        expect(
          wrapper
            .find('button#submit-assessment')
            .first()
            .props().disabled
        ).toBe(false);
      });

      it('redirects to client page on Submit button clicked', async () => {
        // given
        const assessmentServicePostSpy = jest.spyOn(AssessmentService, 'postAssessment');
        assessmentServicePostSpy.mockReturnValue(Promise.resolve({ id: 123 }));
        const historyMock = {
          push: () => {
            historyMock.length += 1;
          },
          length: 0,
        };
        const wrapper = await mountWithRouter(
          <AssessmentContainer match={{ params: { id: 1 } }} client={childInfoJson} history={historyMock} />
        );
        expect(wrapper.find('Redirect').length).toBe(0);

        // when
        const instance = wrapper.find('AssessmentContainer').instance();
        await instance.handleSubmitAssessment();

        // then
        await wrapper.update();
        const redirect = wrapper.find('Redirect');
        expect(redirect.length).toBe(1);
        expect(redirect.first().props().to.state.successAssessmentId).toBe(123);
        expect(historyMock.length).toBe(1);
      });
    });

    describe('submit and save buttons', () => {
      it('should disable buttons when assessment service is working', async () => {
        const wrapper = await mountWithRouter(<AssessmentContainer client={childInfoJson} />);

        // when
        wrapper
          .find('AssessmentContainer')
          .instance()
          .setState({
            isValidForSubmit: true,
            assessmentServiceStatus: LoadingState.waiting,
          });

        // then
        expect(wrapper.find('Button#save-assessment').instance().props.disabled).toBeTruthy();
        expect(wrapper.find('Button#submit-assessment').instance().props.disabled).toBeTruthy();
      });

      it('should enable buttons when assessment service is not working', async () => {
        const wrapper = await mountWithRouter(<AssessmentContainer client={childInfoJson} />);

        // when
        wrapper
          .find('AssessmentContainer')
          .instance()
          .setState({
            isValidForSubmit: true,
            assessmentServiceStatus: LoadingState.ready,
            isEditable: true,
          });

        // then
        expect(wrapper.find('Button#save-assessment').instance().props.disabled).toBeFalsy();
        expect(wrapper.find('Button#submit-assessment').instance().props.disabled).toBeFalsy();
      });

      it('should disable buttons when assessment is not editable', async () => {
        const wrapper = await mountWithRouter(<AssessmentContainer client={childInfoJson} />);

        // when
        wrapper
          .find('AssessmentContainer')
          .instance()
          .setState({
            isValidForSubmit: true,
            assessmentServiceStatus: LoadingState.ready,
            isEditable: false,
          });

        // then
        expect(wrapper.find('Button#save-assessment').instance().props.disabled).toBeTruthy();
        expect(wrapper.find('Button#submit-assessment').instance().props.disabled).toBeTruthy();
      });
    });
  });
});
