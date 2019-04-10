import React from 'react'
import { mount } from 'enzyme'
import ItemRating from './ItemRating'

describe('<ItemRating />', () => {
  const defaultProps = {
    code: 'FAMILY_STRENGTHS',
    onRatingUpdate: () => {},
    rating: -1,
    shortType: 'reg',
    type: 'regular',
    isCompletedAssessment: false,
  }

  const render = props => mount(<ItemRating {...defaultProps} {...props} />)

  describe('with several options', () => {
    const options = ['Hello', 'Hi', 'Salutations', 'Good Evening', 'Howdy']
    let wrapper

    beforeEach(() => {
      wrapper = render({ options })
    })

    it('renders a radio button for each option', () => {
      expect(wrapper.find('Radio').length).toBe(5)
    })

    it('labels each radio button correctly', () => {
      options.forEach((option, i) => {
        expect(
          wrapper
            .find('FormControlLabel')
            .at(i)
            .text()
        ).toBe(option)
      })
    })
  })

  it('calls onRatingUpdate when a rating is selected', () => {
    const onRatingUpdate = jest.fn()
    const wrapper = render({ options: ['To Be', 'Not To Be'], onRatingUpdate })

    const event = { target: { value: 0 } }
    wrapper
      .find('RadioGroup')
      .at(0)
      .props()
      .onChange(event)
    expect(onRatingUpdate).toHaveBeenCalledWith(event)
  })

  describe('when disabled', () => {
    const options = ['Hello', 'Hi', 'Salutations']
    let wrapper

    beforeEach(() => {
      wrapper = render({ options, disabled: true })
    })

    it('renders a disabled radio button for each option', () => {
      expect(wrapper.find('Radio[disabled=true]').length).toBe(3)
    })

    it('propagates disabled prop to <FormControl />', () => {
      wrapper.find('FormControl').forEach(control => {
        expect(control.props().disabled).toBe(true)
      })
    })
  })

  describe('when has previousRating', () => {
    const options = ['0', '1', '2', '3']
    describe('and assessment is not completed', () => {
      it('adds style to the previous rating radio button block', () => {
        const previousRating = 1
        const wrapper = render({ options, previousRating, isCompletedAssessment: false })
        const formControlLabel = wrapper.find('FormControlLabel').at(previousRating)
        expect(formControlLabel.props().className).toEqual('previous-rating-label')
      })

      it('does not add style to the other rating radio button blocks', () => {
        const previousRating = 0
        const wrapper = render({ options, previousRating, isCompletedAssessment: false })
        const assertNoStyle = index =>
          expect(
            wrapper
              .find('FormControlLabel')
              .at(index)
              .props().className
          ).toBeUndefined()

        assertNoStyle(1)
        assertNoStyle(2)
        assertNoStyle(3)
      })
    })

    describe('and assessment is completed', () => {
      it('does not add style to the previous rating radio button block', () => {
        const previousRating = 1
        const wrapper = render({ options, previousRating, isCompletedAssessment: true })
        const formControlLabel = wrapper.find('FormControlLabel').at(previousRating)
        expect(formControlLabel.props().className).toBeUndefined()
      })
    })
  })
})
