import { AssessmentService } from './assessment.service';

jest.mock('../api');
const ApiService = require('../api').default;

describe('I18nService', () => {
  describe('#fetch', () => {
    const apiGetSpy = jest.spyOn(ApiService, 'get');

    beforeEach(() => {
      apiGetSpy.mockReset();
    });

    it('returns assessment', async () => {
      const assessmentId = 50000;
      const expectedAssessment = { id: assessmentId };
      apiGetSpy.mockReturnValue(Promise.resolve({ data: expectedAssessment }));
      const actualAssessment = await AssessmentService.fetch(assessmentId);
      expect(actualAssessment).toBe(expectedAssessment);
      expect(apiGetSpy).toHaveBeenCalledTimes(1);
      expect(apiGetSpy).toHaveBeenCalledWith(`/assessments/${assessmentId}`);
    });
  });
});
