import { jsDateToIso } from '../../util/dateHelper'
import {
  createRatingsMap,
  prepareReassessment,
  isReassessmentUnderSix,
  buildItemUniqueKey,
  containsNotReviewedDomains,
  hasOneCompletedForReassessment,
  prepareCaregiverDomains,
  prepareItemForReassessment,
} from './ReassessmentHelper'
import { validAssessment } from './assessment.mocks.test'
import { NA_RATING } from './Item/ItemHelper'

describe('ReassessmentHelper', () => {
  describe('#prepareReassessment()', () => {
    it('defaults can_release_confidential_info to false', () => {
      const assessment = {
        can_release_confidential_info: true,
        person: { dob: '2010-01-01' },
        state: { domains: [] },
      }
      const precedingAssessment = { state: { domains: [] } }
      const actual = prepareReassessment(assessment, precedingAssessment, {})
      expect(actual.can_release_confidential_info).toBeFalsy()
    })

    it('defaults under_six by the child age', () => {
      const assessment = {
        person: { dob: '2010-01-01' },
        state: { under_six: true, domains: [] },
      }
      const precedingAssessment = { state: { domains: [] } }
      const actual = prepareReassessment(assessment, precedingAssessment, {})
      expect(actual.state.under_six).toBeFalsy()
    })

    it('removes caregiver domain when preceding assessment has no caregivers', () => {
      const assessment = {
        person: { dob: '2010-01-01' },
        state: { domains: [{ caregiver_index: 'the_domain_will_be_removed' }, { items: [] }] },
      }
      const precedingAssessment = { state: { domains: [] } }
      const actual = prepareReassessment(assessment, precedingAssessment, {})
      expect(actual.state.domains).toEqual([{ items: [] }])
    })

    it('prepares items using previous ratings map', () => {
      const assessment = {
        person: { dob: '2010-01-01' },
        state: {
          caregiver_domain_template: {
            items: [{ code: 'cgv0' }, { code: 'cgv1' }],
          },
          domains: [
            { items: [], caregiver_index: 'the_domain_will_be_replaced_with_template' },
            { items: [{ code: 'code00' }, { code: 'code01' }] },
          ],
        },
      }
      const precedingAssessment = {
        state: {
          domains: [
            {
              is_caregiver_domain: true,
              caregiver_index: 'a',
              caregiver_name: 'the name',
              items: [{ code: 'cgv0', rating: 0 }, { code: 'cgv1', rating: 1 }],
            },
            {
              items: [{ code: 'code00', rating: 2 }, { code: 'code01', rating: 3 }],
            },
          ],
        },
      }
      const previousRatingsMap = {
        cgv0a: { rating: 0 },
        cgv1a: { rating: 1 },
        code00: { rating: 2 },
        code01: { rating: 3 },
      }
      const actual = prepareReassessment(assessment, precedingAssessment, previousRatingsMap)
      const expectedDomains = [
        {
          caregiver_index: 'a',
          caregiver_name: 'the name',
          items: [{ code: 'cgv0', rating: 0 }, { code: 'cgv1', rating: 1 }],
        },
        { items: [{ code: 'code00', rating: 2 }, { code: 'code01', rating: 3 }] },
      ]
      expect(actual.state.domains).toEqual(expectedDomains)
    })
  })

  describe('#isReassessmentUnderSix()', () => {
    it("returns false when child's age is more than 6", () => {
      expect(isReassessmentUnderSix('2010-01-01')).toBeFalsy()
    })

    it('returns true when child is younger than 6', () => {
      expect(isReassessmentUnderSix(jsDateToIso(new Date()))).toBeTruthy()
    })
  })

  describe('#prepareCaregiverDomains()', () => {
    it('removes caregiver domain from reassessment when 0 caregiver domains in preceding assessment', () => {
      const reassessment = {
        has_caregiver: true,
        state: { domains: [{ is_caregiver_domain: true }, { is_caregiver_domain: false }] },
      }
      const precedingAssessment = { state: { domains: [] } }
      const expected = {
        has_caregiver: false,
        state: { domains: [{ is_caregiver_domain: false }] },
      }
      prepareCaregiverDomains(reassessment, precedingAssessment)
      expect(reassessment).toEqual(expected)
    })

    it('prepares caregiver domains for reassessment with 1 caregiver domain in preceding assessment', () => {
      const reassessment = {
        has_caregiver: true,
        state: {
          caregiver_domain_template: { items: [{}, {}] },
          domains: [{ is_caregiver_domain: true }, { is_caregiver_domain: false }],
        },
      }
      const precedingAssessment = {
        state: {
          domains: [
            {
              is_caregiver_domain: true,
              caregiver_index: 'a',
              caregiver_name: 'Caregiver Name',
            },
          ],
        },
      }
      const expected = {
        has_caregiver: true,
        state: {
          caregiver_domain_template: { items: [{}, {}] },
          domains: [
            {
              caregiver_index: 'a',
              caregiver_name: 'Caregiver Name',
              items: [{}, {}],
            },
            {
              is_caregiver_domain: false,
            },
          ],
        },
      }
      prepareCaregiverDomains(reassessment, precedingAssessment)
      expect(reassessment).toEqual(expected)
    })

    it('prepares caregiver domains for reassessment with 2 caregiver domains in preceding assessment', () => {
      const reassessment = {
        has_caregiver: true,
        state: {
          caregiver_domain_template: { items: [{}, {}] },
          domains: [{ is_caregiver_domain: true }, { is_caregiver_domain: false }],
        },
      }
      const precedingAssessment = {
        state: {
          domains: [
            {
              is_caregiver_domain: true,
              caregiver_index: 'a',
              caregiver_name: 'Caregiver Name',
            },
            {
              is_caregiver_domain: true,
              caregiver_index: 'b',
              caregiver_name: 'Caregiver 2 Name',
            },
          ],
        },
      }
      const expected = {
        has_caregiver: true,
        state: {
          caregiver_domain_template: { items: [{}, {}] },
          domains: [
            {
              caregiver_index: 'a',
              caregiver_name: 'Caregiver Name',
              items: [{}, {}],
            },
            {
              caregiver_index: 'b',
              caregiver_name: 'Caregiver 2 Name',
              items: [{}, {}],
            },
            {
              is_caregiver_domain: false,
            },
          ],
        },
      }
      prepareCaregiverDomains(reassessment, precedingAssessment)
      expect(reassessment).toEqual(expected)
    })
  })

  describe('#prepareItemForReassessment()', () => {
    describe('when no previous rating and confidential value', () => {
      it("doesn't change the item", () => {
        const item = { rating: -1, confidential: false }
        const expected = { rating: -1, confidential: false }
        prepareItemForReassessment(item)
        expect(item).toEqual(expected)
      })
    })

    describe('when has previous rating and N/A option', () => {
      describe('and has_na_option = true and rating === 8', () => {
        it('changes rating to default -1', () => {
          const item = { rating: -1, has_na_option: true }
          const previousRatingAndConfidential = { rating: NA_RATING }
          const expected = { rating: -1, has_na_option: true }
          prepareItemForReassessment(item, previousRatingAndConfidential)
          expect(item).toEqual(expected)
        })
      })
    })

    describe('when has previous rating and has confidential value', () => {
      describe('and confidential_by_default = true', () => {
        it('changes rating and defaults confidential to true', () => {
          const item = { rating: -1, confidential: false, confidential_by_default: true }
          const previousRatingAndConfidential = { rating: 3, confidential: false }
          const expected = { rating: 3, confidential: true, confidential_by_default: true }
          prepareItemForReassessment(item, previousRatingAndConfidential)
          expect(item).toEqual(expected)
        })
      })

      describe('and confidential_by_default = false', () => {
        it('changes rating and confidential to previous values', () => {
          const item = { rating: -1, confidential: true, confidential_by_default: false }
          const previousRatingAndConfidential = { rating: 3, confidential: false }
          const expected = { rating: 3, confidential: false, confidential_by_default: false }
          prepareItemForReassessment(item, previousRatingAndConfidential)
          expect(item).toEqual(expected)
        })
      })
    })
  })

  describe('#buildItemUniqueKey()', () => {
    it('build a unique key for item', () => {
      expect(buildItemUniqueKey('code')).toEqual('code')
    })

    it('build a unique key for item with a caregiver index', () => {
      expect(buildItemUniqueKey('code', 'a')).toEqual('codea')
    })
  })

  describe('#createRatingsMap()', () => {
    const domains = [
      {
        under_six: true,
        items: [
          { code: 'code00', rating: 1, confidential: true, under_six_id: 'id00' },
          { code: 'code01', rating: -1, confidential: true, under_six_id: 'id01' },
          { code: 'code02', rating: 2, confidential: true, under_six_id: 'id02' },
        ],
      },
      {
        above_six: true,
        caregiver_index: 'a',
        items: [
          { code: 'code10', rating: 8, confidential: false, above_six_id: 'id10' },
          { code: 'code11', rating: 3, confidential: false, above_six_id: 'id11' },
        ],
      },
    ]

    it('builds ratings and confidential map for under_six = true', () => {
      const expectedRatingsMap = {
        code00: {
          confidential: true,
          rating: 1,
        },
        code01: {
          confidential: true,
          rating: -1,
        },
        code02: {
          confidential: true,
          rating: 2,
        },
      }
      const actualRatingsMap = createRatingsMap({ state: { under_six: true, domains } })
      expect(actualRatingsMap).toEqual(expectedRatingsMap)
    })

    it('builds ratings and confidential map for above_six: true', () => {
      const expectedRatingsMap = {
        code10a: {
          confidential: false,
          rating: 8,
        },
        code11a: {
          confidential: false,
          rating: 3,
        },
      }
      const actualRatingsMap = createRatingsMap({ state: { under_six: false, domains } })
      expect(actualRatingsMap).toEqual(expectedRatingsMap)
    })
  })

  describe('#containsNotReviewedDomains()', () => {
    it('returns true when there is at least ont not reviewed domain in the requested age group', () => {
      const domains = [
        { under_six: true, is_reviewed: true },
        { under_six: true, is_reviewed: false },
        { under_six: false, is_reviewed: true },
      ]
      expect(containsNotReviewedDomains(domains, true)).toBeTruthy()
    })

    it('returns false when all the domains in the requested age group are reviewed', () => {
      const domains = [
        { under_six: true, is_reviewed: true },
        { under_six: true, is_reviewed: true },
        { under_six: false, is_reviewed: false },
      ]
      expect(containsNotReviewedDomains(domains, true)).toBeFalsy()
    })
  })

  describe('#hasOneCompletedForReassessment', () => {
    const clientCaseReferralNumber = '123'
    it('returns true if has a completed assessment for the same case or referral number', () => {
      expect(
        hasOneCompletedForReassessment(
          [{ ...validAssessment, service_source_id: '123' }, { ...validAssessment, status: 'IN_PROGRESS' }],
          clientCaseReferralNumber
        )
      ).toBeTruthy()
    })

    it('returns false if does not have a completed assessment for the same case or referral number', () => {
      expect(
        hasOneCompletedForReassessment(
          [
            { ...validAssessment, service_source_id: '567' },
            { ...validAssessment, status: 'IN_PROGRESS', service_source_id: '123' },
          ],
          clientCaseReferralNumber
        )
      ).toBeFalsy()
    })

    it('returns false if assessments collection or client case/referral number is empty, null or undefined', () => {
      expect(hasOneCompletedForReassessment([], '')).toBeFalsy()
      expect(hasOneCompletedForReassessment([])).toBeFalsy()
      expect(hasOneCompletedForReassessment([], null)).toBeFalsy()
      expect(hasOneCompletedForReassessment([], undefined)).toBeFalsy()
      expect(hasOneCompletedForReassessment(null, '')).toBeFalsy()
      expect(hasOneCompletedForReassessment(null, undefined)).toBeFalsy()
      expect(hasOneCompletedForReassessment(null, null)).toBeFalsy()
      expect(hasOneCompletedForReassessment(undefined)).toBeFalsy()
      expect(hasOneCompletedForReassessment(undefined, undefined)).toBeFalsy()
      expect(hasOneCompletedForReassessment(undefined, null)).toBeFalsy()
    })
  })
})
