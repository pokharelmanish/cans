import React from 'react'
import { mount } from 'enzyme'
import ItemNaCheckbox from './ItemNaCheckbox'

describe('<ItemNaCheckbox/>', () => {
  const fakeChecked = {
    handleRatingChange: jest.fn(),
    naValue: '-1',
    rating: 8,
  }
  const fakeUnChecked = {
    handleRatingChange: jest.fn(),
    naValue: '8',
    rating: -1,
    previousRating: 8,
  }

  describe('ItemNacheckbox is checked', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(<ItemNaCheckbox {...fakeChecked} />)
    })

    it('will render label N/A', () => {
      expect(
        wrapper
          .find('FormControlLabel')
          .at(0)
          .find('Typography')
          .at(0)
          .text()
      ).toBe('N/A')
    })

    it('will render a checkbox be checked', () => {
      expect(wrapper.find('Checkbox[checked=true]').exists()).toBe(true)
    })

    it('will render a checkbox with value -1', () => {
      expect(wrapper.find('Checkbox[value="-1"]').exists()).toBe(true)
    })

    it('when unCheck handleRatingChange should be called', () => {
      wrapper.find('Checkbox[value="-1"]').prop('onChange')({ target: { value: -1 } })
      expect(wrapper.props().handleRatingChange).toBeCalledWith({ target: { value: -1 } })
    })
  })

  describe('ItemNacheckbox is NOT checked', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(<ItemNaCheckbox {...fakeUnChecked} />)
    })

    it('will add Visual indicator to the N/A checkbox when has previous rating is 8', () => {
      const wrapper = mount(<ItemNaCheckbox {...fakeUnChecked} />)
      const formControlLabel = wrapper.find('FormControlLabel').at(0)
      expect(formControlLabel.props().className).toEqual('previous-rating-label')
    })

    it('will render a checkbox NOT be checked', () => {
      expect(wrapper.find('Checkbox[checked=false]').exists()).toBe(true)
    })

    it('will render a checkbox with value 8', () => {
      expect(wrapper.find('Checkbox[value="8"]').exists()).toBe(true)
    })

    it('when unCheck handleRatingChange should be called', () => {
      wrapper.find('Checkbox[value="8"]').prop('onChange')({ target: { value: 8 } })
      expect(wrapper.props().handleRatingChange).toBeCalledWith({ target: { value: 8 } })
    })
  })

  describe('ItemNacheckbox is disabled', () => {
    it('should propagate disabled props to checkbox', () => {
      const props = { ...fakeUnChecked, disabled: true }
      const wrapper = mount(<ItemNaCheckbox {...props} />)
      expect(wrapper.find('Checkbox').prop('disabled')).toBe(true)
    })
  })
})
