import { AssessmentService } from './Assessment.service'
import apiEndpoints from '../../App.api'
import { initialAssessment, updatedAssessment } from './assessment.mocks.test'

jest.mock('../../App.api')

describe('AssessmentService', () => {
  describe('#fetch', () => {
    const apiGetSpy = jest.spyOn(apiEndpoints, 'apiGet')

    it('returns assessment', async () => {
      const assessmentId = 50000
      const expectedAssessment = { id: assessmentId }
      apiGetSpy.mockReturnValue(expectedAssessment)
      const actualAssessment = await AssessmentService.fetch(assessmentId)
      expect(actualAssessment).toBe(expectedAssessment)
      expect(apiGetSpy).toHaveBeenCalledTimes(1)
      expect(apiGetSpy).toHaveBeenCalledWith(`/assessments/${assessmentId}`)

      apiGetSpy.mockReset()
    })
  })

  describe('#search', () => {
    const apiPostSpy = jest.spyOn(apiEndpoints, 'apiPost')

    it('returns assessments', async () => {
      const expected = [{ id: '1' }, { id: '2' }]
      apiPostSpy.mockReturnValue(expected)
      const actual = await AssessmentService.search({})
      expect(actual).toBe(expected)
      expect(apiPostSpy).toHaveBeenCalledTimes(1)
      expect(apiPostSpy).toHaveBeenCalledWith('/assessments/_search', {})

      apiPostSpy.mockReset()
    })
  })

  describe('#initializeAssessment', () => {
    const apiGetSpy = jest.spyOn(apiEndpoints, 'apiGet')

    it('gets a new initialized assessment', async () => {
      apiGetSpy.mockReturnValue(initialAssessment)
      const newAssessment = await AssessmentService.initializeAssessment(123)
      expect(newAssessment).toEqual(initialAssessment)
      expect(apiGetSpy).toHaveBeenCalledTimes(1)
      expect(apiGetSpy).toHaveBeenCalledWith(`/clients/123/assessments/_initialize`)

      apiGetSpy.mockReset()
    })
  })

  describe('#update', () => {
    const apiPutSpy = jest.spyOn(apiEndpoints, 'apiPut')

    it('takes an updated assessment and returns it', async () => {
      apiPutSpy.mockReturnValue(updatedAssessment)
      const actualAssessment = await AssessmentService.update(updatedAssessment.id, updatedAssessment)
      expect(actualAssessment).toBe(updatedAssessment)
      expect(apiPutSpy).toHaveBeenCalledTimes(1)
      expect(apiPutSpy).toHaveBeenCalledWith(`/assessments/${updatedAssessment.id}`, updatedAssessment)

      apiPutSpy.mockReset()
    })
  })

  describe('#getLatestInProgress', () => {
    const apiGetSpy = jest.spyOn(apiEndpoints, 'apiGet')

    it('returns assessment', async () => {
      const assessmentId = 50000
      const expectedAssessment = { id: assessmentId }
      apiGetSpy.mockReturnValue(expectedAssessment)
      const actualAssessment = await AssessmentService.getLatestInProgress()
      expect(actualAssessment).toBe(expectedAssessment)
      expect(apiGetSpy).toHaveBeenCalledTimes(1)
      expect(apiGetSpy).toHaveBeenCalledWith('/staff/assessments/latest')

      apiGetSpy.mockReset()
    })
  })

  describe('#postAssessment', () => {
    const apiPostSpy = jest.spyOn(apiEndpoints, 'apiPost')

    it('returns clients', async () => {
      const expectedAssessment = [{ id: 1 }]
      apiPostSpy.mockReturnValue(expectedAssessment)
      const actualAssessment = await AssessmentService.postAssessment({
        instrument_id: 1,
      })
      expect(actualAssessment).toBe(expectedAssessment)
      expect(apiPostSpy).toHaveBeenCalledTimes(1)
      expect(apiPostSpy).toHaveBeenCalledWith('/assessments', {
        instrument_id: 1,
      })

      apiPostSpy.mockReset()
    })
  })

  describe('#delete', () => {
    const apiDeleteSpy = jest.spyOn(apiEndpoints, 'apiDelete')

    it('deletes an assessment', async () => {
      const reason = 'reason'
      const assessmentId = 50000
      await AssessmentService.delete(assessmentId, reason)
      expect(apiDeleteSpy).toHaveBeenCalledTimes(1)
      expect(apiDeleteSpy).toHaveBeenCalledWith(`/assessments/${assessmentId}`, { reason })

      apiDeleteSpy.mockReset()
    })
  })
})
