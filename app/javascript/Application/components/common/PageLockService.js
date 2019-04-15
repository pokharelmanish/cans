import { createBrowserHistory } from 'history'
import { basePath, getPageRoute } from '../../util/common'

let running = false

class PageLockService {
  // creates react history, sets page unloading confirmation
  // confirmation will be triggered ONLY IF method lock() has been called before
  constructor() {
    this.start()
    this.getUserConfirmation = this.getUserConfirmation.bind(this)
    this.unlock = this.unlock.bind(this)
    this.confirm = this.confirm.bind(this)
    this.cancel = this.cancel.bind(this)
    this.onBeforeUnload = this.onBeforeUnload.bind(this)
    this.onPopState = this.onPopState.bind(this)
    this.lock = this.lock.bind(this)
    this.history = createBrowserHistory({
      basename: basePath,
      forceRefresh: false,
      getUserConfirmation: this.getUserConfirmation,
    })
    window.addEventListener('beforeunload', this.onBeforeUnload)
    window.addEventListener('popstate', this.onPopState)
  }

  start() {
    running = true
  }

  // locks page
  // any attempts to leave the page will cause validation by transitionProcessor(tryAction)
  // can be called anywhere in locked page components sub-tree
  lock(tryAction) {
    if (!running) return
    if (!this.pageLock) {
      this.pageLock = {
        unblock: this.history.block(''),
        tryAction,
        pageUrl: document.location.pathname,
      }
      this.newPath = undefined
    }
  }

  // action could be print, re-routing confirmation, etc...
  // this method is called from components which need confirmation. Ex.: print button
  // if page is not locked then action called immediately
  confirm(action, options = {}) {
    if (!running) return
    if (this.pageLock) {
      this.pageLock.tryAction(action, options)
    } else {
      action()
    }
  }

  // cancels transition
  cancel() {
    if (!running) return
    this.newPath = undefined
  }

  // MUST be called before page component will unmount
  unlock() {
    if (!running) return
    if (this.pageLock) {
      this.pageLock.unblock()
      this.pageLock = undefined
    }
  }

  // processes browser events
  // according to HTML specification those events can not be overridden!!!
  onBeforeUnload(e) {
    if (!running) return e.returnValue
    if (this.pageLock) {
      e.preventDefault()
      return (e.returnValue = '')
    }
    return e.returnValue
  }

  onPopState() {
    if (!running) return
    if (this.pageLock) {
      // postpone history change
      this.newPath = getPageRoute()
      // rollback history change
      window.history.pushState({}, null, this.pageLock.pageUrl)
    }
  }

  getUserConfirmation(message, allowed) {
    if (!running) return
    this.confirm(() => {
      allowed(true)
      if (this.newPath) {
        this.unlock()
        this.history.push(this.newPath)
        this.newPath = undefined
      }
    })
  }

  // this will fully stop the service
  // do not call this function if you are not going to leave the application
  stop() {
    running = false
  }
}

const pageLockService = new PageLockService()
export default pageLockService
