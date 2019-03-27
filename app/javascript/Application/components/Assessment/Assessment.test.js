import React from 'react'
import { Assessment, Domain } from './'
import { shallow } from 'enzyme'
import { clone } from '../../util/common'
import { assessment as assessmentMock, i18n as i18nMock } from './assessment.mocks.test'
import * as AHelper from './AssessmentHelper'

const enhanceDomainToCaregiver = domain => ({ ...domain, is_caregiver_domain: true, caregiver_index: 'a' })

describe('<Assessment />', () => {
  const shallowAssessment = ({
    assessment = assessmentMock,
    onAssessmentUpdate = jest.fn(),
    i18n = i18nMock,
    footer = <div id="footer-impl-mock" />,
    disabled = false,
    isDefaultExpanded = false,
  }) =>
    shallow(
      <Assessment
        assessment={assessment}
        onAssessmentUpdate={onAssessmentUpdate}
        i18n={i18n}
        footer={footer}
        disabled={disabled}
        isDefaultExpanded={isDefaultExpanded}
      />
    )

  it('renders footer', () => {
    const cardFooter = shallowAssessment({}).find('CardFooter')
    expect(cardFooter.find('div#footer-impl-mock').exists()).toBeTruthy()
  })

  describe('assessment form with data', () => {
    it('renders with 1 <Domain /> component', () => {
      const wrapper = shallowAssessment({})
      expect(wrapper.find(Domain).length).toBe(1)
    })

    it('propagates disabled props to <Domain/> component', () => {
      const wrapper = shallowAssessment({ disabled: true })
      expect(wrapper.find(Domain).prop('disabled')).toBe(true)
    })
  })

  describe('componentDidUpdate', () => {
    describe('hasCaregiver is true', () => {
      it('should add initial caregiver', () => {
        // given
        const initialAssessment = clone(assessmentMock)
        const updatedAssessment = clone(assessmentMock)
        const mockFn = jest.fn()
        const wrapper = shallowAssessment({ onAssessmentUpdate: mockFn, assessment: initialAssessment })

        // when
        updatedAssessment.has_caregiver = true
        wrapper.setProps({ assessment: updatedAssessment })

        // then
        const finalAssessment = mockFn.mock.calls[0][0]
        expect(finalAssessment.state.domains[0].caregiver_index).toEqual('a')
      })
    })

    describe('hasCaregiver is false', () => {
      it('should remove caregiver domains', () => {
        // given
        const initialAssessment = clone(assessmentMock)
        const updatedAssessment = clone(assessmentMock)
        initialAssessment.has_caregiver = true
        initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
        initialAssessment.state.domains.push({ ...initialAssessment.state.domains[0], caregiver_index: 'b' })
        initialAssessment.state.domains.push({ ...initialAssessment.state.domains[0], caregiver_index: 'c' })
        const mockFn = jest.fn()
        const wrapper = shallowAssessment({ onAssessmentUpdate: mockFn, assessment: initialAssessment })

        // when
        updatedAssessment.has_caregiver = false
        expect(initialAssessment.state.domains.length).toBe(3)
        wrapper.setProps({ assessment: updatedAssessment })

        // then
        const finalAssessment = mockFn.mock.calls[0][0]
        expect(finalAssessment.state.domains.length).toBe(1)
      })
    })
  })

  describe('#updateItem()', () => {
    describe('handleUpdateItem call backs', () => {
      describe('rating', () => {
        it('is invoked when item rating is updated', () => {
          const mockFn = jest.fn()
          const wrapper = shallowAssessment({ onAssessmentUpdate: mockFn })
          expect(assessmentMock.state.domains[0].items[0].rating).toBe(1)
          wrapper.instance().handleUpdateItemRating('1', 2)
          const newAssessment = clone(assessmentMock)
          newAssessment.state.domains[0].items[0].rating = 2
          expect(mockFn).toHaveBeenCalledWith(newAssessment)
        })

        it('is invoked when item rating is updated for caregiver domain', () => {
          // given
          const mockFn = jest.fn()
          const initialAssessment = clone(assessmentMock)
          initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
          const wrapper = shallowAssessment({ onAssessmentUpdate: mockFn, assessment: initialAssessment })

          // when
          expect(initialAssessment.state.domains[0].items[0].rating).toBe(1)
          wrapper.instance().handleUpdateItemRating('1', 2, 'a')

          // then
          const updatedAssessment = clone(assessmentMock)
          updatedAssessment.state.domains[0] = enhanceDomainToCaregiver(updatedAssessment.state.domains[0])
          updatedAssessment.state.domains[0].items[0].rating = 2
          expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
        })
      })

      describe('confidentiality', () => {
        it('is invoked when item confidentiality is updated', () => {
          const mockFn = jest.fn()
          const initialAssessment = clone(assessmentMock)
          const wrapper = shallowAssessment({ onAssessmentUpdate: mockFn, assessment: initialAssessment })
          expect(initialAssessment.state.domains[0].items[3].confidential).toBe(false)
          wrapper.instance().handleUpdateItemConfidentiality('EXPOSURE', true)
          const newAssessment = clone(assessmentMock)
          newAssessment.state.domains[0].items[3].confidential = true
          expect(mockFn).toHaveBeenCalledWith(newAssessment)
        })

        it('is invoked when item confidentiality is updated for caregiver domain', () => {
          // given
          const mockFn = jest.fn()
          const initialAssessment = clone(assessmentMock)
          initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
          const wrapper = shallowAssessment({ onAssessmentUpdate: mockFn, assessment: initialAssessment })

          // when
          expect(initialAssessment.state.domains[0].items[3].confidential).toBe(false)
          wrapper.instance().handleUpdateItemConfidentiality('EXPOSURE', true, 'a')

          // then
          const updatedAssessment = clone(assessmentMock)
          updatedAssessment.state.domains[0] = enhanceDomainToCaregiver(updatedAssessment.state.domains[0])
          updatedAssessment.state.domains[0].items[3].confidential = true
          expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
        })
      })
    })
  })

  describe('#handleUpdateItemComment()', () => {
    it('should be propagated as a onItemCommentUpdate prop for Domain', () => {
      const onAssessmentUpdateMock = jest.fn()
      const wrapper = shallowAssessment({ onAssessmentUpdate: onAssessmentUpdateMock })
      const domains = wrapper.find(Domain)
      domains.forEach(domain => domain.props().onItemCommentUpdate())
      expect(onAssessmentUpdateMock).toHaveBeenCalledTimes(domains.length)
    })
  })

  describe('#updateDomainComment()', () => {
    it('should be propagated as a onDomainCommentUpdate prop for Domain', () => {
      const onAssessmentUpdateMock = jest.fn()
      const wrapper = shallowAssessment({ onAssessmentUpdate: onAssessmentUpdateMock })
      const domains = wrapper.find(Domain)
      domains.forEach(domain => domain.props().onDomainCommentUpdate())
      expect(onAssessmentUpdateMock).toHaveBeenCalledTimes(domains.length)
    })

    it('updates the domain comment when invoked', () => {
      const mockFn = jest.fn()
      const initialAssessment = clone(assessmentMock)
      initialAssessment.state.domains[0] = { ...initialAssessment.state.domains[0], code: 'AGV' }
      const wrapper = shallowAssessment({ onAssessmentUpdate: mockFn, assessment: initialAssessment })
      wrapper.instance().updateDomainComment('AGV', 'a domain comment')
      const updatedAssessment = initialAssessment
      updatedAssessment.state.domains[0] = {
        ...initialAssessment.state.domains[0],
        code: 'AGV',
        comment: 'a domain comment',
      }
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
    })

    it('updates domain comment for caregiver domain when invoked', () => {
      const mockFn = jest.fn()
      const initialAssessment = clone(assessmentMock)
      initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
      const wrapper = shallowAssessment({ onAssessmentUpdate: mockFn, assessment: initialAssessment })
      wrapper.instance().updateDomainComment('123', 'caregiver domain comment', 'a')
      const updatedAssessment = initialAssessment
      updatedAssessment.state.domains[0] = enhanceDomainToCaregiver(updatedAssessment.state.domains[0])
      updatedAssessment.state.domains[0].comment = 'caregiver domain comment'
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
    })
  })

  describe('#updateDomainIsReviewed', () => {
    it('sets using prior ratings to true if assessment has preceding_assessment_id', () => {
      const onAssessmentUpdateMock = jest.fn()
      const initialAssessment = clone(assessmentMock)
      initialAssessment.preceding_assessment_id = '123'
      const wrapper = shallowAssessment({ onAssessmentUpdate: onAssessmentUpdateMock, assessment: initialAssessment })
      const domain = wrapper.find(Domain)
      expect(domain.prop('isUsingPriorRatings')).toBe(true)
    })

    it('sets using prior ratings to false if assessment does not have a preceding_assessment_id', () => {
      const onAssessmentUpdateMock = jest.fn()
      const initialAssessment = clone(assessmentMock)
      const wrapper = shallowAssessment({ onAssessmentUpdate: onAssessmentUpdateMock, assessment: initialAssessment })
      const domain = wrapper.find(Domain)
      expect(initialAssessment.preceding_assessment_id).toBeUndefined()
      expect(domain.prop('isUsingPriorRatings')).toBe(false)
    })

    it('propogates onDomainReviewed prop for Domain', () => {
      const onAssessmentUpdateMock = jest.fn()
      const wrapper = shallowAssessment({ onAssessmentUpdate: onAssessmentUpdateMock })
      const domains = wrapper.find(Domain)
      domains.forEach(domain => domain.props().onDomainReviewed())
      expect(onAssessmentUpdateMock).toHaveBeenCalledTimes(domains.length)
    })

    it('updates the domain is_reviewed when invoked', () => {
      const mockFn = jest.fn()
      const initialAssessment = clone(assessmentMock)
      initialAssessment.state.domains[0] = { ...initialAssessment.state.domains[0], code: 'AGV', caregiver_index: 'a' }
      const wrapper = shallowAssessment({ onAssessmentUpdate: mockFn, assessment: initialAssessment })
      wrapper.instance().updateDomainIsReviewed('AGV', 'a')
      const updatedAssessment = initialAssessment
      updatedAssessment.state.domains[0] = {
        ...initialAssessment.state.domains[0],
        code: 'AGV',
        is_reviewed: true,
      }
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
    })
  })

  describe('#updateCaregiverName()', () => {
    describe('onCareGiverNameUpdate call back', () => {
      it('is invoked when caregiver name is updated', () => {
        // given
        const mockFn = jest.fn()
        const initialAssessment = clone(assessmentMock)
        initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
        const wrapper = shallowAssessment({ onAssessmentUpdate: mockFn, assessment: initialAssessment })
        expect(initialAssessment.state.domains[0].caregiver_name).toBeUndefined()

        // when
        wrapper.instance().updateCaregiverName('a', 'New Name')

        // then
        const updatedAssessment = clone(assessmentMock)
        updatedAssessment.state.domains[0] = enhanceDomainToCaregiver(updatedAssessment.state.domains[0])
        updatedAssessment.state.domains[0].caregiver_name = 'New Name'
        expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
      })
    })
  })

  describe('caregiver domain', () => {
    describe('#addInitialCaregiverDomain', () => {
      it('adds initial caregiver domain to the assessment', () => {
        // given
        const initialAssessment = clone(assessmentMock)
        const mockFn = jest.fn()
        const wrapper = shallowAssessment({ onAssessmentUpdate: mockFn, assessment: initialAssessment })

        // when
        wrapper.instance().addInitialCaregiverDomain()

        // then
        const updatedAssessment = mockFn.mock.calls[0][0]
        expect(updatedAssessment.state.domains[0].caregiver_index).toEqual('a')
      })
    })

    describe('#addCaregiverDomainAfter', () => {
      it('adds initial caregiver domain', () => {
        // given
        const initialAssessment = clone(assessmentMock)
        initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
        const mockFn = jest.fn()
        const wrapper = shallowAssessment({ onAssessmentUpdate: mockFn, assessment: initialAssessment })
        const instance = wrapper.instance()

        // when
        instance.addCaregiverDomainAfter()

        // then
        const updatedAssessment = mockFn.mock.calls[0][0]
        expect(updatedAssessment.state.domains.map(domain => domain.caregiver_index)).toEqual(['a'])
      })

      it('adds additional caregiver domain', () => {
        // given
        const initialAssessment = clone(assessmentMock)
        initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
        const mockFn = jest.fn()
        const wrapper = shallowAssessment({ onAssessmentUpdate: mockFn, assessment: initialAssessment })
        const instance = wrapper.instance()

        // when
        instance.addCaregiverDomainAfter('a')

        // then
        const updatedAssessment = mockFn.mock.calls[0][0]
        expect(updatedAssessment.state.domains.map(domain => domain.caregiver_index)).toEqual(['a', 'b'])
      })
    })

    describe('#removeCaregiverDomain', () => {
      describe('assessment has multiple caregiver domain', () => {
        it('removes the caregiver domain and reset the caregiver indexes', () => {
          // given
          const initialAssessment = clone(assessmentMock)
          initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
          initialAssessment.state.domains.push({ ...initialAssessment.state.domains[0], caregiver_index: 'b' })
          initialAssessment.state.domains.push({ ...initialAssessment.state.domains[0], caregiver_index: 'c' })
          const mockFn = jest.fn()
          const wrapper = shallowAssessment({ onAssessmentUpdate: mockFn, assessment: initialAssessment })
          const instance = wrapper.instance()

          // when
          instance.removeCaregiverDomain('b')

          // then
          const updatedAssessment = mockFn.mock.calls[0][0]
          expect(updatedAssessment.state.domains.map(domain => domain.caregiver_index)).toEqual(['a', 'b'])
        })
      })

      describe('assessment has only one caregiver domain', () => {
        it('removes the caregiver domain and sets hasCaregiver to false', () => {
          const initialAssessment = clone(assessmentMock)
          initialAssessment.has_caregiver = true
          initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
          const mockFn = jest.fn()
          const wrapper = shallowAssessment({ onAssessmentUpdate: mockFn, assessment: initialAssessment })
          const instance = wrapper.instance()

          // when
          instance.removeCaregiverDomain('a')

          // then
          const updatedAssessment = mockFn.mock.calls[0][0]
          expect(updatedAssessment.state.domains.map(domain => domain.caregiver_index).length).toBe(0)
          expect(updatedAssessment.has_caregiver).toBe(false)
        })
      })
    })

    describe('#removeAllCaregiverDomains', () => {
      it('removes all caregiver domains from the domains list', () => {
        // given
        const initialAssessment = clone(assessmentMock)
        initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
        initialAssessment.state.domains.push({ ...initialAssessment.state.domains[0], caregiver_index: 'b' })
        initialAssessment.state.domains.push({ ...initialAssessment.state.domains[0], caregiver_index: 'c' })
        const mockFn = jest.fn()
        const wrapper = shallowAssessment({ onAssessmentUpdate: mockFn, assessment: initialAssessment })

        expect(initialAssessment.state.domains.length).toBe(3)

        // when
        wrapper.instance().removeAllCaregiverDomains()

        // then
        const updatedAssessment = mockFn.mock.calls[0][0]
        expect(updatedAssessment.state.domains.length).toBe(0)
      })
    })
  })

  describe('DomainsHeader', () => {
    it('renders with 1 <DomainsHeader /> component', () => {
      const wrapper = shallowAssessment({})
      expect(wrapper.find('DomainsHeader').length).toBe(1)
    })

    it('sets isDomainsReviewed to true if not using prior assessment ratings', () => {
      const wrapper = shallowAssessment({})
      const domain = wrapper.find('DomainsHeader')
      expect(domain.prop('isDomainsReviewed')).toBe(true)
    })

    it('calls isAllDomainsReviewed if using prior assessment ratings', () => {
      const initialAssessment = { ...assessmentMock, preceding_assessment_id: '123' }
      const domainsReviewedSpy = jest.spyOn(AHelper, 'containsNotReviewedDomains')
      shallowAssessment({ assessment: initialAssessment })
      expect(domainsReviewedSpy).toHaveBeenCalledWith(
        initialAssessment.state.domains,
        initialAssessment.state.under_six
      )
    })

    it('sets isDomainsReviewed prop to isAllDomainsReviewed if using prior assessment ratings', () => {
      const initialAssessment = { ...assessmentMock, preceding_assessment_id: '123' }
      const hasAllDomainsBeenReviewed = !AHelper.containsNotReviewedDomains(
        initialAssessment.state.domains,
        initialAssessment.state.under_six
      )
      const wrapper = shallowAssessment({ assessment: initialAssessment })
      const domain = wrapper.find('DomainsHeader')
      expect(domain.prop('isDomainsReviewed')).toBe(hasAllDomainsBeenReviewed)
    })

    it('passes isDefaultExpanded prop to DomainsHeader', () => {
      const mockFn = jest.fn()
      const assessmentWrapper = shallowAssessment({ onAssessmentUpdate: mockFn, isDefaultExpanded: false })
      const domainHeader = assessmentWrapper.find('DomainsHeader')
      expect(domainHeader.prop('isDefaultExpanded')).toEqual(false)
    })
  })

  describe('Each Domain Key value', () => {
    it('verifies the key value for each domain is false when isDefaultExpanded prop is false', () => {
      const mockFn = jest.fn()
      const assessmentWrapper = shallowAssessment({ onAssessmentUpdate: mockFn, isDefaultExpanded: false })
      const domains = assessmentWrapper.find(Domain)
      domains.forEach(domain => expect(domain.key()).toContain('false'))
    })

    it('verifies the key value for each domain is true when isDefaultExpanded prop is true', () => {
      const mockFn = jest.fn()
      const assessmentWrapper = shallowAssessment({ onAssessmentUpdate: mockFn, isDefaultExpanded: true })
      const domains = assessmentWrapper.find(Domain)
      domains.forEach(domain => expect(domain.key()).toContain('true'))
    })

    it('verifies key value for each domain has isUnderSix of the Assessment', () => {
      const mockFn = jest.fn()
      const assessmentWrapper = shallowAssessment({ onAssessmentUpdate: mockFn, isDefaultExpanded: true })
      const isUnderSix = assessmentMock.state.under_six
      const domains = assessmentWrapper.find(Domain)
      domains.forEach(domain => expect(domain.key()).toContain(isUnderSix))
    })
  })
})
