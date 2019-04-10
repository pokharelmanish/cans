import React from 'react'
import { shallow } from 'enzyme'
import PrintChangeLog from './PrintChangeLog'

describe('<PrintChangeLog />', () => {
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
        event_date: '2018-11-01',
        user_id: 'RACFID',
        entity_id: 1,
        changed_at: '2018-11-01T17:07:10.043Z',
        change_type: 'ADD',
        changes: [],
        assessment_change_type: 'CREATED',
      },
    ],
  }

  describe('print layout', () => {
    let wrapper

    it('renders null if there is no change history', () => {
      const props = {
        history: [],
        ...defaultProps,
      }
      wrapper = shallow(<PrintChangeLog {...props} />)
      expect(wrapper.type()).toBe(null)
    })

    beforeEach(() => {
      const props = {
        ...defaultHistory,
        ...defaultProps,
      }
      wrapper = shallow(<PrintChangeLog {...props} />)
    })

    it('renders a change log table wrapper', () => {
      expect(wrapper.find('.print-change-log-table-wrapper').exists()).toBe(true)
    })

    it('renders a print header', () => {
      expect(wrapper.find('.print-header').exists()).toBe(true)
    })

    it('renders a print title', () => {
      expect(wrapper.find('h2.print-title').exists()).toBe(true)
    })

    it('renders a full name header', () => {
      expect(wrapper.find('h3.print-client-name').exists()).toBe(true)
    })

    it('renders an assessment id header', () => {
      expect(wrapper.find('th.print-assessment-id').exists()).toBe(true)
    })

    it('renders an assessment date', () => {
      expect(wrapper.find('th.print-assessment-date').exists()).toBe(true)
    })
  })

  describe('print info', () => {
    let wrapper

    beforeEach(() => {
      const props = {
        ...defaultHistory,
        ...defaultProps,
      }
      wrapper = shallow(<PrintChangeLog {...props} />)
    })

    it('renders the full name of the client', () => {
      expect(wrapper.find('h3.print-client-name').text()).toBe('Client: Doe, Annie B')
    })

    it('renders the assessment id', () => {
      expect(wrapper.find('th.print-assessment-id').text()).toBe('Assessment ID: 1')
    })

    it('renders the assessment date', () => {
      expect(wrapper.find('th.print-assessment-date').text()).toBe('Assessment Date: 11/01/2018')
    })
  })
})
