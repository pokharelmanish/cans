import ClientService from './Client.service'
import apiEndpoints from '../../App.api'

jest.mock('../../App.api')

describe('ClientService', () => {
  describe('#fetch', () => {
    const apiGetSpy = jest.spyOn(apiEndpoints, 'apiGet')

    beforeEach(() => {
      apiGetSpy.mockReset()
    })

    it('returns client data', async () => {
      const clientId = 1
      const mockClientData = { id: clientId, name: 'test user' }
      apiGetSpy.mockReturnValue(mockClientData)
      const clientData = await ClientService.fetch(clientId)
      expect(clientData).toBe(mockClientData)
      expect(apiGetSpy).toHaveBeenCalledTimes(1)
      expect(apiGetSpy).toHaveBeenCalledWith(`/clients/${clientId}`)
    })
  })

  describe('#getAssessmentComparison', () => {
    const apiGetSpy = jest.spyOn(apiEndpoints, 'apiGet')

    beforeEach(() => {
      apiGetSpy.mockReset()
    })

    it('returns assessment comparison data', async () => {
      const clientId = 1
      const mockComparisonData = { event_dates: ['someDates'], domains: ['someDomains'] }
      apiGetSpy.mockReturnValue(mockComparisonData)
      const assessmentComparisonData = await ClientService.getAssessmentComparison(clientId)
      expect(assessmentComparisonData).toBe(mockComparisonData)
      expect(apiGetSpy).toHaveBeenCalledTimes(1)
      expect(apiGetSpy).toHaveBeenCalledWith(`/clients/${clientId}/assessment_comparison`)
    })
  })

  describe('#addClient', () => {
    const apiGetSpy = jest.spyOn(apiEndpoints, 'apiPost')

    beforeEach(() => {
      apiGetSpy.mockReset()
    })

    it('posts ChildInfo Object', async () => {
      const childInfo = {}
      const expectedChildForm = `/people`
      apiGetSpy.mockReturnValue(`/people`)
      const actualChildForm = await ClientService.addClient(childInfo)
      expect(actualChildForm).toBe(expectedChildForm)
      expect(apiGetSpy).toHaveBeenCalledTimes(1)
      expect(apiGetSpy).toHaveBeenCalledWith(`/people`, {})
    })
  })

  describe('#updateClient', () => {
    const apiGetSpy = jest.spyOn(apiEndpoints, 'apiPut')

    beforeEach(() => {
      apiGetSpy.mockReset()
    })

    it('Updates ChildInfo Object', async () => {
      const childInfo = {}
      const childId = 1
      const expectedChildForm = `/people`
      apiGetSpy.mockReturnValue(`/people`)
      const actualChildForm = await ClientService.updateClient(childId, childInfo)
      expect(actualChildForm).toBe(expectedChildForm)
      expect(apiGetSpy).toHaveBeenCalledTimes(1)
      expect(apiGetSpy).toHaveBeenCalledWith(`/people/1`, {})
    })
  })

  describe('#search()', () => {
    const apiPostSpy = jest.spyOn(apiEndpoints, 'apiPost')

    beforeEach(() => {
      apiPostSpy.mockReset()
    })

    it('should invoke App.api with correct params', async () => {
      // given
      const inputParam = {
        firstName: 'First',
        middleName: 'Middle',
        lastName: 'Last',
        dob: '10/10/2011',
        pagination: { page: 0, pageSize: 10, pages: 1 },
      }

      // when
      ClientService.search(inputParam)

      // then
      expect(apiPostSpy).toHaveBeenCalledTimes(1)
      const expectedParam = {
        first_name: 'First',
        last_name: 'Last',
        middle_name: 'Middle',
        dob: '10/10/2011',
        person_role: 'CLIENT',
        pagination: { page: 0, page_size: 10 },
      }
      expect(apiPostSpy).toHaveBeenCalledWith('/people/_search', expectedParam)
    })
  })
})
