import {
  validateAssessmentForSubmit,
  validateAssessmentEventDate,
  resetConfidentialByDefaultItems,
  shouldDomainBeRendered,
  shouldItemBeRendered,
  AssessmentStatus,
  getActionVerbByStatus,
  getDisplayAssessmentStatus,
  trimUrlForClientProfile,
  postSuccessMessage,
  postInfoMessage,
  successMsgFrom,
  sortAssessments,
  statusTextOfHistory,
  handlePrintButtonEnabled,
  getSubstanceUseItemsIds,
  isSubsequentType,
  AssessmentType,
  hasConfidentialItems,
} from './AssessmentHelper'
import { globalAlertService } from '../../util/GlobalAlertService'
import { clone } from '../../util/common'
import moment from 'moment'
import { validAssessment } from './assessment.mocks.test'

export const assessmentsToSort = [
  {
    id: 1,
    event_date: '2018-10-26',
    created_timestamp: '2018-10-27T15:59:46.930Z',
  },
  {
    id: 2,
    event_date: '2018-10-26',
    created_timestamp: '2018-10-28T15:59:46.930Z',
  },
  {
    id: 3,
    event_date: '2018-10-20',
    created_timestamp: '2018-10-20T15:59:46.930Z',
  },
  {
    id: 4,
    event_date: '2018-10-23',
    created_timestamp: '2018-10-23T20:56:19.684Z',
  },
]

const substanceUseItem8 = {
  under_six_id: '',
  above_six_id: '8',
  code: 'SUBSTANCE_USE',
  required: true,
  confidential: true,
  confidential_by_default: true,
  rating_type: 'REGULAR',
  has_na_option: false,
  rating: -1,
}

const substanceUseItem48 = {
  under_six_id: 'EC41',
  above_six_id: '48',
  code: 'SUBSTANCE_USE_CAREGIVER',
  required: true,
  confidential: true,
  confidential_by_default: true,
  rating_type: 'REGULAR',
  has_na_option: false,
  rating: -1,
}

