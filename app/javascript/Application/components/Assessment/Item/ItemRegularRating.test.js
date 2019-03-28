import React from 'react'
import { mount } from 'enzyme'
import ItemRegularRating from './ItemRegularRating'

describe('<ItemBooleanRating/>', () => {
  const regularRatingProps = {
    code: 'FAMILY_STRENGTHS',
    rating: -1,
    onRatingUpdate: jest.fn(),
    isCompletedAssessment: false,
  }

  const regularRatingWithNaProps = {
    code: 'FAMILY_STRENGTHS',
    rating: 8,
    onRatingUpdate: jest.fn(),
    isCompletedAssessment: false,
  }

  it('will render 4 Radio buttons with label 0 1 2 3 when has regularRating ', () => {
    const wrapper = mount(<ItemRegularRating {...regularRatingProps} />)
    expect(wrapper.find('Radio').length).toBe(4)
    expect(
      wrapper
        .find('FormControlLabel')
        .at(0)
        .text()
    ).toBe('0')
    expect(
      wrapper
        .find('FormControlLabel')
        .at(1)
        .text()
    ).toBe('1')
    expect(
      wrapper
        .find('FormControlLabel')
        .at(2)
        .text()
    ).toBe('2')
    expect(
      wrapper
        .find('FormControlLabel')
        .at(3)
        .text()
    ).toBe('3')
  })

  it('when Radio 0 be click,onRatingUpdate will be called ', () => {
    const wrapper = mount(<ItemRegularRating {...regularRatingProps} />)
    wrapper
      .find('RadioGroup')
      .at(0)
      .prop('onChange')({ target: { value: 0 } })
    expect(wrapper.props().onRatingUpdate).toBeCalledWith({ target: { value: 0 } })
  })

  it('will render 4 #disabled# Radio buttons when has regularRating and be checked as N/A', () => {
    const wrapper = mount(<ItemRegularRating {...regularRatingWithNaProps} />)
    expect(wrapper.find('Radio[disabled=true]').length).toBe(4)
  })

  it('should propagate disabled prop to <FormControl/>', () => {
    const disabledProps = { ...regularRatingProps, disabled: true }
    const wrapper = mount(<ItemRegularRating {...disabledProps} />)
    wrapper.find('FormControl').forEach(control => {
      expect(control.prop('disabled')).toBe(true)
    })
  })
})
