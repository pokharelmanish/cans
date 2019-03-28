import React from 'react'
import Typography from '@material-ui/core/Typography'
import ItemQtcDescriptions from './ItemQtcDescriptions'
import ItemDescriptionRating from './ItemDescriptionRating'
import Comment from '../../common/Comment'
import { mount } from 'enzyme'
import ItemDescription from './ItemDescription'
import BottomCollapseIcon from '../BottomCollapseIcon'

const fakeProps = {
  description: 'someThing',
  qtcDescriptions: ['a'],
  code: 'TRM',
  ratingDescriptions: ['b'],
  isBooleanRating: false,
  rating: 3,
  hasNaOption: false,
  handleRatingChange: jest.fn(),
  disabled: false,
  comment: 'someComment',
  handleCommentChange: jest.fn(),
  maxCommentLength: 200,
  itemBottomCollapseClick: jest.fn(),
}

describe('<ItemDescription />', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(<ItemDescription {...fakeProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('will render Item Description', () => {
    const target = wrapper.find(Typography)
    expect(target.at(0).text()).toBe('Item Description:')
    expect(target.at(1).text()).toBe(fakeProps.description)
  })

  it('will render ItemQtcDescriptions when has qtcDescriptions with correct props', () => {
    expect(fakeProps.qtcDescriptions.length).toBeGreaterThan(0)
    const target = wrapper.find(ItemQtcDescriptions)
    expect(target.exists()).toBe(true)
    expect(target.props()).toEqual({ qtcDescriptions: ['a'] })
  })

  it('will render ItemDescriptionRating when has ratingDescriptions with correct props', () => {
    expect(fakeProps.ratingDescriptions.length).toBeGreaterThan(0)
    const target = wrapper.find(ItemDescriptionRating)
    expect(target.exists()).toBe(true)
    const expectedProps = [
      'code',
      'ratingDescriptions',
      'isBooleanRating',
      'rating',
      'hasNaOption',
      'handleRatingChange',
      'disabled',
    ]
    expect(Object.keys(target.props())).toEqual(expectedProps)
  })

  it('will render comment with correct props', () => {
    const target = wrapper.find(Comment)
    expect(target.exists()).toBe(true)
    const expectedProps = [
      'id',
      'comment',
      'onChange',
      'prefix',
      'maxCommentLength',
      'disabled',
      'isCommentIconDisabled',
      'onKeyUp',
      'title',
    ]
    expect(Object.keys(target.props())).toEqual(expectedProps)
  })

  it('will render BottomCollapseIcon with correct props', () => {
    const target = wrapper.find(BottomCollapseIcon)
    expect(target.exists()).toBe(true)
    const expectedProps = ['code', 'onClick']
    expect(Object.keys(target.props())).toEqual(expectedProps)
  })
})
