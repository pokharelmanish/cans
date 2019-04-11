import React from 'react'
import { shallow } from 'enzyme'
import ReassessmentsNeededCell from './ReassessmentsNeededCell'
import { ISO_DATE_FORMAT } from '../../util/constants'
import moment from 'moment'
import ReassessmentsNeededCellBadge from './ReassessmentsNeededCellBadge'

describe('<ReassessmentsNeededCell />', () => {
  it('renders 2 ReassessmentsNeededCellBadge elements', () => {
    const farFutureDate = moment()
      .add(31, 'days')
      .format(ISO_DATE_FORMAT)
    const notBadgedDates = [farFutureDate]
    const tomorrow = moment()
      .add(1, 'days')
      .format(ISO_DATE_FORMAT)
    const warningDates = [tomorrow]
    const yesterday = moment()
      .subtract(1, 'days')
      .format(ISO_DATE_FORMAT)
    const pastDueDates = [yesterday, '2018-01-01']
    const wrapper = shallow(<ReassessmentsNeededCell value={[...notBadgedDates, ...warningDates, ...pastDueDates]} />)
    const badges = wrapper.find(ReassessmentsNeededCellBadge)
    expect(badges.at(0).props()).toEqual({ color: 'warning', number: 1 })
    expect(badges.at(1).props()).toEqual({ color: 'danger', number: 2 })
  })
})
