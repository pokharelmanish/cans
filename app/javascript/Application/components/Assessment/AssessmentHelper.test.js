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
} from './AssessmentHelper'
import { globalAlertService } from '../../util/GlobalAlertService'
import { clone } from '../../util/common'
import moment from 'moment'

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

const validAssessment = {
  instrument_id: 1,
  person: {
    id: 1,
    dob: '2000-01-01',
  },
  event_date: '2018-06-29',
  completed_as: 'COMMUNIMETRIC',
  can_release_confidential_info: false,
  assessment_type: 'INITIAL',
  status: 'COMPLETED',
  has_caregiver: true,
  state: {
    under_six: false,
    domains: [
      {
        items: [
          {
            under_six_id: 'EC.1',
            above_six_id: '',
            code: 'PSYCHOSIS',
            required: true,
            confidential: false,
            confidential_by_default: true,
            rating_type: 'REGULAR',
            has_na_option: false,
            rating: 2,
          },
          {
            under_six_id: 'EC.2',
            above_six_id: '11',
            code: 'IMPULSIVITY_HYPERACTIVITY',
            required: true,
            confidential: false,
            confidential_by_default: false,
            rating_type: 'REGULAR',
            has_na_option: false,
            rating: 1,
          },
        ],
        id: 1,
        code: 'BEN',
        under_six: true,
        above_six: true,
      },
      {
        items: [
          {
            under_six_id: '',
            above_six_id: '10',
            code: 'FAMILY_FUNCTIONING',
            required: true,
            confidential: false,
            confidential_by_default: false,
            rating_type: 'REGULAR',
            has_na_option: false,
            rating: 1,
          },
          {
            under_six_id: '',
            above_six_id: '11',
            code: 'LIVING_SITUATION',
            required: true,
            confidential: false,
            confidential_by_default: false,
            rating_type: 'REGULAR',
            has_na_option: false,
            rating: 0,
          },
        ],
        id: 2,
        code: 'LFD',
        under_six: false,
        above_six: true,
      },
    ],
  },
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
    it('should initialize all confidential by default items with confidential=true', () => {
      // given
      const assessment = clone(validAssessment)
      expect(assessment.state.domains[0].items[0].confidential).toBe(false)

      // when
      resetConfidentialByDefaultItems(assessment)

      // then
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
})
