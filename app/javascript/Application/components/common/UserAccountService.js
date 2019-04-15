import axios from 'axios'
import { handleError } from '../../util/ApiErrorHandler'
import * as SessionStorageUtil from '../../util/sessionStorageUtil'
import pageLockService from './PageLockService'
import { createUrl } from '../../util/navigationUtil'

const logoutUrl = createUrl('user/logout')

class UserAccountService {
  static httpClient = axios.create({
    baseURL: process.env.CANS_BASE_PATH || '/',
    timeout: 15000,
  })

  static cachedUser = null

  static fetchCurrent() {
    this.cachedUser =
      this.cachedUser ||
      this.httpClient
        .get('/user/account')
        .then(response => response.data)
        .catch(handleError)

    return this.cachedUser
  }

  static logout = () => {
    SessionStorageUtil.clearStorage()
    pageLockService.stop()
    window.location.assign(logoutUrl)
  }
}

export default UserAccountService
