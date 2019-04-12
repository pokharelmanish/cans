import { ReminderDateCell } from './ReminderDateCell'
import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'

describe('ReminderDateCell', () => {
  it('renders nothing if there is no reminder date', () => {
    const pill = shallow(<ReminderDateCell />)
    expect(pill.getElement()).toBe(null)
  })

  it('renders a warning pill when the reminder date is within one 30 days before the due date', () => {
    const future = moment({ hours: 0 }).add(29, 'days')
    const days = future.diff(moment({ hours: 0 }), 'days')
    const original = {
      reminder_date: future.toISOString(),
    }
    const pill = shallow(<ReminderDateCell original={original} />)
    const badge = pill.find('Badge')
    expect(badge.props().color).toBe('warning')
    expect(badge.shallow().text()).toBe(`Due in ${days} days`)
  })

  it('renders a past due danger pill when the reminder date is before now', () => {
    const past = moment({ hours: 0 }).subtract(1, 'days')
    const original = {
      reminder_date: past.toISOString(),
    }
    const pill = shallow(<ReminderDateCell original={original} />)
    const badge = pill.find('Badge')
    expect(badge.props().color).toBe('danger')
    expect(badge.shallow().text()).toBe('Past Due')
  })

  it('renders the date when there is a reminder date', () => {
    const past = moment({ hours: 0 }).add(2, 'months')
    const formattedPast = past.format('YYYY-MM-DD')
    const original = {
      reminder_date: formattedPast,
    }
    const pill = shallow(<ReminderDateCell original={original} />)
    const date = pill.find('span')
    expect(date.text()).toContain(past.format('MM/DD/YYYY'))
  })

  it('does not render the pill when there is a reminder date more than 30 days away', () => {
    const past = moment({ hours: 0 }).add(31, 'days')
    const formattedPast = past.format('YYYY-MM-DD')
    const original = {
      reminder_date: formattedPast,
    }
    const pill = shallow(<ReminderDateCell original={original} />)
    expect(pill.exists('Badge')).toBe(false)
  })

  it('displays "Due in 1 day" if there is one day before the due date', () => {
    const past = moment({ hours: 0 }).add(1, 'days')
    const formattedPast = past.format('YYYY-MM-DD')
    const original = {
      reminder_date: formattedPast,
    }
    const pill = shallow(<ReminderDateCell original={original} />)
    const badge = pill.find('Badge')
    expect(badge.props().color).toBe('warning')
    expect(badge.shallow().text()).toBe('Due in 1 day')
  })

  it('displays "Due today" if the reassessment is due today', () => {
    const past = moment({ hours: 0 })
    const formattedPast = past.format('YYYY-MM-DD')
    const original = {
      reminder_date: formattedPast,
    }
    const pill = shallow(<ReminderDateCell original={original} />)
    const badge = pill.find('Badge')
    expect(badge.props().color).toBe('warning')
    expect(badge.shallow().text()).toBe('Due Today')
  })
})
