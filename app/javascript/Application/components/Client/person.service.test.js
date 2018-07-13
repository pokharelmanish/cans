import PersonService from './person.service';
import appApi from '../../App.api';

jest.mock('../../App.api');

describe('PersonService', () => {
  describe('#fetch', () => {
    const apiGetSpy = jest.spyOn(appApi, 'get');

    beforeEach(() => {
      apiGetSpy.mockReset();
    });

    it('returns client data', async () => {
      const clientId = 1;
      const mockClientData = { id: clientId, name: 'test user' };
      apiGetSpy.mockReturnValue(Promise.resolve({ data: mockClientData }));
      const clientData = await PersonService.fetch(clientId);
      expect(clientData).toBe(mockClientData);
      expect(apiGetSpy).toHaveBeenCalledTimes(1);
      expect(apiGetSpy).toHaveBeenCalledWith(`/people/${clientId}`);
    });
  });

  describe('#fetchAllClients', () => {
    const apiPostSpy = jest.spyOn(appApi, 'post');

    it('returns clients', async () => {
      const expectedClients = [{ id: 1 }];
      apiPostSpy.mockReturnValue(Promise.resolve({ data: expectedClients }));
      const actualClients = await PersonService.fetchAllClients();
      expect(actualClients).toBe(expectedClients);
      expect(apiPostSpy).toHaveBeenCalledTimes(1);
      expect(apiPostSpy).toHaveBeenCalledWith('/people/_search', {
        person_role: 'CLIENT',
      });
    });
  });
});