import React from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import { UncontrolledTooltip, Button, Icon } from '@cwds/components'
import { shallow, mount } from 'enzyme'
import Domain from './Domain'
import { DomainProgressBar, DomainScore, DomainItemList, DomainCaregiverControls } from './'
import DomainComment from './DomainComment'
import DomainCommentIcon from './DomainCommentIcon'

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

const i18nDefault = {
  _title_: 'Title',
  _description_: 'Description',
}

const domainComponentDefault = (
  <Domain
    key={'1'}
    canReleaseConfidentialInfo={true}
    domain={{ ...domainDefault }}
    isAssessmentUnderSix={true}
    i18n={{ ...i18nDefault }}
    i18nAll={{ a: 'b' }}
    index={1}
    onItemCommentUpdate={() => {}}
    onDomainCommentUpdate={() => {}}
    onExpandedChange={() => {}}
    onRatingUpdate={() => {}}
    onConfidentialityUpdate={() => {}}
    onAddCaregiverDomain={() => {}}
    handleWarningShow={() => {}}
    onCaregiverNameUpdate={() => {}}
    onDomainReviewed={() => {}}
    isCompletedAssessment={false}
  />
)

const testExpandingEvent = {
  type: 'keydown',
  target: {
    getBoundingClientRect: () => {
      return { top: 100 }
    },
  },
}

