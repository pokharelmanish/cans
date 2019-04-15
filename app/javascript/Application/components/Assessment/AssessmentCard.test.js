import React from 'react'
import { shallow } from 'enzyme'
import { Card, CardBody, CardFooter } from '@cwds/components'
import AssessmentCard from './AssessmentCard'
import Domain from './Domain'
import DomainsHeader from './DomainsHeader'
import { assessment as assessmentMock, i18n as i18nMock } from './assessment.mocks.test'

const mockActions = {
  onRatingUpdate: () => {},
  onItemCommentUpdate: () => {},
  onConfidentialityUpdate: () => {},
  onAddCaregiverDomain: () => {},
  onRemoveCaregiverDomain: () => {},
  onCaregiverNameUpdate: () => {},
  onDomainCommentUpdate: () => {},
  onDomainReviewed: () => {},
  handleWarningShow: () => {},
}
describe('AssessmentCard', () => {
  const render = ({
    disabled = false,
    domainsExpanded = assessmentMock.state.domains.map(domain => ({ domain, isExpanded: false })),
    i18n = i18nMock,
    isCompletedAssessment = false,
    isDomainsReviewed = false,
    isUnderSix = false,
    footer = <div />,
  } = {}) =>
    shallow(
      <AssessmentCard
        actions={mockActions}
        canReleaseConfidentialInfo={false}
        domainsExpanded={domainsExpanded}
        disabled={disabled}
        i18n={i18n}
        isCompletedAssessment={isCompletedAssessment}
        isDomainsReviewed={isDomainsReviewed}
        isUnderSix={isUnderSix}
        isUsingPriorRatings={false}
        footer={footer}
      />
    )

  it('renders a card with header, body, and footer', () => {
    const card = render().find(Card)
    expect(card.exists()).toBe(true)
    expect(card.find(DomainsHeader).exists()).toBe(true)
    expect(card.find(CardBody).exists()).toBe(true)
    expect(card.find(CardFooter).exists()).toBe(true)
  })

  it('renders footer', () => {
    const cardFooter = render({ footer: <div id="footer-impl-mock" /> }).find(CardFooter)
    expect(cardFooter.find('div#footer-impl-mock').exists()).toBe(true)
  })

  it('renders a domain for a mock assessment with one domain', () => {
    const wrapper = render({
      domainsExpanded: assessmentMock.state.domains.map(domain => ({ domain, isExpanded: false })),
    })
    expect(wrapper.find(Domain).length).toBe(1)
  })

  it('propagates disabled prop to <Domain/> component when false', () => {
    const wrapper = render({ disabled: false })
    expect(wrapper.find(Domain).props().disabled).toBe(false)
  })

  it('propagates disabled prop to <Domain/> component when true', () => {
    const wrapper = render({ disabled: true })
    expect(wrapper.find(Domain).props().disabled).toBe(true)
  })
})
