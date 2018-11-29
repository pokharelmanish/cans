import { globalAlertService } from './GlobalAlertService'
import { alertType } from '../components/common/CloseableAlert'

describe('GlobalAlertService', () => {
  describe('Subscribes and posts error', () => {
    it('has default error message', () => {
      let alert
      globalAlertService.subscribe(a => {
        alert = a
      })
      globalAlertService.postError({})
      expect(alert.type).toEqual(alertType.DANGER)
      expect(alert.message).toEqual('An error has occurred')
    })

    it('can use custom message', () => {
      let alert
      globalAlertService.subscribe(a => {
        alert = a
      })
      globalAlertService.postError({ message: 'Some message' })
      expect(alert.type).toEqual(alertType.DANGER)
      expect(alert.message).toEqual('Some message')
    })

    it('posts success message', () => {
      let alert
      globalAlertService.subscribe(a => {
        alert = a
      })
      globalAlertService.postSuccess({ message: 'Success message' })
      expect(alert.type).toEqual(alertType.SUCCESS)
      expect(alert.message).toEqual('Success message')
      expect(alert.isAutoCloseable).toEqual(true)
    })
  })
})
