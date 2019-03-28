import React from 'react'
import { mount } from 'enzyme'
import Item from './Item'
import CommentIcon from '../../common/CommentIcon'
import Comment from '../../common/Comment'
import ConfidentialCheckbox from './ConfidentialCheckbox'
import ItemInner from './ItemInner'

const itemDefault = {
  code: 'lf10family',
  under_six_id: '1',
  above_six_id: '101',
  required: true,
  confidential: true,
  confidential_by_default: true,
  rating_type: 'REGULAR',
  has_na_option: false,
  rating: -1,
}

const itemWithComment = {
  ...itemDefault,
  comment: 'a comment',
}

const nonSUDItem = {
  code: 'lf10family',
  under_six_id: '1',
  above_six_id: '101',
  required: true,
  confidential: true,
  confidential_by_default: false,
  rating_type: 'REGULAR',
  has_na_option: false,
  rating: -1,
}

const itemWithNaChecked = {
  code: 'lf10family',
  under_six_id: '1',
  above_six_id: '101',
  required: true,
  confidential: true,
  confidential_by_default: true,
  rating_type: 'REGULAR',
  has_na_option: true,
  rating: 8,
}

const itemWithOutNaChecked = {
  code: 'lf10family',
  under_six_id: '1',
  above_six_id: '101',
  required: true,
  confidential: true,
  confidential_by_default: true,
  rating_type: 'REGULAR',
  has_na_option: true,
  rating: -1,
}

const i18nDefault = {
  _title_: 'Title',
  _description_: 'Description',
  '_to_consider_.0': 'qtc 0',
  '_to_consider_.1': 'qtc 1',
  '_rating_.0': 'rating 0 description',
  '_rating_.1': 'rating 1 description',
  '_rating_.2': 'rating 2 description',
  '_rating_.3': 'rating 3 description',
}

const propsDefault = { i18n: i18nDefault }

const itemComponentDefault = (
  <Item
    key={'1'}
    canReleaseConfidentialInfo={true}
    item={{ ...itemDefault }}
    isAssessmentUnderSix={true}
    isCompletedAssessment={false}
    i18n={{ ...i18nDefault }}
    onRatingUpdate={() => {}}
    onConfidentialityUpdate={() => {}}
    onCommentUpdate={() => {}}
  />
)

const mountItem = item => {
  return mount(
    <Item
      key={'1'}
      canReleaseConfidentialInfo={true}
      item={item}
      isAssessmentUnderSix={false}
      isCompletedAssessment={false}
      i18n={{ ...i18nDefault }}
      onRatingUpdate={() => {}}
      onConfidentialityUpdate={() => {}}
      onCommentUpdate={() => {}}
    />
  )
}

const mountDisabledItem = item => {
  return mount(
    <Item
      key={'1'}
      canReleaseConfidentialInfo={true}
      item={item}
      isAssessmentUnderSix={false}
      isCompletedAssessment={false}
      i18n={{ ...i18nDefault }}
      onRatingUpdate={() => {}}
      onConfidentialityUpdate={() => {}}
      onCommentUpdate={() => {}}
      disabled={true}
    />
  )
}

