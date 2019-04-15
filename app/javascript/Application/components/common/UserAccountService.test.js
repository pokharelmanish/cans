import UserAccountService from './UserAccountService'
import * as SessionStorageUtil from '../../util/sessionStorageUtil'
import pageLockService from './PageLockService'

describe('UserAccountService', () => {
  describe('#fetchCurrent', () => {
    let getSpy

    beforeEach(() => {
      getSpy = jest.spyOn(UserAccountService.httpClient, 'get')
      UserAccountService.cachedUser = null
    })

    afterEach(() => {
      UserAccountService.cachedUser = null
    })

    it('has a timeout of 15 seconds', () => {
      expect(UserAccountService.httpClient.defaults.timeout).toBe(15000)
    })

    it('has a baseUrl of / or /cans', () => {
      expect(UserAccountService.httpClient.defaults.baseURL).toMatch(/(\/|\/cans)/)
    })

    it('calls backend service', () => {
      getSpy.mockReturnValue(Promise.resolve(42))
      expect(getSpy).not.toHaveBeenCalled()
      UserAccountService.fetchCurrent()
      expect(getSpy).toHaveBeenCalledWith('/user/account')
    })

    it('calls the backend service only once, to save time', () => {
      getSpy.mockReturnValue(Promise.resolve(42))
      expect(getSpy).not.toHaveBeenCalled()
      const firstPromise = UserAccountService.fetchCurrent()
      const secondPromise = UserAccountService.fetchCurrent()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(secondPromise).toBe(firstPromise)
    })

    describe('when could not fetch data', () => {
      it('returns empty object', () => {
        getSpy.mockReturnValue(new Promise((resolve, reject) => setTimeout(() => reject(new Error('e')), 0)))
        UserAccountService.fetchCurrent().catch(actualResult => {
          expect(actualResult).toEqual({})
        })
      })
    })
  })

  describe('#logout()', () => {
    it('prepares app and redirects to logout url', () => {
      SessionStorageUtil.clearStorage = jest.fn()
      pageLockService.stop = jest.fn()
      window.location.assign = jest.fn()
      UserAccountService.logout()
      expect(SessionStorageUtil.clearStorage).toHaveBeenCalledTimes(1)
      expect(pageLockService.stop).toHaveBeenCalledTimes(1)
      expect(window.location.assign).toHaveBeenCalledWith('/user/logout')
      expect(window.location.assign).toHaveBeenCalledTimes(1)
    })
  })
})
