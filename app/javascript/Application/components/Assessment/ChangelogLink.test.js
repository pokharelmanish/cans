import React from 'react'
import { shallow } from 'enzyme'
import { Redirect } from 'react-router-dom'
import ChangelogLink from './ChangelogLink'
import { AssessmentStatus } from './AssessmentHelper'

const defaultProps = {
  assessmentId: 1234,
  assessmentStatus: AssessmentStatus.inProgress,
}

const getWrapper = (props = defaultProps) => {
  return shallow(<ChangelogLink {...props} />)
}

describe('ChangelogLink', () => {
  describe('layout', () => {
    let changeLogMenuItem
    beforeEach(() => {
      changeLogMenuItem = getWrapper().find('.view-changelog-link')
    })

    describe('ChangeLog', () => {
      it('renders view changelog item', () => {
        expect(changeLogMenuItem.exists()).toBe(true)
      })

      it('sets the correct props', () => {
        const changeLogMenuItemProps = changeLogMenuItem.props()
        expect(typeof changeLogMenuItemProps.onClick).toBe('function')
      })
    })
  })

  describe('events', () => {
    describe('menu item is clicked', () => {
      describe('Redirect', () => {
        let wrapper
        let changeLogMenuItem

        beforeEach(() => {
          wrapper = getWrapper()
          changeLogMenuItem = wrapper.find('.view-changelog-link')
        })

        it('renders a Redirect component', () => {
          expect(wrapper.find(Redirect).exists()).toBe(false)
          changeLogMenuItem.simulate('click', {
            target: { className: 'view-changelog-link' },
            preventDefault: () => {},
          })
          expect(wrapper.find(Redirect).exists()).toBe(true)
        })

        it('sets the correct props', () => {
          changeLogMenuItem.simulate('click', {
            target: { className: 'view-changelog-link' },
            preventDefault: () => {},
          })
          expect(wrapper.find(Redirect).props().to).toEqual({
            pathname: '1234/changelog/IN_PROGRESS',
          })
          expect(wrapper.state.isDiscardDisabled).toBeFalsy()
        })
      })
    })
  })
})
