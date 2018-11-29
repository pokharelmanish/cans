import React from 'react'
import BreadCrumbsBuilder from './BreadCrumbsBuilder'
import BreadCrumb from './BreadCrumb'
import { Link } from 'react-router-dom'
import { childInfoJson } from '../../Client/Client.helper.test'
import { shallow } from 'enzyme'
import { navigation } from '../../../util/constants'

const shallowBreadCrumbsBuilder = (navigateTo, url = '') =>
  shallow(<BreadCrumbsBuilder navigateTo={navigateTo} client={childInfoJson} url={url} />)

const diveToBreadCrumb = component => component.find(BreadCrumb).dive()

const assertDashboardCrumbIsPresent = component =>
  expect(diveToBreadCrumb(component).text()).toMatch(/Back to: DASHBOARD/)

const assertHasLinks = (component, linksCount) => expect(diveToBreadCrumb(component).find(Link).length).toBe(linksCount)

const assertLinkNumberMatches = (component, linkNumber, matcher) =>
  expect(
    diveToBreadCrumb(component)
      .find(Link)
      .at(linkNumber)
      .prop('children')
  ).toMatch(matcher)

const assertChildYouthListCrumbIsPresent = component => assertLinkNumberMatches(component, 0, /COUNTY CLIENT LIST/)
const assertClientSearchCrumbIsPresent = component => assertLinkNumberMatches(component, 0, /CLIENT SEARCH/)
const assertChildInfoCrumbIsPresent = component => assertLinkNumberMatches(component, 1, /CHILD, TEST/)
const assertAssessmentChangeLogCrumbIsPresent = component => assertLinkNumberMatches(component, 1, /CANS Change Log/)

describe('bread crumb builder', () => {
  it('builds bread crumbs for CHILD_LIST navigation', () => {
    const component = shallowBreadCrumbsBuilder(navigation.CHILD_LIST)
    assertDashboardCrumbIsPresent(component)
    assertHasLinks(component, 0)
  })

  it('builds bread crumbs for CHILD_PROFILE navigation', () => {
    const component = shallowBreadCrumbsBuilder(navigation.CHILD_PROFILE)
    assertDashboardCrumbIsPresent(component)
    assertHasLinks(component, 1)
    assertChildYouthListCrumbIsPresent(component)
  })

  it('builds bread crumbs for CHILD_PROFILE_ADD navigation', () => {
    const component = shallowBreadCrumbsBuilder(navigation.CHILD_PROFILE_ADD)
    assertDashboardCrumbIsPresent(component)
    assertHasLinks(component, 1)
    assertChildYouthListCrumbIsPresent(component)
  })

  it('builds bread crumbs for CHILD_PROFILE_EDIT navigation', () => {
    const component = shallowBreadCrumbsBuilder(navigation.CHILD_PROFILE_EDIT)
    assertDashboardCrumbIsPresent(component)
    assertHasLinks(component, 2)
    assertChildYouthListCrumbIsPresent(component)
    assertChildInfoCrumbIsPresent(component)
  })

  it('builds bread crumbs for ASSESSMENT_ADD navigation', () => {
    const component = shallowBreadCrumbsBuilder(navigation.ASSESSMENT_ADD)
    assertDashboardCrumbIsPresent(component)
    assertHasLinks(component, 2)
    assertChildYouthListCrumbIsPresent(component)
    assertChildInfoCrumbIsPresent(component)
  })

  it('builds bread crumbs for ASSESSMENT_EDIT navigation', () => {
    const component = shallowBreadCrumbsBuilder(navigation.ASSESSMENT_EDIT)
    assertDashboardCrumbIsPresent(component)
    assertHasLinks(component, 2)
    assertChildYouthListCrumbIsPresent(component)
    assertChildInfoCrumbIsPresent(component)
  })

  describe('when navigate to Assessment and no client info', () => {
    const breadCrumbsBuilder = shallow(<BreadCrumbsBuilder navigateTo={navigation.ASSESSMENT_ADD} client={null} />)
    it('should build bread crumbs without client', () => {
      assertHasLinks(breadCrumbsBuilder, 1)
      assertChildYouthListCrumbIsPresent(breadCrumbsBuilder)
    })
  })

  it('builds bread crumbs for CLIENT_SEARCH navigation', () => {
    const component = shallowBreadCrumbsBuilder(navigation.CLIENT_SEARCH)
    assertDashboardCrumbIsPresent(component)
    assertHasLinks(component, 1)
    assertClientSearchCrumbIsPresent(component)
  })

  it('builds bread crumbs for ASSESSMENT_CHANGELOG navigation', () => {
    const url = '/clients/123/assessments/999/changelog'
    const component = shallowBreadCrumbsBuilder(navigation.ASSESSMENT_CHANGELOG, url)
    assertDashboardCrumbIsPresent(component)
    assertHasLinks(component, 2)
    assertAssessmentChangeLogCrumbIsPresent(component)
  })
})
