import React from 'react'
import { shallow } from 'enzyme'
import { Card, CardHeader, CardBody, CardTitle } from '@cwds/components'
import StaffTable from '../StaffTable'
import SubordinateCard from './SubordinateCard'
import { LoadingState } from '../../../util/loadingHelper'
import { staff as mockStaff } from '../staff.mocks.test'

describe('<SubordinateCard />', () => {
  describe('when loading', () => {
    const render = () => shallow(<SubordinateCard loadingState={LoadingState.updating} />)

    it('renders a loading card', () => {
      const card = render().find(Card)
      expect(card.exists()).toBe(true)
      expect(card.props().loading).toBe('true')
    })
  })

  describe('when loaded', () => {
    const render = () => shallow(<SubordinateCard loadingState={LoadingState.ready} staff={mockStaff} />)

    it('renders a card', () => {
      const card = render().find(Card)
      expect(card.exists()).toBe(true)
      expect(card.props().loading).toBeUndefined()
    })

    it('has a card title', () => {
      const wrapper = render()
      expect(
        wrapper
          .find(CardHeader)
          .find(CardTitle)
          .exists()
      ).toBe(true)
    })

    it('renders the SubordinateCardTitle', () => {
      const wrapper = render()
      expect(wrapper.find(CardTitle).html()).toContain('Assigned Staff')
    })

    it('has card content with the Staff Table', () => {
      const wrapper = render()
      const staffTable = wrapper.find(CardBody).find(StaffTable)
      expect(staffTable.exists()).toBe(true)
      expect(staffTable.props().staff).toBe(mockStaff)
    })
  })
})