describe('<Item />', () => {
  jest.unmock('../../../util/assessmentAutoScroll')
  const autoScroll = require.requireActual('../../../util/assessmentAutoScroll')
  autoScroll.expandingThenScroll = jest.fn(() => null)
  const expandingThenScroll = autoScroll.expandingThenScroll
  afterEach(() => {
    expandingThenScroll.mockReset()
  })

  it('can expand and fold', () => {
    const wrapper = mount({ ...itemComponentDefault })
    wrapper.setProps({ ...propsDefault })
    const foldedText = wrapper.text()
    let icon = wrapper.find('#lf10family-item-expand').at(0)
    expect(icon.props().icon).toBe('chevron-down')
    expect(icon.props().rotation).toBe(270)
    expect(foldedText).not.toMatch(/Description/)

    icon.simulate('click')
    icon = wrapper.find('#lf10family-item-expand').at(0)
    expect(icon.props().icon).toBe('chevron-down')
    expect(icon.props().rotation).toBe(null)
    expect(wrapper.state().isExpanded).toBeTruthy()
  })

  it('when chevron button get focus and press tab item will not expand', async () => {
    const wrapper = mount({ ...itemComponentDefault })
    wrapper.find('Icon[icon="chevron-down"]').simulate('keydown', { key: 'Tab' })
    expect(wrapper.instance().state.isExpanded).toEqual(false)
  })

  it('when chevron button get focus and press a key other than Tab, item will expand', async () => {
    const wrapper = mount({ ...itemComponentDefault })
    wrapper.find('Icon[icon="chevron-down"]').simulate('keydown', { key: 'Enter' })
    expect(wrapper.instance().state.isExpanded).toEqual(true)
  })

  it('when item expands expandingThenScroll will be invoked', async () => {
    const wrapper = mount({ ...itemComponentDefault })
    wrapper.find('Icon[icon="chevron-down"]').simulate('click')
    expect(wrapper.instance().state.isExpanded).toEqual(true)
    expect(expandingThenScroll).toHaveBeenCalledTimes(1)
  })

  it('has a title, description, questions to consider and rating descriptions ', async () => {
    const wrapper = mount({ ...itemComponentDefault })
    wrapper.setProps({ ...propsDefault })
    const foldedText = wrapper.text()
    expect(foldedText).toMatch(/TITLE/)
    expect(foldedText).not.toMatch(/Description/)
    expect(foldedText).not.toMatch(/qtc/)
    expect(foldedText).not.toMatch(/rating/)

    wrapper.find('Icon#lf10family-item-expand').simulate('click')
    const expandedText = wrapper.find('ItemDescription').text()
    expect(expandedText).toMatch(/Description:Description/)
    expect(expandedText).toMatch(/qtc 0qtc 1/)
    expect(expandedText).toMatch(
      /0 = rating 0 description1 = rating 1 description2 = rating 2 description3 = rating 3 description/
    )
  })

  it('renders caregiver index if it exists', async () => {
    const wrapper = mount({ ...itemComponentDefault })
    wrapper.setProps({
      ...propsDefault,
      caregiverIndex: 'a',
    })
    const foldedText = wrapper.text()
    expect(foldedText).toMatch(/1a\. /)
  })

  describe('CommentIcon in the toolbar', () => {
    it('should not render CommentIcon if item has no comment', () => {
      const wrapper = mountItem(itemDefault)
      const commentIcon = wrapper.find(CommentIcon)
      expect(commentIcon.exists()).toBe(false)
    })

    it('should render CommentIcon if item has a comment', () => {
      const wrapper = mountItem(itemWithComment)
      const commentIcon = wrapper.find(CommentIcon)
      expect(commentIcon.exists()).toBe(true)
    })

    it('should render CommentIcon with item-toolbar-comment-icon style if item has a comment', () => {
      const wrapper = mountItem(itemWithComment)
      const commentIcon = wrapper.find(CommentIcon)
      expect(commentIcon.props().className.includes('item-toolbar-comment-icon')).toBeTruthy()
    })
  })

  describe('renders <ConfidentialCheckbox />', () => {
    it('renders ConfidentialCheckbox', async () => {
      const wrapper = mount({ ...itemComponentDefault })
      wrapper.setProps({
        ...propsDefault,
        caregiverIndex: 'a',
      })
      const target = wrapper.find(ConfidentialCheckbox)
      expect(target.exists()).toBe(true)
    })

    it('renders ConfidentialCheckbox with correct props', async () => {
      const wrapper = mount({ ...itemComponentDefault })
      wrapper.setProps({
        ...propsDefault,
        caregiverIndex: 'a',
      })
      const target = wrapper.find(ConfidentialCheckbox)
      const expectedProps = [
        'isConfidential',
        'isConfidentialByDefault',
        'code',
        'canReleaseConfidentialInfo',
        'disabled',
        'handleConfidentialityChange',
      ]
      expect(Object.keys(target.props())).toEqual(expectedProps)
      expect(typeof target.props().handleConfidentialityChange).toBe('function')
    })
  })

  describe('N/A option', () => {
    it('when have N/A option, N/A checkbox will be rendered. After checked, handleRatingChange will be called for 1 time', () => {
      const item = { ...itemWithOutNaChecked }
      item.has_na_option = true
      const wrapper = mountItem(item)
      const instance = wrapper.instance()
      jest.spyOn(instance, 'handleRatingChange')
      wrapper.setProps({ ...propsDefault })
      wrapper.find('Icon#lf10family-item-expand').simulate('click')
      wrapper.find('FormControlLabel[label="N/A"]').prop('onChange')({ target: { value: 8 } })
      expect(instance.handleRatingChange).toHaveBeenCalledTimes(1)
    })

    it('after original unChecked N/A option be checked, handleNaValueSetting will set the checkbox value to 8', () => {
      const item = { ...itemWithOutNaChecked }
      item.has_na_option = true
      const wrapper = mountItem(item)
      const instance = wrapper.instance()
      jest.spyOn(instance, 'handleNaValueSetting')
      wrapper.setProps({ ...propsDefault })
      wrapper.find('Icon#lf10family-item-expand').simulate('click')
      wrapper.find('FormControlLabel[label="N/A"]').prop('onChange')({ target: { value: 8 } })
      wrapper.update()
      expect(instance.handleNaValueSetting).toHaveBeenCalledTimes(2)
      expect(wrapper.find('FormControlLabel[label="N/A"][value="8"]').exists()).toBe(true)
    })

    it('after original Checked N/A option be unChecked, handleNaValueSetting will set the checkbox value to -1', () => {
      const item = { ...itemWithNaChecked }
      item.has_na_option = true
      const wrapper = mountItem(item)
      const instance = wrapper.instance()
      jest.spyOn(instance, 'handleNaValueSetting')
      wrapper.setProps({ ...propsDefault })
      wrapper.find('Icon#lf10family-item-expand').simulate('click')
      wrapper.find('FormControlLabel[label="N/A"]').prop('onChange')({ target: { value: -1 } })
      wrapper.update()
      expect(instance.handleNaValueSetting).toHaveBeenCalledTimes(2)
      expect(wrapper.find('FormControlLabel[label="N/A"][value="-1"]').exists()).toBe(true)
    })

    it('when have no N/A option, N/A checkbox will #NOT# be rendered', () => {
      const item = { ...itemDefault }
      item.has_na_option = false
      const wrapper = mountItem(item)
      wrapper.setProps({ ...propsDefault })
      wrapper.find('Icon#lf10family-item-expand').simulate('click')
      const naCheckbox = wrapper.find('FormControlLabel[label="N/A"]').find('Checkbox')
      expect(naCheckbox.length).toBe(0)
    })

    it('should propagate disabled props to ItemNaCheckbox', () => {
      const item = { ...itemDefault }
      item.has_na_option = true
      const wrapper = mountDisabledItem(item)
      wrapper.find('Icon#lf10family-item-expand').simulate('click')
      const naCheckbox = wrapper.find('ItemNaCheckbox')
      expect(naCheckbox.prop('disabled')).toBe(true)
    })
  })

  describe('Rating Types label', () => {
    it('can have Regular rating', () => {
      const wrapper = mount({ ...itemComponentDefault })
      wrapper.setProps({ ...propsDefault })
      wrapper.find('Icon#lf10family-item-expand').simulate('click')
      const expandedText = wrapper.find('ItemDescription').text()
      expect(expandedText).toMatch(/0 = rating 0 description1 = rating 1 description/)
    })

    it('can have Boolean rating label', () => {
      const item = { ...itemDefault }
      item.rating_type = 'BOOLEAN'
      const wrapper = mountItem(item)
      wrapper.setProps({ ...propsDefault })
      wrapper.find('Icon#lf10family-item-expand').simulate('click')
      const expandedText = wrapper.find('ItemDescription').text()
      expect(expandedText).toMatch(/No = rating 0 descriptionYes = rating 1 description/)
    })
  })

  describe('Actions', () => {
    it('invokes onConfidentialityUpdate callback on confidentiality change', () => {
      const onConfidentialityUpdateMock = jest.fn()
      const wrapper = mount(
        <Item
          key={'1'}
          canReleaseConfidentialInfo={true}
          item={{ ...itemDefault }}
          isAssessmentUnderSix={false}
          isCompletedAssessment={false}
          i18n={{ ...i18nDefault }}
          onCommentUpdate={() => {}}
          onRatingUpdate={() => {}}
          onConfidentialityUpdate={onConfidentialityUpdateMock}
        />
      )
      wrapper.setProps({ ...propsDefault })
      wrapper.instance().handleConfidentialityChange({ target: {} })
      expect(onConfidentialityUpdateMock.mock.calls.length).toBe(1)
    })
  })

  describe('#handleCommentChange()', () => {
    it('should propagate handleCommentChange to onChange Comment prop', () => {
      const onCommentUpdateMock = jest.fn()
      const wrapper = mount(
        <Item
          isAssessmentUnderSix={false}
          item={{ ...itemDefault }}
          i18n={{ ...i18nDefault }}
          isCompletedAssessment={false}
          canReleaseConfidentialInfo={false}
          onCommentUpdate={onCommentUpdateMock}
          onRatingUpdate={() => {}}
          onConfidentialityUpdate={() => {}}
        />
      )
      wrapper.setState({ isExpanded: true })
      wrapper
        .find(Comment)
        .props()
        .onChange('new comment')
      expect(onCommentUpdateMock).toHaveBeenCalledTimes(1)
      expect(onCommentUpdateMock).toHaveBeenCalledWith('lf10family', 'new comment', undefined)
    })
  })

  describe('Comment', () => {
    it('should be rendered with a comment in props', () => {
      const wrapper = mountItem(itemWithComment)
      wrapper.setState({ isExpanded: true })
      expect(wrapper.find(Comment).props().comment).toBe('a comment')
    })
  })

  it('should propagate disable prop to <ItemRegularRating />', () => {
    const wrapper = mount(
      <Item
        isAssessmentUnderSix={false}
        item={{ ...nonSUDItem }}
        i18n={{ ...i18nDefault }}
        isCompletedAssessment={false}
        canReleaseConfidentialInfo={false}
        onCommentUpdate={() => {}}
        onRatingUpdate={() => {}}
        onConfidentialityUpdate={() => {}}
        disabled={true}
      />
    )
    expect(wrapper.find('ItemRegularRating').prop('disabled')).toBe(true)
  })

  it('should propagate disable prop to <ItemBooleanRating />', () => {
    const boolRatingItem = { ...nonSUDItem, rating_type: 'BOOLEAN' }
    const wrapper = mount(
      <Item
        isAssessmentUnderSix={false}
        item={{ ...boolRatingItem }}
        i18n={{ ...i18nDefault }}
        isCompletedAssessment={false}
        canReleaseConfidentialInfo={false}
        onCommentUpdate={() => {}}
        onRatingUpdate={() => {}}
        onConfidentialityUpdate={() => {}}
        disabled={true}
      />
    )
    expect(wrapper.find('ItemBooleanRating').prop('disabled')).toBe(true)
  })

  it('should propagate disable prop to <ItemDescriptionRating />', () => {
    const wrapper = mount(
      <Item
        isAssessmentUnderSix={false}
        item={{ ...nonSUDItem }}
        i18n={{ ...i18nDefault }}
        isCompletedAssessment={false}
        canReleaseConfidentialInfo={false}
        onCommentUpdate={() => {}}
        onRatingUpdate={() => {}}
        onConfidentialityUpdate={() => {}}
        disabled={true}
      />
    )
    wrapper.find('Icon#lf10family-item-expand').simulate('click')
    expect(wrapper.find('ItemDescriptionRating').prop('disabled')).toBe(true)
  })

  it('should propagate disable prop to <Comment />', () => {
    const wrapper = mount(
      <Item
        isAssessmentUnderSix={false}
        item={{ ...nonSUDItem }}
        i18n={{ ...i18nDefault }}
        isCompletedAssessment={false}
        canReleaseConfidentialInfo={false}
        onCommentUpdate={() => {}}
        onRatingUpdate={() => {}}
        onConfidentialityUpdate={() => {}}
        disabled={true}
      />
    )
    wrapper.find('Icon#lf10family-item-expand').simulate('click')
    expect(wrapper.find('Comment').prop('disabled')).toBe(true)
  })

  describe('Complementary tests for CANS-755 refactor', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mountItem(itemWithComment)
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('will initially render ItemInner', () => {
      const target = wrapper.find(ItemInner)
      expect(target.exists()).toBe(true)
    })

    it('will render ItemInner with correct props', () => {
      const target = wrapper.find(ItemInner)
      const expectedProps = [
        'item',
        'isAssessmentUnderSix',
        'caregiverIndex',
        'disabled',
        'canReleaseConfidentialInfo',
        'code',
        'rating_type',
        'hasNaOption',
        'rating',
        'isConfidential',
        'isConfidentialByDefault',
        'under_six_id',
        'above_six_id',
        'comment',
        'itemNumber',
        'isExpanded',
        'title',
        'description',
        'qtcDescriptions',
        'ratingDescriptions',
        'isBooleanRating',
        'previousRating',
        'isCompletedAssessment',
        'handleRatingChange',
        'handleConfidentialityChange',
        'handleNaValueSetting',
        'switchExpandedState',
        'handleKeyCheck',
        'handleCommentChange',
        'maxCommentLength',
      ]
      expect(Object.keys(target.props())).toEqual(expectedProps)
    })
  })
})