describe('AssessmentHelper', () => {
  describe('#validateAssessmentForSubmit()', () => {
    describe('invalid state', () => {
      it('returns false when no event_date', () => {
        const assessment = clone(validAssessment)
        assessment.event_date = null
        expect(validateAssessmentForSubmit(assessment)).toBe(false)
        assessment.event_date = ''
        expect(validateAssessmentForSubmit(assessment)).toBe(false)
      })

      it('returns false when event_date is before person.dob', () => {
        const assessment = clone(validAssessment)
        assessment.person.dob = '2019-01-01'
        expect(validateAssessmentForSubmit(assessment)).toBe(false)
      })

      it('returns false when no caregiverName is entered', () => {
        const assessment = clone(validAssessment)
        assessment.state.domains[0].is_caregiver_domain = true
        assessment.state.domains[0].caregiver_name = ''
        expect(validateAssessmentForSubmit(assessment)).toBe(false)
      })

      it('returns true when caregiverName is entered', () => {
        const assessment = clone(validAssessment)
        assessment.state.domains[0].is_caregiver_domain = true
        assessment.state.domains[0].caregiver_name = 'Mike'
        expect(validateAssessmentForSubmit(assessment)).toBe(true)
      })

      it('returns false when no assessment_type', () => {
        const assessment = clone(validAssessment)
        assessment.assessment_type = null
        expect(validateAssessmentForSubmit(assessment)).toBe(false)
        assessment.assessment_type = ''
        expect(validateAssessmentForSubmit(assessment)).toBe(false)
      })

      it('returns false when no completed_as', () => {
        const assessment = clone(validAssessment)
        assessment.completed_as = null
        expect(validateAssessmentForSubmit(assessment)).toBe(false)
        assessment.completed_as = ''
        expect(validateAssessmentForSubmit(assessment)).toBe(false)
      })

      it('returns false when rating is not set for 1 above six item', () => {
        const assessment = clone(validAssessment)
        assessment.state.under_six = true
        assessment.state.domains[0].items[0].rating = -1
        expect(validateAssessmentForSubmit(assessment)).toBe(false)
      })

      it('returns false when rating is not set for 1 under six item', () => {
        const assessment = clone(validAssessment)
        assessment.state.domains[1].items[0].rating = -1
        expect(validateAssessmentForSubmit(assessment)).toBe(false)
      })

      it('returns false when domain is above_six rating is not set for 1 under six item', () => {
        const assessment = clone(validAssessment)
        assessment.state.domains[1].items[0].rating = -1
        expect(validateAssessmentForSubmit(assessment)).toBe(false)
      })
    })

    describe('#validateAssessmentEventDate()', () => {
      it('returns false when no eventDate', () => {
        const actual = validateAssessmentEventDate(moment('2010-10-10'), null)
        expect(actual).toBe(false)
      })

      it('returns true when no dob', () => {
        const actual = validateAssessmentEventDate(null, moment('2010-10-10'))
        expect(actual).toBe(true)
      })

      it('returns false when dob is before eventDate', () => {
        const actual = validateAssessmentEventDate(moment('2010-10-10'), moment('2001-01-01'))
        expect(actual).toBe(false)
      })

      it('returns true when dob is after eventDate', () => {
        const actual = validateAssessmentEventDate(moment('2001-01-01'), moment('2010-10-10'))
        expect(actual).toBe(true)
      })

      it('returns true when dob is same as eventDate', () => {
        const actual = validateAssessmentEventDate(moment('2001-01-01'), moment('2001-01-01'))
        expect(actual).toBe(true)
      })
    })

    describe('valid state', () => {
      it('returns true when valid assessment state', () => {
        const actual = validateAssessmentForSubmit(validAssessment)
        expect(actual).toBe(true)
      })

      it('returns true when domain is above_six but item is under_six and has no rating', () => {
        const assessment = clone(validAssessment)
        assessment.state.domains[0].items[0].rating = -1
        expect(validateAssessmentForSubmit(assessment)).toBe(true)
      })
    })
  })

  describe('#resetConfidentialByDefaultItems()', () => {
    it('should reset all confidential by default items with the value of second parameter', () => {
      // given
      const assessment = clone(validAssessment)
      assessment.state.domains[0].items[0].confidential = true

      // when
      resetConfidentialByDefaultItems(assessment, false)

      // then
      expect(assessment.state.domains[0].items[0].confidential).toBe(false)
      // then
      resetConfidentialByDefaultItems(assessment, true)

      expect(assessment.state.domains[0].items[0].confidential).toBe(true)
    })
  })

  describe('#shouldDomainBeRendered()', () => {
    describe('when domain is under six', () => {
      const domain = { under_six: true }
      it('should return true when the assessment is under six', () => {
        expect(shouldDomainBeRendered(true, domain)).toBeTruthy()
      })

      it('should return false when the assessment is not under six', () => {
        expect(shouldDomainBeRendered(false, domain)).toBeFalsy()
      })

      it('should return false when assessment has no age group selected', () => {
        expect(shouldDomainBeRendered(null, domain)).toBeFalsy()
      })
    })

    describe('when domain is above six', () => {
      const domain = { above_six: true }
      it('should return false when the assessment is under six', () => {
        expect(shouldDomainBeRendered(true, domain)).toBeFalsy()
      })

      it('should return true when the assessment is not under six', () => {
        expect(shouldDomainBeRendered(false, domain)).toBeTruthy()
      })

      it('should return false when assessment has no age group selected', () => {
        expect(shouldDomainBeRendered(null, domain)).toBeFalsy()
      })
    })
  })

  describe('#shouldItemBeRendered()', () => {
    describe('when the item has an under six id', () => {
      const item = { under_six_id: '1' }
      it('should return true when the assessment is under six', () => {
        expect(shouldItemBeRendered(true, item)).toBeTruthy()
      })

      it('should return false when the assessment is not under six', () => {
        expect(shouldItemBeRendered(false, item)).toBeFalsy()
      })
    })

    describe('when the item has an above six id', () => {
      const item = { above_six_id: '1' }
      it('should return false when the assessment is under six', () => {
        expect(shouldItemBeRendered(true, item)).toBeFalsy()
      })

      it('should return true when the assessment is not under six', () => {
        expect(shouldItemBeRendered(false, item)).toBeTruthy()
      })
    })
  })

  describe('#getActionVerbByStatus', () => {
    it('should return "Saved" when the assessment status is IN_PROGRESS', () => {
      expect(getActionVerbByStatus(AssessmentStatus.inProgress)).toEqual('Saved')
    })

    it('should return "Completed" when the assessment status is COMPLETED', () => {
      expect(getActionVerbByStatus(AssessmentStatus.completed)).toEqual('Completed')
    })

    it('should return "Deleted" when the assessment status is DELETED', () => {
      expect(getActionVerbByStatus(AssessmentStatus.deleted)).toEqual('Deleted')
    })

    it('should return "Updated" when the assessment status is not IN_PROGRESS or COMPLETED or DELETED', () => {
      expect(getActionVerbByStatus('updated')).toEqual('Updated')
    })
  })

  describe('#getDisplayAssessmentStatus', () => {
    it('should return "In Progress" when the assessment status is IN_PROGRESS', () => {
      expect(getDisplayAssessmentStatus(AssessmentStatus.inProgress)).toEqual('In Progress')
    })

    it('should return "Completed" when the assessment status is COMPLETED', () => {
      expect(getDisplayAssessmentStatus(AssessmentStatus.completed)).toEqual('Completed')
    })

    it('should return "Deleted" when the assessment status is DELETED', () => {
      expect(getDisplayAssessmentStatus(AssessmentStatus.deleted)).toEqual('Deleted')
    })

    it('should return "Updated" when the assessment status is not IN_PROGRESS or COMPLETED', () => {
      expect(getDisplayAssessmentStatus('updated')).toEqual('Updated')
    })
  })

  describe('Assessment URL trimer serial function', () => {
    const testUrls = ['endpoint1/clients/clientId/assessments/123456', '']

    it('trimUrlForClientProfile', () => {
      const actualValue = trimUrlForClientProfile(testUrls[0])
      const idealValue = 'endpoint1/clients/clientId'
      expect(actualValue).toEqual(idealValue)
    })

    it('postSuccessMessage', () => {
      const actualLinkUrl = trimUrlForClientProfile(testUrls[0])
      const postSuccessSpy = jest.spyOn(globalAlertService, 'postSuccess')
      postSuccessMessage(actualLinkUrl, successMsgFrom.SAVE)
      expect(postSuccessSpy).toHaveBeenCalledTimes(1)
      expect(postSuccessSpy).toHaveBeenCalledWith({
        message: expect.any(Object),
      })
      postSuccessSpy.mockReset()
      postSuccessMessage(actualLinkUrl, successMsgFrom.COMPLETE)
      expect(postSuccessSpy).toHaveBeenCalledTimes(1)
      expect(postSuccessSpy).toHaveBeenCalledWith({
        message: expect.any(Object),
      })
      postSuccessSpy.mockReset()
      postSuccessMessage(actualLinkUrl, 'someOther')
      expect(postSuccessSpy).toHaveBeenCalledTimes(1)
      expect(postSuccessSpy).toHaveBeenCalledWith({ message: 'error' })
      postSuccessSpy.mockReset()
    })
  })

  it('postInfoMessage', () => {
    const postInfoSpy = jest.spyOn(globalAlertService, 'postInfo')
    postInfoMessage({
      message: 'Info Message',
      isAutoCloseable: true,
      componentId: 'cId',
    })
    expect(postInfoSpy).toHaveBeenCalledTimes(1)
    expect(postInfoSpy).toHaveBeenCalledWith({
      message: 'Info Message',
      isAutoCloseable: true,
      componentId: 'cId',
    })
  })

  describe('#sortAssessments()', () => {
    it('sorts assessments by eventDate and createTimestamp descendingly', () => {
      const actual = sortAssessments(assessmentsToSort)
      expect(actual.map(i => i.id)).toEqual([2, 1, 4, 3])
    })

    it('returns empty array for empty input', () => {
      expect(sortAssessments(null)).toEqual([])
      expect(sortAssessments(undefined)).toEqual([])
      expect(sortAssessments([])).toEqual([])
    })
  })

  describe('#statusText(status, isForTable)', () => {
    const status = AssessmentStatus.completed
    const text = getDisplayAssessmentStatus(status)
    it('return null when isForTable equal to true', () => {
      const isForTable = true
      const actual = statusTextOfHistory(text, isForTable)
      expect(actual).toEqual(null)
    })

    it('return text when isForTable equal to false', () => {
      const isForTable = false
      const actual = statusTextOfHistory(status, isForTable)
      expect(actual).toEqual(text)
    })
  })

  describe('handlePrintButtonEnabled', () => {
    it('returns false when age template is undefined', () => {
      const fakeState = {
        assessment: { state: { under_six: undefined } },
        isValidDate: true,
      }
      const actual = handlePrintButtonEnabled(fakeState)
      expect(actual).toEqual(false)
    })

    it('returns true when age template is selected and assessment has a date', () => {
      const fakeState = {
        assessment: { state: { under_six: true } },
        isValidDate: true,
      }
      const actual = handlePrintButtonEnabled(fakeState)
      expect(actual).toEqual(true)
    })

    it('returns false when date is not available', () => {
      const fakeState = {
        assessment: { state: { under_six: undefined } },
        isValidDate: false,
      }
      const actual = handlePrintButtonEnabled(fakeState)
      expect(actual).toEqual(false)
    })
  })

  describe('#isSubsequentType()', () => {
    it('returns true for SUBSEQUENT assessment type', () => {
      expect(isSubsequentType('SUBSEQUENT')).toBeTruthy()
      expect(isSubsequentType(AssessmentType.subsequent)).toBeTruthy()
    })

    it('returns false for other assessment types besides SUBSEQUENT', () => {
      expect(isSubsequentType(AssessmentType.initial)).toBeFalsy()
      expect(isSubsequentType(AssessmentType.annual)).toBeFalsy()
      expect(isSubsequentType(AssessmentType.discharge)).toBeFalsy()
    })

    it('returns false for any other inputs', () => {
      expect(isSubsequentType(undefined)).toBeFalsy()
      expect(isSubsequentType(null)).toBeFalsy()
      expect(isSubsequentType('')).toBeFalsy()
      expect(isSubsequentType('any string')).toBeFalsy()
      expect(isSubsequentType(100)).toBeFalsy()
      expect(isSubsequentType({})).toBeFalsy()
    })
  })

  describe('getSubstanceUseItemsIds', () => {
    it('returns substance use items ids object when valid assessment', () => {
      const assessment = clone(validAssessment)
      assessment.state.domains[0].items.push(substanceUseItem8)
      assessment.state.domains[1].items.push(substanceUseItem48)
      const actual = getSubstanceUseItemsIds(assessment, true)
      expect(actual).toEqual({ underSix: ['1', '41'], aboveSix: ['8', '48'] })
    })
  })

  describe('hasConfidentialItems', () => {
    it('returns false if assessment does not contain confidential items', () => {
      const assessment = clone(validAssessment)
      const item = assessment.state.domains[0].items[0]
      item.confidential = false
      item.confidential_by_default = false
      expect(hasConfidentialItems(assessment)).toBeFalsy()
    })

    it('returns true if assessment does contain confidential items', () => {
      const assessment = clone(validAssessment)
      assessment.state.under_six = true
      const item = assessment.state.domains[0].items[0]
      item.confidential = true
      item.confidential_by_default = false
      expect(hasConfidentialItems(assessment)).toBeTruthy()
    })

    it('returns false if assessment does contain confidential_by_default=true but confidential=false', () => {
      const assessment = clone(validAssessment)
      assessment.state.under_six = true
      const item = assessment.state.domains[0].items[0]
      item.confidential = false
      item.confidential_by_default = true
      expect(hasConfidentialItems(assessment)).toBeFalsy()
    })
  })
})
