import React from 'react'
import { mount, shallow } from 'enzyme'
import {
  assessment,
  assessmentWithConfidentialItem,
  assessmentWithDiscretionNeededItem,
  assessmentWithNoConfidentialItem,
  i18nPrint,
} from '../../Assessment/assessment.mocks.test'
import { getI18nByCode } from '../../common/I18nHelper'
import PrintDomain from './PrintDomain'
import PrintItem from './PrintItem'
import PrintDomainHeader from './PrintDomainHeader'
import PrintDomainCommentHeader from './PrintDomainCommentHeader'
import { redactLevels } from './PrintAssessmentHelper'
const fakePropsWithNoConfidentialItem = {
  domain: { ...assessmentWithNoConfidentialItem.state.domains[0] },
  domainI18n: getI18nByCode(i18nPrint, 'BEN'),
  i18n: i18nPrint,
  isAssessmentUnderSix: false,
}

const fakePropsWithConfidentialItem = {
  domain: { ...assessmentWithConfidentialItem.state.domains[0] },
  domainI18n: getI18nByCode(i18nPrint, 'BEN'),
  i18n: i18nPrint,
  isAssessmentUnderSix: false,
}

const fakePropsWithoutComment = {
  domain: { ...assessment.state.domains[0] },
  domainI18n: getI18nByCode(i18nPrint, 'BEN'),
  i18n: i18nPrint,
  isAssessmentUnderSix: false,
}
const fakePropsWithDiscretionNeededItem = {
  domain: { ...assessmentWithDiscretionNeededItem.state.domains[0] },
  domainI18n: getI18nByCode(i18nPrint, 'BEN'),
  i18n: i18nPrint,
  isAssessmentUnderSix: false,
}

describe('<PrintDomain />', () => {
  let wrapper
  const getWrapper = props => {
    wrapper = mount(<PrintDomain {...props} />)
  }

  it('will render a PrintDomainHeader with correct props', () => {
    getWrapper(fakePropsWithNoConfidentialItem)
    const target = wrapper.find(PrintDomainHeader)
    expect(target.length).toBe(1)
    expect(Object.keys(target.props())).toContain('text', 'total')
    wrapper.unmount()
  })

  it('will render PrintItem with correct props', () => {
    getWrapper(fakePropsWithNoConfidentialItem)
    const target = wrapper.find(PrintItem)
    expect(target.length).toBeGreaterThan(0)
    expect(Object.keys(target.at(0).props())).toContain(
      'item',
      'index',
      'caregiverIndex',
      'itemI18n',
      'isAssessmentUnderSix',
      'isItemHidden',
      'redactLevel'
    )
    wrapper.unmount()
  })

  it('will render PrintDomainCommentHeader with correct props when does not have confidential items', () => {
    getWrapper(fakePropsWithNoConfidentialItem)
    const target = wrapper.find(PrintDomainCommentHeader)
    expect(target.length).toBe(1)
    expect(Object.keys(target.props())).toContain('text', 'remark')
    wrapper.unmount()
  })

  it('will render PrintDomainCommentHeader without remark when has comment', () => {
    getWrapper(fakePropsWithNoConfidentialItem)
    expect(fakePropsWithNoConfidentialItem.domain.comment.length).toBeGreaterThan(0)
    const target = wrapper.find(PrintDomainCommentHeader)
    expect(target.length).toBe(1)
    expect(target.props().remark).toEqual('')
    wrapper.unmount()
  })

  it('will render PrintDomainCommentHeader with remark #None# when has not comment', () => {
    getWrapper(fakePropsWithoutComment)
    expect(fakePropsWithoutComment.domain.comment).toBe(undefined)
    const target = wrapper.find(PrintDomainCommentHeader)
    expect(target.length).toBe(1)
    expect(target.props().remark).toEqual('None')
    wrapper.unmount()
  })

  it('will not render domain comment when have confidential items', () => {
    getWrapper(fakePropsWithConfidentialItem)
    const target = wrapper.find('#domain-comment')
    expect(target.length).toBe(0)
    wrapper.unmount()
  })

  describe('#getTotalScore', () => {
    const render = props => {
      return shallow(<PrintDomain {...props} />)
    }

    it('returns Confidential when redactLevel = all and domain has confidential item ', () => {
      getWrapper(fakePropsWithConfidentialItem)
      const target = wrapper.find(PrintDomainHeader)
      expect(target.props().total).toEqual('Confidential')
      wrapper.unmount()
    })

    it('returns Confidential when redactLevel = confidential and domain has confidential item ', () => {
      const target = render({ redactLevel: redactLevels.confidential, ...fakePropsWithConfidentialItem }).find(
        PrintDomainHeader
      )
      expect(target.props().total).toEqual('Confidential')
    })

    it('returns score when redactLevel = confidential and domain does not have confidential item ', () => {
      expect(
        render({ redactLevel: redactLevels.confidential, ...fakePropsWithNoConfidentialItem })
          .find(PrintDomainHeader)
          .props().total
      ).toBe(1)

      expect(
        render({ redactLevel: redactLevels.confidential, ...fakePropsWithDiscretionNeededItem })
          .find(PrintDomainHeader)
          .props().total
      ).toBe(1)
    })

    it('returns Discretion Needed when redactLevel = all and domain has Discretion Needed item ', () => {
      const target = render({ ...fakePropsWithDiscretionNeededItem }).find(PrintDomainHeader)
      expect(target.props().total).toEqual('Discretion Needed')
    })

    it('returns Discretion Needed when redactLevel = discretionNeeded and domain has discretionNeeded item ', () => {
      const target = render({ redactLevel: redactLevels.discrationNeeded, ...fakePropsWithDiscretionNeededItem }).find(
        PrintDomainHeader
      )
      expect(target.props().total).toEqual('Discretion Needed')
    })

    it('returns score when redactLevel = discretionNeeded and domain does not have discretionNeeded item ', () => {
      expect(
        render({ redactLevel: redactLevels.discrationNeeded, ...fakePropsWithNoConfidentialItem })
          .find(PrintDomainHeader)
          .props().total
      ).toBe(1)

      expect(
        render({ redactLevel: redactLevels.discrationNeeded, ...fakePropsWithConfidentialItem })
          .find(PrintDomainHeader)
          .props().total
      ).toBe(1)
    })

    it('returns score when redactLevel = doNotRedact and domain does have confidential item ', () => {
      expect(
        render({ redactLevel: redactLevels.doNotRedact, ...fakePropsWithConfidentialItem })
          .find(PrintDomainHeader)
          .props().total
      ).toBe(1)

      expect(
        render({ redactLevel: redactLevels.doNotRedact, ...fakePropsWithDiscretionNeededItem })
          .find(PrintDomainHeader)
          .props().total
      ).toBe(1)
    })
  })
})
