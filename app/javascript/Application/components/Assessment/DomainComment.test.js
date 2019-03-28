import React from 'react'
import { shallow, mount } from 'enzyme'
import DomainComment from './DomainComment'
import Comment from '../common/Comment'
import BottomCollapseIcon from './BottomCollapseIcon'

const domainDefault = {
  id: '1',
  class: 'domain',
  code: 'BEHEMO',
  under_six: true,
  above_six: false,
  items: [
    {
      under_six_id: '',
      above_six_id: '1',
      code: '1',
      required: true,
      confidential: false,
      rating_type: 'REGULAR',
      rating: -1,
    },
  ],
}
const domainWithComment = {
  ...domainDefault,
  comment: 'Domain test comment',
  domainBottomCollapseClick: jest.fn(),
}

const defaultProps = {
  id: 'commenta',
  title: 'familiaDomain',
  domain: { ...domainDefault },
  onDomainCommentUpdate: () => {},
  domainBottomCollapseClick: jest.fn(),
}

const propsWithComment = {
  id: 'commenta',
  title: 'familiaDomain',
  domain: { ...domainWithComment },
  onDomainCommentUpdate: () => {},
  domainBottomCollapseClick: jest.fn(),
}

const domainCommentDefault = <DomainComment {...defaultProps} />
const domainCommentWithComment = <DomainComment {...propsWithComment} />

describe('<DomainComment />', () => {
  jest.unmock('../../util/assessmentAutoScroll')
  const autoScroll = require.requireActual('../../util/assessmentAutoScroll')
  autoScroll.expandingThenScroll = jest.fn(() => null)
  const expandingThenScroll = autoScroll.expandingThenScroll
  afterEach(() => {
    expandingThenScroll.mockReset()
  })

  it('has a title', async () => {
    const wrapper = mount({ ...domainCommentDefault })
    const foldedText = wrapper.text()
    expect(foldedText).toMatch(/Leave a Comment/)
    const expandedText = wrapper.text()
    expect(expandedText).toMatch(/Leave a Comment/)
  })

  describe('#handleDomainCommentChange()', () => {
    it('should propagate handleDomainCommentChange to onChange Comment prop', () => {
      const onDomainCommentUpdateMock = jest.fn()
      const wrapper = shallow(
        <DomainComment
          id={'commenta'}
          title={'familiaDomain'}
          domain={{ ...domainWithComment }}
          onDomainCommentUpdate={onDomainCommentUpdateMock}
          domainBottomCollapseClick={jest.fn()}
        />
      )
      wrapper.setState({ isExpanded: true })
      wrapper
        .find(Comment)
        .props()
        .onChange('new comment')
      expect(onDomainCommentUpdateMock).toHaveBeenCalledTimes(1)
      expect(onDomainCommentUpdateMock).toHaveBeenCalledWith('BEHEMO', 'new comment', undefined)
    })
  })

  describe('Comment', () => {
    it('should be rendered with a comment in props', () => {
      const wrapper = shallow(domainCommentWithComment)
      wrapper.setState({ isExpanded: true })
      expect(wrapper.find(Comment).props().comment).toBe('Domain test comment')
    })
  })

  describe('Read only mode', () => {
    it('propagates disabled prop to <Comment/>', () => {
      const wrapper = shallow(<DomainComment {...propsWithComment} disabled={true} />)
      wrapper.setState({ isExpanded: true })
      expect(wrapper.find('Comment').prop('disabled')).toBe(true)
    })

    it('will render <BottomCollapseIcon/> with correct props', () => {
      const wrapper = shallow(<DomainComment {...propsWithComment} disabled={true} />)
      const target = wrapper.find(BottomCollapseIcon)
      expect(target.exists()).toBe(true)
      const expectedProps = ['code', 'onClick']
      expect(Object.keys(target.props())).toEqual(expectedProps)
    })
  })
})
