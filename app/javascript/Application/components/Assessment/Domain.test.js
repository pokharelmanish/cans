import React from 'react'
import { UncontrolledTooltip } from '@cwds/components'
import { shallow, mount } from 'enzyme'
import Domain from './Domain'
import { DomainProgressBar, DomainScore, DomainItemList, DomainCaregiverControls } from './'
import DomainComment from './DomainComment'
import DomainCommentIcon from './DomainCommentIcon'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

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
        handleWarningShow={() => {}}
        onCaregiverNameUpdate={() => {}}
        onDomainReviewed={onDomainReviewed}
        isUsingPriorRatings={false}
        isCompletedAssessment={false}
      />,
      { attachTo: div }
    )

    it('renders expand icon when isUsingPriorRatings is false', () => {
      expect(wrapper.find(ExpandMoreIcon).exists()).toBe(true)
    })

    it('will render toolTip', () => {
      const target = wrapper.find(UncontrolledTooltip)
      expect(target.length).toBe(1)
    })

    it('calls onDomainReviewed when expanded', () => {
      wrapper.instance().handleExpandedChange(testExpandingEvent)
      expect(onDomainReviewed.mock.calls.length).toBe(1)
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
          handleWarningShow={() => {}}
          onCaregiverNameUpdate={() => {}}
          onDomainReviewed={onDomainReviewed}
          isUsingPriorRatings={true}
          isCompletedAssessment={false}
        />
      )
      wrapper.find('Button#domain1-review').simulate('click')
      expect(wrapper.find(ExpandMoreIcon).exists()).toBe(true)
    })
  })

  it('when domain expands expandingThenScroll will be invoked', () => {
    const wrapper = shallow(domainComponentDefault)
    wrapper.instance().handleExpandedChange(testExpandingEvent)
    expect(wrapper.instance().state.expanded).toEqual(true)
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
    wrapper.instance().handleExpandedChange(testExpandingEvent)
    wrapper.update()
    expect(wrapper.find(DomainItemList).length).toBe(1)
  })

  describe('progress bar', () => {
    it('should render progress bar when folded', () => {
      const wrapper = shallow(domainComponentDefault)
      expect(wrapper.instance().state.expanded).toBeFalsy()
      expect(wrapper.find(DomainProgressBar).length).toBe(1)
    })

    it('should render progress bar when extended', () => {
      const wrapper = shallow(domainComponentDefault)
      wrapper.instance().handleExpandedChange(testExpandingEvent)
      wrapper.update()
      expect(wrapper.instance().state.expanded).toBeTruthy()
      expect(wrapper.find(DomainProgressBar).length).toBe(1)
    })
  })

  describe('DomainComment', () => {
    it('should render domain comment when extended', () => {
      const wrapper = shallow(domainComponentDefault)
      wrapper.instance().handleExpandedChange(testExpandingEvent)
      expect(wrapper.instance().state.expanded).toBeTruthy()
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
          i18n={{ ...i18nDefault }}
          i18nAll={{}}
          index={1}
          onItemCommentUpdate={() => {}}
          onDomainCommentUpdate={onDomainCommentUpdateMock}
          onRatingUpdate={() => {}}
          onConfidentialityUpdate={() => {}}
          onAddCaregiverDomain={() => {}}
          handleWarningShow={() => {}}
          onCaregiverNameUpdate={() => {}}
          isCompletedAssessment={false}
        />
      )
      wrapper.instance().handleExpandedChange(testExpandingEvent)
      expect(wrapper.find(DomainComment).props().onDomainCommentUpdate).toBe(onDomainCommentUpdateMock)
    })

    it('should propogate props domainBottomCollapseClick to DomainComment', () => {
      const wrapper = shallow(
        <Domain
          key={'1'}
          canReleaseConfidentialInfo={true}
          domain={{ ...domainDefault }}
          isAssessmentUnderSix={true}
          i18n={{ ...i18nDefault }}
          i18nAll={{}}
          index={1}
          onItemCommentUpdate={() => {}}
          onDomainCommentUpdate={() => {}}
          onRatingUpdate={() => {}}
          onConfidentialityUpdate={() => {}}
          onAddCaregiverDomain={() => {}}
          handleWarningShow={() => {}}
          onCaregiverNameUpdate={() => {}}
          isCompletedAssessment={false}
        />
      )
      wrapper.instance().handleExpandedChange(testExpandingEvent)
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
      onAddCaregiverDomain: callbackMock,
      onCaregiverNameUpdate: () => {},
      onConfidentialityUpdate: () => {},
      onDomainCommentUpdate: () => {},
      onItemCommentUpdate: () => {},
      onRatingUpdate: () => {},
    }
    const domainComponent = <Domain {...defaultProps} />
    let wrapper
    beforeEach(() => {
      wrapper = mount(domainComponent)
      wrapper.instance().handleExpandedChange(testExpandingEvent)
      wrapper.update()
    })

    it('will render DomainCaregiverControls', () => {
      expect(wrapper.find(DomainCaregiverControls).length).toBe(1)
    })

    it('warning modal will show when remove caregiver domain', () => {
      wrapper.instance().handleRemoveCaregiverDomain(testExpandingEvent)
      expect(handleWarningShow.mock.calls.length).toBe(1)
    })

    it('invokes onRemoveCaregiverDomain() callback', () => {
      const removeCaregiverButton = wrapper.find('Button').at(1)
      removeCaregiverButton.simulate('click')
      removeCaregiverButton.simulate('keypress', {
        key: 'Enter',
      })
      removeCaregiverButton.simulate('keypress', {
        key: 'Space',
      })
      expect(callbackMock.mock.calls.length).toBe(2)
    })

    it('will invoke onAddCaregiverDomain() callback', () => {
      const addCaregiverButton = wrapper.find('div').at(1)
      expect(wrapper.find(DomainCaregiverControls).length).toBe(1)
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
                i18n={{ ...i18nDefault }}
                i18nAll={{}}
                index={1}
                onItemCommentUpdate={() => {}}
                onDomainCommentUpdate={() => {}}
                onRatingUpdate={() => {}}
                onConfidentialityUpdate={() => {}}
                onAddCaregiverDomain={() => {}}
                handleWarningShow={() => {}}
                onCaregiverNameUpdate={() => {}}
                isCompletedAssessment={false}
              />
            )
            const wrapper = mount(domainComponent)
            wrapper.instance().handleExpandedChange(testExpandingEvent)
            wrapper.update()
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
                i18n={{ ...i18nDefault }}
                i18nAll={{}}
                index={1}
                onItemCommentUpdate={() => {}}
                onDomainCommentUpdate={() => {}}
                onRatingUpdate={() => {}}
                onConfidentialityUpdate={() => {}}
                onAddCaregiverDomain={() => {}}
                handleWarningShow={() => {}}
                onCaregiverNameUpdate={callbackMock}
                isCompletedAssessment={false}
              />
            )
            const wrapper = mount(domainComponent)
            wrapper.instance().handleExpandedChange(testExpandingEvent)
            wrapper.update()
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
      isCompletedAssessment: false,
      onAddCaregiverDomain: callbackMock,
      onCaregiverNameUpdate: () => {},
      onConfidentialityUpdate: () => {},
      onDomainCommentUpdate: () => {},
      onItemCommentUpdate: () => {},
      onRatingUpdate: () => {},
      disabled: true,
    }
    const domainWrapper = shallow(<Domain {...defaultProps} />)
    domainWrapper.instance().handleExpandedChange(testExpandingEvent)
    domainWrapper.update()
    domainWrapper.setState({ expanded: true })

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

  describe('#domain panels collapse when expanded is false for all domains ', () => {
    it('should collapse all domains by default when isDefaultExpanded in the assessment is false ', () => {
      const onItemCommentUpdateMock = jest.fn()
      const domainWrapper = shallow(
        <Domain
          key={'1'}
          canReleaseConfidentialInfo={true}
          domain={{ ...domainDefault }}
          isAssessmentUnderSix={true}
          isDefaultExpanded={false}
          i18n={{ ...i18nDefault }}
          i18nAll={{}}
          index={1}
          onItemCommentUpdate={onItemCommentUpdateMock}
          onDomainCommentUpdate={() => {}}
          onRatingUpdate={() => {}}
          onConfidentialityUpdate={() => {}}
          onAddCaregiverDomain={() => {}}
          handleWarningShow={() => {}}
          onCaregiverNameUpdate={() => {}}
          isCompletedAssessment={false}
        />
      )
      expect(domainWrapper.state().expanded).toBe(false)
    })
  })

  describe('#domain panels expand when expanded is true for all domains ', () => {
    it('should expand all domains by since isDefaultExpanded in the assessment is changed to true ', () => {
      const onItemCommentUpdateMock = jest.fn()
      const domainWrapper = shallow(
        <Domain
          key={'1'}
          canReleaseConfidentialInfo={true}
          domain={{ ...domainDefault }}
          isAssessmentUnderSix={true}
          isDefaultExpanded={true}
          i18n={{ ...i18nDefault }}
          i18nAll={{}}
          index={1}
          onItemCommentUpdate={onItemCommentUpdateMock}
          onDomainCommentUpdate={() => {}}
          onRatingUpdate={() => {}}
          onConfidentialityUpdate={() => {}}
          onAddCaregiverDomain={() => {}}
          handleWarningShow={() => {}}
          onCaregiverNameUpdate={() => {}}
          isCompletedAssessment={false}
        />
      )
      expect(domainWrapper.instance().state.expanded).toBe(true)
    })
  })
})
