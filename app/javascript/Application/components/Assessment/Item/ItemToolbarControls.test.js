import React from 'react'
import ItemNaCheckbox from './ItemNaCheckbox'
import ItemBooleanRating from './ItemBooleanRating'
import ItemRegularRating from './ItemRegularRating'
import CommentIcon from '../../common/CommentIcon'
import ConfidentialCheckbox from './ConfidentialCheckbox'
import { mount } from 'enzyme'
import ItemToolbarControls from './ItemToolbarControls'

const fakeProps = {
  hasNaOption: true,
  rating: 3,
  onRatingUpdate: jest.fn(),
  disabled: false,
  isConfidential: false,
  isConfidentialByDefault: false,
  code: 'TRD',
  canReleaseConfidentialInfo: false,
  handleConfidentialityChange: jest.fn(),
  handleNaValueSetting: jest.fn(() => '8'),
  comment: 'someComment',
  ratingType: 'REGULAR',
}

describe('<ItemToolbarControls />', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(<ItemToolbarControls {...fakeProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('will invoke handleNaValueSetting when render ItemNaCheckbox', () => {
    const target = wrapper.find(ItemNaCheckbox)
    expect(target.exists()).toBe(true)
    expect(fakeProps.handleNaValueSetting).toHaveBeenCalledTimes(1)
  })

  it('will render ItemNaCheckbox when has NA option', () => {
    const target = wrapper.find(ItemNaCheckbox)
    expect(fakeProps.hasNaOption).toBe(true)
    expect(target.exists()).toBe(true)
  })

  it('will render ItemNaCheckbox with correct props', () => {
    const target = wrapper.find(ItemNaCheckbox)
    const expectedProps = ['rating', 'handleRatingChange', 'naValue', 'disabled']
    expect(Object.keys(target.props())).toEqual(expectedProps)
  })

  it('will render CommentIcons', () => {
    const target = wrapper.find(CommentIcon)
    expect(target.exists()).toBe(true)
  })

  it('will render ConfidentialCheckbox with correct props', () => {
    const target = wrapper.find(ConfidentialCheckbox)
    expect(target.exists()).toBe(true)
    const expectedProps = [
      'isConfidential',
      'isConfidentialByDefault',
      'code',
      'canReleaseConfidentialInfo',
      'disabled',
      'handleConfidentialityChange',
    ]
    expect(Object.keys(target.props())).toEqual(expectedProps)
  })

  it('will render ItemRegularRating with correct props when ratingType equal to REGULAR', () => {
    const target = wrapper.find(ItemRegularRating)
    expect(fakeProps.ratingType).toBe('REGULAR')
    expect(target.exists()).toBe(true)
    const expectedProps = ['itemCode', 'hasNaOption', 'rating', 'onRatingUpdate', 'disabled']
    expect(Object.keys(target.props())).toEqual(expectedProps)
  })

  it('will render ItemBooleanRating  with correct props when ratingType NOT equal to REGULAR', () => {
    const boolProps = { ...fakeProps }
    boolProps.ratingType = 'BOOL'
    const boolWrapper = mount(<ItemToolbarControls {...boolProps} />)
    const target = boolWrapper.find(ItemBooleanRating)
    expect(target.exists()).toBe(true)
    const expectedProps = ['itemCode', 'hasNaOption', 'rating', 'onRatingUpdate', 'disabled']
    expect(Object.keys(target.props())).toEqual(expectedProps)
    boolWrapper.unmount()
  })
})
