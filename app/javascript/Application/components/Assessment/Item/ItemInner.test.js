import React from 'react'
import { mount } from 'enzyme'
import ItemInner from './ItemInner'
import ItemToolbarControls from './ItemToolbarControls'
import ItemHeader from './ItemHeader'
import ItemDescription from './ItemDescription'

const fakeProps = {
  item: {
    code: 'lf10family',
    under_six_id: '01',
    above_six_id: '101',
    required: true,
    confidential: false,
    confidential_by_default: false,
    rating_type: 'BOOL',
    has_na_option: false,
    rating: 3,
  },
  isAssessmentUnderSix: false,
  caregiverIndex: 'a',
  disabled: false,
  canReleaseConfidentialInfo: false,
  code: 'TRM',
  rating_type: 'BOOL',
  hasNaOption: false,
  rating: 3,
  isCompletedAssessment: false,
  isConfidential: false,
  isConfidentialByDefault: false,
  under_six_id: '01',
  above_six_id: '101',
  comment: 'someComment',
  itemNumber: '7',
  isExpanded: true,
  title: 'someTitle',
  description: 'SomeDescription',
  qtcDescriptions: ['qtcDescriptions'],
  ratingDescriptions: ['ratingDescriptions'],
  isBooleanRating: false,
  handleRatingChange: () => {},
  handleConfidentialityChange: () => {},
  handleNaValueSetting: () => {},
  switchExpandedState: () => {},
  handleKeyCheck: () => {},
  handleCommentChange: () => {},
  maxCommentLength: 250,
}

describe('<ItemInner/>', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(<ItemInner {...fakeProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('will initially render ItemHeader with correct props', () => {
    const target = wrapper.find(ItemHeader)
    expect(target.exists()).toBe(true)
    const expectedProps = ['code', 'isExpanded', 'onClick', 'onKeyDown', 'itemNumber', 'caregiverIndex', 'title']
    expect(Object.keys(target.props())).toEqual(expectedProps)
  })

  it('will initially render ItemToolbarControls with correct props', () => {
    const target = wrapper.find(ItemToolbarControls)
    expect(target.exists()).toBe(true)
    const expectedProps = [
      'code',
      'onRatingUpdate',
      'disabled',
      'isCompletedAssessment',
      'isConfidential',
      'isConfidentialByDefault',
      'canReleaseConfidentialInfo',
      'handleConfidentialityChange',
      'handleNaValueSetting',
      'comment',
      'previousRating',
      'ratingType',
      'hasNaOption',
      'rating',
    ]
    expect(Object.keys(target.props())).toEqual(expectedProps)
  })

  it('will render ItemDescription with correct props when expanded', () => {
    expect(fakeProps.isExpanded).toBe(true)
    const target = wrapper.find(ItemDescription)
    expect(target.exists()).toBe(true)
    const expectedProps = [
      'description',
      'qtcDescriptions',
      'ratingDescriptions',
      'isBooleanRating',
      'handleRatingChange',
      'disabled',
      'comment',
      'handleCommentChange',
      'maxCommentLength',
      'itemBottomCollapseClick',
      'code',
      'hasNaOption',
      'rating',
    ]
    expect(Object.keys(target.props())).toEqual(expectedProps)
  })
})
