import React from 'react'
import { shallow } from 'enzyme'
import PrintChangeLogTable from './PrintChangeLogTable'
import ChangeLogDate from './ChangeLogDate'
import ChangeLogStatus from './ChangeLogStatus'
import ChangeLogComment from './ChangeLogComment'
import ChangeLogName from './ChangeLogName'

describe('<PrintChangeLogTable />', () => {
  const defaultProps = {
    assessmentId: 1,
    client: {
      first_name: 'Annie',
      middle_name: 'B',
      last_name: 'Doe',
      suffix: '',
    },
  }

  const defaultHistory = {
    history: [
      {
        id: 1,
        user_id: 'RACFID',
        entity_id: 1,
        changed_at: '2018-11-01T17:07:10.043Z',
        change_type: 'ADD',
        changes: [],
        assessment_change_type: 'CREATED',
        deletion_reason: 'Referral / Case closed',
      },
    ],
  }

  describe('print layout', () => {
    let wrapper

    beforeEach(() => {
      const props = {
        ...defaultHistory,
        ...defaultProps,
      }
      wrapper = shallow(<PrintChangeLogTable {...props} />)
    })

    it('renders the change log table', () => {
      expect(wrapper.find('table.print-change-log-table').exists()).toBe(true)
    })

    it('renders the change log table header row', () => {
      expect(wrapper.find('tr.print-change-table-header').exists()).toBe(true)
    })

    it('renders the change log table headers ', () => {
      expect(wrapper.find('tr.print-change-table-header').find('th').length).toEqual(4)
    })

    it('renders the change log row', () => {
      expect(wrapper.find('tr.print-change-log-row').length).toEqual(1)
    })

    it('renders the change log row data cells', () => {
      expect(wrapper.find('tr.print-change-log-row').find('td').length).toEqual(4)
    })
  })

  describe('print info', () => {
    let wrapper

    beforeEach(() => {
      const props = {
        ...defaultHistory,
        ...defaultProps,
      }
      wrapper = shallow(<PrintChangeLogTable {...props} />)
    })

    it('renders a formatted date', () => {
      expect(
        wrapper
          .find('tr.print-change-log-row')
          .find('td')
          .at(0)
          .find(ChangeLogDate)
          .dive()
          .find('div')
          .text()
      ).toBe('11/01/2018 05:07:10 PM')
    })

    it('renders the change type', () => {
      expect(
        wrapper
          .find('tr.print-change-log-row')
          .find('td')
          .at(2)
          .find(ChangeLogStatus)
          .dive()
          .find('div')
          .text()
      ).toBe('Saved')
    })

    it('renders the comment', () => {
      expect(
        wrapper
          .find('tr.print-change-log-row')
          .find('td')
          .at(3)
          .find(ChangeLogComment)
          .dive()
          .find('div')
          .text()
      ).toBe('Referral / Case closed')
    })

    describe('name column', () => {
      it('renders a user id if no first and last name', () => {
        expect(
          wrapper
            .find('tr.print-change-log-row')
            .find('td')
            .at(1)
            .find(ChangeLogName)
            .dive()
            .find('div')
            .text()
        ).toBe('RACFID')
      })

      it('renders the last and first name', () => {
        const props = {
          history: [
            {
              user_id: 'RACFID',
              user_first_name: 'Casey',
              user_last_name: 'Test',
            },
          ],
          ...defaultProps,
        }
        const wrapper = shallow(<PrintChangeLogTable {...props} />)
        expect(
          wrapper
            .find('tr.print-change-log-row')
            .find('td')
            .at(1)
            .find(ChangeLogName)
            .dive()
            .find('div')
            .text()
        ).toBe('Test, Casey')
      })
    })
  })
})
