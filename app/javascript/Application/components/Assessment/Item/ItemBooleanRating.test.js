import React from 'react'
import { mount } from 'enzyme'
import ItemBooleanRating from './ItemBooleanRating'

describe('<ItemBooleanRating/>', () => {
  const boolRatingProps = {
    code: 'DISRUPTIONS_CG_ATTACHMENT_LOSSES',
    rating: -1,
    onRatingUpdate: jest.fn(),
    isCompletedAssessment: false,
  }

  const boolNaRatingProps = {
    code: 'DISRUPTIONS_CG_ATTACHMENT_LOSSES',
    rating: 8,
    onRatingUpdate: jest.fn(),
    isCompletedAssessment: false,
  }

  it('will render 2 Radio buttons with label Yes and No when has booleanRating', () => {
    const wrapper = mount(<ItemBooleanRating {...boolRatingProps} />)
    expect(wrapper.find('Radio').length).toBe(2)
    expect(
      wrapper
        .find('FormControlLabel')
        .at(0)
        .text()
    ).toBe('No')
    expect(
      wrapper
        .find('FormControlLabel')
        .at(1)
        .text()
    ).toBe('Yes')
  })

  it('when Yes Radio be click,onRatingUpdate will be called ', () => {
    const wrapper = mount(<ItemBooleanRating {...boolRatingProps} />)
    wrapper
      .find('RadioGroup')
      .at(0)
      .prop('onChange')({ target: { value: 0 } })
    expect(wrapper.props().onRatingUpdate).toBeCalledWith({ target: { value: 0 } })
  })

  it('will render 2 #disabled# Radio buttons when has booleanRating and be checked as N/A', () => {
    const wrapper = mount(<ItemBooleanRating {...boolNaRatingProps} />)
    expect(wrapper.find('Radio[disabled=true]').length).toBe(2)
  })

  it('should propagate disabled prop to <FormControl/>', () => {
    const disabledProps = { ...boolRatingProps, disabled: true }
    const wrapper = mount(<ItemBooleanRating {...disabledProps} />)
    wrapper.find('FormControl').forEach(control => {
      expect(control.prop('disabled')).toBe(true)
    })
  })
})
