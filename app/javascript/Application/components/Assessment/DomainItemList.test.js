import React from 'react'
import { shallow } from 'enzyme'
import DomainItemList from './DomainItemList'
import Item from './Item'
import Divider from '@material-ui/core/Divider'

describe('<DomainItemList/>', () => {
  const fakeItemListProps = {
    items: [{ code: 'code1', above_six_id: 1, rating: -1 }, { code: 'code2', above_six_id: 2, rating: -1 }],
    caregiverIndex: 'a',
    i18nAll: { i18nkey: 'i18nvalue' },
    isAssessmentUnderSix: false,
    canReleaseConfidentialInfo: true,
    isCompletedAssessment: false,
    previousRatingsMap: {
      code1: 2,
      code2: 3,
    },
    onConfidentialityUpdate: () => {
      return 'onConfidentialityUpdate haveBeenCalled'
    },
    onItemCommentUpdate: () => {},
    onRatingUpdate: () => {
      return 'onRatingUpdate haveBeenCalled'
    },
  }

  let wrapper
  beforeEach(() => {
    wrapper = shallow(<DomainItemList {...fakeItemListProps} />)
  })

  it('will render a Item for each item in the props', () => {
    expect(wrapper.find('Item').length).toBe(2)
  })

  it('will render a Divider for each Item', () => {
    expect(wrapper.find(Divider).length).toBe(2)
  })

  it('will render Item with right props', () => {
    const target = wrapper
      .find(Item)
      .at(0)
      .props()
    expect(target.canReleaseConfidentialInfo).toBe(true)
    expect(target.caregiverIndex).toBe('a')
    expect(target.i18n).toEqual({})
    expect(target.isAssessmentUnderSix).toBe(false)
    expect(target.item).toEqual({ code: 'code1', above_six_id: 1, rating: -1 })
    expect(target.onConfidentialityUpdate()).toBe('onConfidentialityUpdate haveBeenCalled')
    expect(target.isCompletedAssessment).toBe(false)
    expect(target.previousRating).toBe(2)
    expect(target.onRatingUpdate()).toBe('onRatingUpdate haveBeenCalled')
  })

  it('will not render an Item with undefined above_six_id, on the above_six assessment', () => {
    const props = {
      ...fakeItemListProps,
      items: [{ code: 'code1', above_six_id: 1, rating: -1 }, { code: 'code2', rating: -1 }],
    }
    const wrapper = shallow(<DomainItemList {...props} />)
    expect(wrapper.find('Item').length).toBe(1)
  })

  it('should propagate onItemCommentUpdate from props to onCommentUpdate Items` prop', () => {
    const onItemCommentUpdateMock = jest.fn()
    const props = {
      ...fakeItemListProps,
      onItemCommentUpdate: onItemCommentUpdateMock,
    }
    const wrapper = shallow(<DomainItemList {...props} />)
    wrapper.find(Item).forEach(item => expect(item.props().onCommentUpdate).toBe(onItemCommentUpdateMock))
  })

  it('should propagate disable prop to <Item/> ', () => {
    const props = {
      ...fakeItemListProps,
      disabled: true,
    }
    const wrapper = shallow(<DomainItemList {...props} />)
    wrapper.find(Item).forEach(item => expect(item.prop('disabled')).toBe(true))
  })
})
