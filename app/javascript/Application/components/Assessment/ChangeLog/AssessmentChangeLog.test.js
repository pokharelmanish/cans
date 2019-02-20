import React from 'react'
import { shallow } from 'enzyme'
import { Card, CardHeader, CardTitle, CardBody } from '@cwds/components'
import AssessmentChangeLog from './AssessmentChangeLog'
import SessionDataGrid from '../../common/SessionDataGrid'
import { ASSESSMENT_CHANGELOG_PAGE_SIZE_KEY } from '../../../util/sessionStorageUtil'

describe('<AssessmentChangeLog />', () => {
  const defaultProps = {
    client: {
      first_name: 'See',
      middle_name: 'K',
      last_name: 'Abbott',
      suffix: '',
      identifier: 'AdE0PWu0X5',
      external_id: '0603-9385-0313-2002051',
      dob: '2005-08-14',
    },
  }

  const defaultAssessmentHistory = [
    {
      changed_at: '2018-11-01T17:07:10.043Z',
      user_id: 'RACFID',
      assessment_change_type: 'COMPLETED',
      entity_id: 1,
      event_date: '2018-01-05',
    },
  ]

  const getWrapper = (
    assessmentHistory = defaultAssessmentHistory,
    updateHeaderButtons = () => {},
    updateHeaderButtonsToDefault = () => {}
  ) => {
    const props = {
      assessmentHistory,
      pageHeaderButtonsController: {
        updateHeaderButtons,
        updateHeaderButtonsToDefault,
      },
      ...defaultProps,
    }
    return shallow(<AssessmentChangeLog {...props} />)
  }

  describe('page layout', () => {
    it('renders nothing when there is no change history', () => {
      const changeHistory = []
      const wrapper = getWrapper(changeHistory)
      expect(wrapper.type()).toBe(null)
    })

    let wrapper

    beforeEach(() => {
      wrapper = getWrapper()
    })

    it('renders a card when there is change log data', () => {
      expect(wrapper.find(Card).exists()).toBe(true)
    })

    it('renders a card header when there is change log data', () => {
      expect(wrapper.find(CardHeader).exists()).toBe(true)
    })

    it('renders a card body there is change log data', () => {
      expect(wrapper.find(CardBody).exists()).toBe(true)
    })

    it('renders a card title there is change log data', () => {
      expect(wrapper.find(CardTitle).exists()).toBe(true)
    })

    it('renders a data grid when there is change log data', () => {
      const sessionDataGrid = wrapper.find(SessionDataGrid)
      expect(sessionDataGrid.exists()).toBe(true)
      expect(sessionDataGrid.props().pageSizeSessionKey).toBe(ASSESSMENT_CHANGELOG_PAGE_SIZE_KEY)
    })
  })

  describe('page info', () => {
    let wrapper

    beforeEach(() => {
      wrapper = getWrapper()
    })

    it('renders the card title with client name and assessment date', () => {
      expect(
        wrapper
          .find(CardTitle)
          .dive()
          .html()
      ).toBe(
        '<div class="card-title"><div class="change-log-title"><span>CANS Change Log: Abbott, See K</span><span>Assessment Date: 01/05/2018</span></div></div>'
      )
    })

    it('passes change history data to SessionDataGrid', () => {
      expect(wrapper.find(SessionDataGrid).props().data).toEqual(defaultAssessmentHistory)
    })
  })

  describe('page header buttons', () => {
    let wrapper
    const updateHeaderButtonsMock = jest.fn()

    describe('componentDidMount', () => {
      it('should update page header buttons', () => {
        getWrapper(defaultAssessmentHistory, updateHeaderButtonsMock)
        expect(updateHeaderButtonsMock).toHaveBeenCalledTimes(1)
        updateHeaderButtonsMock.mockClear()
      })
    })

    describe('componentDidUpdate', () => {
      describe('changeHistory prop was updated', () => {
        it('should update page header buttons', () => {
          wrapper = getWrapper([], updateHeaderButtonsMock)
          expect(updateHeaderButtonsMock).toHaveBeenCalledTimes(1)
          wrapper.setProps({
            assessmentHistory: defaultAssessmentHistory,
          })
          expect(updateHeaderButtonsMock).toHaveBeenCalledTimes(2)
          updateHeaderButtonsMock.mockClear()
        })
      })

      describe('changeHistory prop was not updated', () => {
        it('should not update page header buttons', () => {
          const wrapper = getWrapper(defaultAssessmentHistory, updateHeaderButtonsMock)
          expect(updateHeaderButtonsMock).toHaveBeenCalledTimes(1)
          wrapper.setProps({
            assessmentWithHistory: defaultAssessmentHistory,
          })
          expect(updateHeaderButtonsMock).toHaveBeenCalledTimes(1)
          updateHeaderButtonsMock.mockClear()
        })
      })
    })

    describe('componentWillUnmount', () => {
      it('should reset page header buttons to default values', () => {
        const updateToDefaultMock = jest.fn()
        const wrapper = getWrapper(defaultAssessmentHistory, () => {}, updateToDefaultMock)
        wrapper.unmount()
        expect(updateToDefaultMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('print button status', () => {
      describe('change log data exists', () => {
        it('print button should be enabled', () => {
          const wrapper = getWrapper()
          const spy = jest.spyOn(wrapper.instance(), 'initHeaderButtons')
          wrapper.instance().componentDidMount()
          expect(spy).toHaveBeenCalledWith(true)
        })
      })

      describe('change log data does not exist', () => {
        it('print button should be disabled', () => {
          const changeHistory = []
          const wrapper = getWrapper(changeHistory)
          const spy = jest.spyOn(wrapper.instance(), 'initHeaderButtons')
          wrapper.instance().componentDidMount()
          expect(spy).toHaveBeenCalledWith(false)
        })
      })
    })
  })
})