describe('<Domain />', () => {
  jest.unmock('../../util/assessmentAutoScroll')
  const autoScroll = require.requireActual('../../util/assessmentAutoScroll')
  autoScroll.expandingThenScroll = jest.fn(() => null)
  const expandingThenScroll = autoScroll.expandingThenScroll
  afterEach(() => {
    expandingThenScroll.mockReset()
  })

  it('renders with no exceptions', () => {
    expect(() => shallow(domainComponentDefault)).not.toThrow()
  })

  it('renders DomainScore', () => {
    const wrapper = shallow(domainComponentDefault)
    expect(wrapper.find(DomainScore).length).toBe(1)
  })

  describe('Open to review', () => {
    const onDomainReviewed = jest.fn()
    const div = document.createElement('div')
    document.body.appendChild(div)
    const wrapper = mount(
      <Domain
        key={'1'}
        canReleaseConfidentialInfo={true}
        domain={{ ...domainDefault }}
        isAssessmentUnderSix={true}
        i18n={{ ...i18nDefault }}
        i18nAll={{ a: 'b' }}
        index={1}
        onItemCommentUpdate={() => {}}
        onDomainCommentUpdate={() => {}}
        onRatingUpdate={() => {}}
        onConfidentialityUpdate={() => {}}
        onAddCaregiverDomain={() => {}}
        onExpandedChange={() => {}}
        handleWarningShow={() => {}}
        onCaregiverNameUpdate={() => {}}
        onDomainReviewed={onDomainReviewed}
        isUsingPriorRatings={false}
        isCompletedAssessment={false}
      />,
      { attachTo: div }
    )

    it('renders chevron icon', () => {
      expect(wrapper.find(Icon).exists()).toBe(true)
    })

    it('will render a Icon with rotation 270 when expanded', () => {
      const target = wrapper.find(Icon).at(0)
      expect(target.length).toBe(1)
      expect(target.props().icon).toBe('chevron-down')
      expect(target.props(1).rotation).toEqual(270)
    })

    it('will render toolTip', () => {
      const target = wrapper.find(UncontrolledTooltip)
      expect(target.length).toBe(1)
    })

    it('calls onDomainReviewed when expanded', () => {
      wrapper.instance().handleExpandedChange(testExpandingEvent)
      expect(onDomainReviewed.mock.calls.length).toBe(1)
    })

    it('calls onExpandedChange callback when expand is toggled', () => {
      const handleExpandedChange = jest.fn()
      wrapper.setProps({ onExpandedChange: handleExpandedChange, isExpanded: false })
      wrapper
        .find(ExpansionPanel)
        .props()
        .onChange(testExpandingEvent)
      expect(handleExpandedChange).toHaveBeenCalledWith(1, true)
    })

    it('calls onExpandedChange callback when collapse is toggled', () => {
      const handleExpandedChange = jest.fn()
      wrapper.setProps({ onExpandedChange: handleExpandedChange, isExpanded: true })
      wrapper
        .find(ExpansionPanel)
        .props()
        .onChange(testExpandingEvent)
      expect(handleExpandedChange).toHaveBeenCalledWith(1, false)
    })

    it('can be collapsed from domain comment', () => {
      const handleExpandedChange = jest.fn()
      wrapper.setProps({ onExpandedChange: handleExpandedChange, isExpanded: true })
      wrapper
        .find(DomainComment)
        .props()
        .domainBottomCollapseClick(testExpandingEvent)
      expect(handleExpandedChange).toHaveBeenCalledWith(1, false)
    })

    it('renders ExpandMoreIcon when Open to review button is clicked', () => {
      const wrapper = mount(
        <Domain
          key={'1'}
          canReleaseConfidentialInfo={true}
          domain={{ ...domainDefault }}
          isAssessmentUnderSix={true}
          i18n={{ ...i18nDefault }}
          i18nAll={{ a: 'b' }}
          index={1}
          onItemCommentUpdate={() => {}}
          onDomainCommentUpdate={() => {}}
          onRatingUpdate={() => {}}
          onConfidentialityUpdate={() => {}}
          onAddCaregiverDomain={() => {}}
          onExpandedChange={() => {}}
          handleWarningShow={() => {}}
          onCaregiverNameUpdate={() => {}}
          onDomainReviewed={onDomainReviewed}
          isUsingPriorRatings={true}
          isCompletedAssessment={false}
        />
      )
      wrapper
        .find('ExpansionPanelSummary')
        .find(Button)
        .simulate('click')
      expect(wrapper.find(Icon).exists()).toBe(true)
    })
  })

  it('when domain expands expandingThenScroll will be invoked', () => {
    const wrapper = shallow(domainComponentDefault)
    wrapper.instance().handleExpandedChange(testExpandingEvent)
    expect(expandingThenScroll).toHaveBeenCalledTimes(1)
  })

  it('should propagate onItemCommentUpdate from props to DomainItemList props', () => {
    const onItemCommentUpdateMock = jest.fn()
    const wrapper = shallow(
      <Domain
        key={'1'}
        canReleaseConfidentialInfo={true}
        domain={{ ...domainDefault }}
        isAssessmentUnderSix={true}
        i18n={{ ...i18nDefault }}
        i18nAll={{}}
        index={1}
        onItemCommentUpdate={onItemCommentUpdateMock}
        onDomainCommentUpdate={() => {}}
        onExpandedChange={() => {}}
        onRatingUpdate={() => {}}
        onConfidentialityUpdate={() => {}}
        onAddCaregiverDomain={() => {}}
        handleWarningShow={() => {}}
        onCaregiverNameUpdate={() => {}}
        isCompletedAssessment={false}
      />
    )
    wrapper.setState({ expanded: true })
    expect(wrapper.find(DomainItemList).props().onItemCommentUpdate).toBe(onItemCommentUpdateMock)
  })

  it('should render ItemList when extended', () => {
    const wrapper = shallow(domainComponentDefault)
    wrapper.setProps({ isExpanded: true })
    expect(wrapper.find(DomainItemList).length).toBe(1)
  })

  describe('progress bar', () => {
    it('should render progress bar when folded', () => {
      const wrapper = shallow(domainComponentDefault)
      wrapper.setProps({ isExpanded: false })
      expect(wrapper.find(DomainProgressBar).length).toBe(1)
    })

    it('should render progress bar when extended', () => {
      const wrapper = shallow(domainComponentDefault)
      wrapper.setProps({ isExpanded: true })
      expect(wrapper.find(DomainProgressBar).length).toBe(1)
    })
  })

  describe('DomainComment', () => {
    it('should render domain comment when extended', () => {
      const wrapper = shallow(domainComponentDefault)
      wrapper.setProps({ isExpanded: true })
      expect(wrapper.find(DomainComment).length).toBe(1)
    })

    it('should propogate onDomainCommentUpdate prop to DomainComment props', () => {
      const onDomainCommentUpdateMock = jest.fn()
      const wrapper = shallow(
        <Domain
          key={'1'}
          canReleaseConfidentialInfo={true}
          domain={{ ...domainDefault }}
          isAssessmentUnderSix={true}
          isExpanded={true}
          i18n={{ ...i18nDefault }}
          i18nAll={{}}
          index={1}
          onItemCommentUpdate={() => {}}
          onDomainCommentUpdate={onDomainCommentUpdateMock}
          onExpandedChange={() => {}}
          onRatingUpdate={() => {}}
          onConfidentialityUpdate={() => {}}
          onAddCaregiverDomain={() => {}}
          handleWarningShow={() => {}}
          onCaregiverNameUpdate={() => {}}
          isCompletedAssessment={false}
        />
      )
      expect(wrapper.find(DomainComment).props().onDomainCommentUpdate).toBe(onDomainCommentUpdateMock)
    })

    it('should propogate props domainBottomCollapseClick to DomainComment', () => {
      const wrapper = shallow(
        <Domain
          key={'1'}
          canReleaseConfidentialInfo={true}
          domain={{ ...domainDefault }}
          isAssessmentUnderSix={true}
          isExpanded={true}
          i18n={{ ...i18nDefault }}
          i18nAll={{}}
          index={1}
          onItemCommentUpdate={() => {}}
          onDomainCommentUpdate={() => {}}
          onExpandedChange={() => {}}
          onRatingUpdate={() => {}}
          onConfidentialityUpdate={() => {}}
          onAddCaregiverDomain={() => {}}
          handleWarningShow={() => {}}
          onCaregiverNameUpdate={() => {}}
          isCompletedAssessment={false}
        />
      )
      const target = wrapper.find(DomainComment)
      expect(Object.keys(target.props()).includes('domainBottomCollapseClick')).toBe(true)
    })
  })

  it('renders comment icon on the domain header', () => {
    const wrapper = shallow(domainComponentDefault)
    expect(wrapper.find(DomainCommentIcon).exists()).toBe(true)
  })

  describe('caregiver domain', () => {
    const callbackMock = jest.fn()
    const handleWarningShow = jest.fn()
    const domain = { ...domainDefault, is_caregiver_domain: true, caregiver_index: 'a' }
    const defaultProps = {
      key: '1',
      canReleaseConfidentialInfo: true,
      domain: { ...domain },
      handleWarningShow: handleWarningShow,
      i18n: { ...i18nDefault },
      i18nAll: {},
      index: 1,
      isAssessmentUnderSix: true,
      isCompletedAssessment: false,
      isExpanded: true,
      onAddCaregiverDomain: callbackMock,
      onCaregiverNameUpdate: () => {},
      onConfidentialityUpdate: () => {},
      onDomainCommentUpdate: () => {},
      onExpandedChange: () => {},
      onItemCommentUpdate: () => {},
      onRatingUpdate: () => {},
    }
    const domainComponent = <Domain {...defaultProps} />
    let wrapper
    beforeEach(() => {
      wrapper = mount(domainComponent)
    })

    it('will render DomainCaregiverControls', () => {
      expect(wrapper.find(DomainCaregiverControls).length).toBe(1)
    })

    it('warning modal will show when remove caregiver domain', () => {
      wrapper.instance().handleRemoveCaregiverDomain(testExpandingEvent)
      expect(handleWarningShow.mock.calls.length).toBe(1)
    })

    it('invokes handleWarningShow() callback', () => {
      handleWarningShow.mockReset()
      const domainCaregiverControls = wrapper.find(DomainCaregiverControls).at(0)
      const removeCaregiverButton = domainCaregiverControls.find(Button).at(0)
      removeCaregiverButton.simulate('click')
      removeCaregiverButton.simulate('keypress', {
        key: 'Enter',
      })
      removeCaregiverButton.simulate('keypress', {
        key: 'Space',
      })
      expect(handleWarningShow).toHaveBeenCalledTimes(2)
    })

    it('will invoke onAddCaregiverDomain() callback', () => {
      const domainCaregiverControls = wrapper.find(DomainCaregiverControls).at(0)
      const addCaregiverButton = domainCaregiverControls.find(Button).at(1)
      addCaregiverButton.simulate('click')
      addCaregiverButton.simulate('keypress', {
        key: 'Enter',
      })
      addCaregiverButton.simulate('keypress', {
        key: 'Space',
      })
      expect(callbackMock.mock.calls.length).toBe(2)
    })

    describe('caregiver name', () => {
      describe('#handleCaregiverNameUpdate()', () => {
        describe('when caregiver name is changed', () => {
          it('updates domain header with the updated name', () => {
            // given
            const domain = {
              ...domainDefault,
              is_caregiver_domain: true,
              caregiver_index: 'a',
              caregiver_name: undefined,
            }
            const domainComponent = (
              <Domain
                key={'1'}
                canReleaseConfidentialInfo={true}
                domain={{ ...domain }}
                isAssessmentUnderSix={true}
                isExpanded={true}
                i18n={{ ...i18nDefault }}
                i18nAll={{}}
                index={1}
                onItemCommentUpdate={() => {}}
                onDomainCommentUpdate={() => {}}
                onExpandedChange={() => {}}
                onRatingUpdate={() => {}}
                onConfidentialityUpdate={() => {}}
                onAddCaregiverDomain={() => {}}
                handleWarningShow={() => {}}
                onCaregiverNameUpdate={() => {}}
                isCompletedAssessment={false}
              />
            )
            const wrapper = mount(domainComponent)
            const nameInput = wrapper.find('.caregiver-name').at(0)

            // when
            nameInput.simulate('change', {
              target: { value: 'Full Name' },
            })

            // then
            expect(wrapper.state('caregiverName')).toEqual('Full Name')
            expect(wrapper.find('ExpansionPanelSummary').text()).toMatch(/Full Name/)
          })
        })

        describe('when caregiver name input blurs', () => {
          it('invokes onCaregiverNameUpdate() callback', () => {
            // given
            const domain = {
              ...domainDefault,
              is_caregiver_domain: true,
              caregiver_index: 'a',
              caregiver_name: undefined,
            }
            const callbackMock = jest.fn()
            const domainComponent = (
              <Domain
                key={'1'}
                canReleaseConfidentialInfo={true}
                domain={{ ...domain }}
                isAssessmentUnderSix={true}
                isExpanded={true}
                i18n={{ ...i18nDefault }}
                i18nAll={{}}
                index={1}
                onItemCommentUpdate={() => {}}
                onDomainCommentUpdate={() => {}}
                onExpandedChange={() => {}}
                onRatingUpdate={() => {}}
                onConfidentialityUpdate={() => {}}
                onAddCaregiverDomain={() => {}}
                handleWarningShow={() => {}}
                onCaregiverNameUpdate={callbackMock}
                isCompletedAssessment={false}
              />
            )
            const wrapper = mount(domainComponent)
            const nameInput = wrapper.find('.caregiver-name').at(0)
            nameInput.simulate('change', {
              target: { value: 'Full Name' },
            })

            // when
            nameInput.simulate('blur')

            // then
            expect(callbackMock.mock.calls.length).toBe(1)
            expect(callbackMock.mock.calls[0][0]).toBe('a')
            expect(callbackMock.mock.calls[0][1]).toBe('Full Name')
          })

          it('renders a warning text when no caregiver name is filled', () => {
            const domain = {
              ...domainDefault,
              is_caregiver_domain: true,
              caregiver_index: 'a',
              caregiver_name: undefined,
            }
            const callbackMock = jest.fn()
            const domainComponent = (
              <Domain
                key={'1'}
                canReleaseConfidentialInfo={true}
                domain={{ ...domain }}
                isAssessmentUnderSix={true}
                i18n={{ ...i18nDefault }}
                i18nAll={{}}
                index={1}
                onItemCommentUpdate={() => {}}
                onDomainCommentUpdate={() => {}}
                onExpandedChange={() => {}}
                onRatingUpdate={() => {}}
                onConfidentialityUpdate={() => {}}
                onAddCaregiverDomain={() => {}}
                handleWarningShow={() => {}}
                onCaregiverNameUpdate={callbackMock}
                isCompletedAssessment={false}
              />
            )
            const wrapper = mount(domainComponent)
            const alert = wrapper.find('.caregiver-warning-text')
            expect(alert.exists()).toBe(true)
            expect(alert.text()).toMatch(' Caregiver Name is required')
          })

          it('renders a warning text when caregiver name is blank or whitespace', () => {
            const domain = {
              ...domainDefault,
              is_caregiver_domain: true,
              caregiver_index: 'a',
              caregiver_name: ' ',
            }
            const callbackMock = jest.fn()
            const domainComponent = (
              <Domain
                key={'1'}
                canReleaseConfidentialInfo={true}
                domain={{ ...domain }}
                isAssessmentUnderSix={true}
                i18n={{ ...i18nDefault }}
                i18nAll={{}}
                index={1}
                onItemCommentUpdate={() => {}}
                onDomainCommentUpdate={() => {}}
                onExpandedChange={() => {}}
                onRatingUpdate={() => {}}
                onConfidentialityUpdate={() => {}}
                onAddCaregiverDomain={() => {}}
                handleWarningShow={() => {}}
                onCaregiverNameUpdate={callbackMock}
                isCompletedAssessment={false}
              />
            )
            const wrapper = mount(domainComponent)
            const alert = wrapper.find('.caregiver-warning-text')
            expect(alert.exists()).toBe(true)
            expect(alert.text()).toMatch(' Caregiver Name is required')
          })

          it('warning text is not rendered when caregiver name is filled', () => {
            const domain = {
              ...domainDefault,
              is_caregiver_domain: true,
              caregiver_index: 'a',
              caregiver_name: 'a',
            }
            const callbackMock = jest.fn()
            const domainComponent = (
              <Domain
                key={'1'}
                canReleaseConfidentialInfo={true}
                domain={{ ...domain }}
                isAssessmentUnderSix={true}
                i18n={{ ...i18nDefault }}
                i18nAll={{}}
                index={1}
                onItemCommentUpdate={() => {}}
                onDomainCommentUpdate={() => {}}
                onExpandedChange={() => {}}
                onRatingUpdate={() => {}}
                onConfidentialityUpdate={() => {}}
                onAddCaregiverDomain={() => {}}
                handleWarningShow={() => {}}
                onCaregiverNameUpdate={callbackMock}
                isCompletedAssessment={false}
              />
            )
            const wrapper = mount(domainComponent)
            const alert = wrapper.find('.caregiver-warning-text')
            expect(alert.exists()).toBe(false)
          })
        })
      })
    })
  })

  describe('read only mode', () => {
    const callbackMock = jest.fn()
    const domain = { ...domainDefault, is_caregiver_domain: true, caregiver_index: 'a' }
    const defaultProps = {
      key: '1',
      canReleaseConfidentialInfo: true,
      domain: { ...domain },
      handleWarningShow: () => {},
      i18n: { ...i18nDefault },
      i18nAll: {},
      index: 1,
      isAssessmentUnderSix: true,
      isExpanded: true,
      isCompletedAssessment: false,
      onAddCaregiverDomain: callbackMock,
      onCaregiverNameUpdate: () => {},
      onConfidentialityUpdate: () => {},
      onDomainCommentUpdate: () => {},
      onExpandedChange: () => {},
      onItemCommentUpdate: () => {},
      onRatingUpdate: () => {},
      disabled: true,
    }
    const domainWrapper = shallow(<Domain {...defaultProps} />)

    it('should propagate disabled prop to caregiver-name input', () => {
      expect(domainWrapper.find('.caregiver-name').prop('disabled')).toBe(true)
    })

    it('should propagate disabled prop to <DomainItemList/>', () => {
      expect(domainWrapper.find(DomainItemList).prop('disabled')).toBe(true)
    })

    it('should propagate disabled prop to <DomainComment/>', () => {
      expect(domainWrapper.find('DomainComment').prop('disabled')).toBe(true)
    })

    it('should hide <DomainCaregiverControls/> when disables=true ', () => {
      expect(domainWrapper.find(DomainCaregiverControls).length).toBe(0)
    })
  })

  it('should collapse when isExpanded is false ', () => {
    const onItemCommentUpdateMock = jest.fn()
    const domainWrapper = shallow(
      <Domain
        key={'1'}
        canReleaseConfidentialInfo={true}
        domain={{ ...domainDefault }}
        isAssessmentUnderSix={true}
        isExpanded={false}
        i18n={{ ...i18nDefault }}
        i18nAll={{}}
        index={1}
        onItemCommentUpdate={onItemCommentUpdateMock}
        onDomainCommentUpdate={() => {}}
        onExpandedChange={() => {}}
        onRatingUpdate={() => {}}
        onConfidentialityUpdate={() => {}}
        onAddCaregiverDomain={() => {}}
        handleWarningShow={() => {}}
        onCaregiverNameUpdate={() => {}}
        isCompletedAssessment={false}
      />
    )
    expect(domainWrapper.find(ExpansionPanel).props().expanded).toBe(false)
  })

  it('should expand the domain when isExpanded is true', () => {
    const onItemCommentUpdateMock = jest.fn()
    const domainWrapper = shallow(
      <Domain
        key={'1'}
        canReleaseConfidentialInfo={true}
        domain={{ ...domainDefault }}
        isAssessmentUnderSix={true}
        isExpanded={true}
        i18n={{ ...i18nDefault }}
        i18nAll={{}}
        index={1}
        onItemCommentUpdate={onItemCommentUpdateMock}
        onDomainCommentUpdate={() => {}}
        onExpandedChange={() => {}}
        onRatingUpdate={() => {}}
        onConfidentialityUpdate={() => {}}
        onAddCaregiverDomain={() => {}}
        handleWarningShow={() => {}}
        onCaregiverNameUpdate={() => {}}
        isCompletedAssessment={false}
      />
    )
    expect(domainWrapper.find(ExpansionPanel).props().expanded).toBe(true)
  })
})
