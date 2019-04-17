import React from 'react'
import UnsavedDataWarning from './UnsavedDataWarning'
import { shallow } from 'enzyme'
import { Button } from '@cwds/components'
import pageLockService from './PageLockService'

describe('<UnsavedDataWarning />', () => {
  const action = () => {
    return jest.fn(() => {
      return {
        then: fun => {
          fun()
        },
      }
    })
  }

  const warning = (unsaved = false, assessmentId = undefined, savable = true) => {
    return (
      <UnsavedDataWarning
        discardAndContinue={action()}
        saveAndContinue={action()}
        isUnsaved={unsaved}
        isSavable={savable}
        assessmentId={assessmentId}
      />
    )
  }

  const unsavedAssessment = () => {
    const wrapper = shallow(warning(true, undefined))
    wrapper.instance().onPageLeave(() => {}, {})
    return wrapper
  }

  const unsavableAssessment = () => {
    const wrapper = shallow(warning(true, undefined, false))
    wrapper.instance().onPageLeave(() => {}, {})
    return wrapper
  }

  const openWarning = (unsaved = true) => {
    const wrapper = shallow(warning(unsaved, 1234))
    wrapper.instance().onPageLeave(() => {}, {})
    return wrapper
  }

  describe('unsaved data warning presence trigger', () => {
    it('<UnsavedDataWarning /> is present when unsaved assessment validation event is received', () => {
      const wrapper = openWarning()
      expect(wrapper.instance().state.isOpened).toBeTruthy()
    })
  })

  describe('unsaved data warning actions', () => {
    it('"Cancel" button does close warning and closes modal', () => {
      const wrapper = openWarning()
      wrapper.instance().close()
      expect(wrapper.instance().state.isOpened).toBeFalsy()
      expect(wrapper.instance().state.action).toBeUndefined()
    })

    it('page is unlocked when assessment is saved', () => {
      pageLockService.unlock()
      openWarning(false)
      expect(pageLockService.pageLock).toBeUndefined()
    })

    it('page is locked when assessment is unsaved', () => {
      pageLockService.unlock()
      openWarning(true)
      expect(pageLockService.pageLock).toBeDefined()
    })

    it('page is unlocked when warning is unmounted', () => {
      pageLockService.unlock()
      const wrapper = openWarning(true)
      wrapper.instance().componentWillUnmount()
      expect(pageLockService.pageLock).toBeUndefined()
    })
  })

  describe('unsaved data warning buttons', () => {
    it('"Cancel" button does close warning and cancels transition', () => {
      const cancel = jest.spyOn(pageLockService, 'cancel')
      const wrapper = openWarning()
      pageLockService.onPopState()
      wrapper
        .find(Button)
        .at(0)
        .simulate('click')
      expect(wrapper.instance().state.isOpened).toBeFalsy()
      expect(cancel).toHaveBeenCalledTimes(1)
    })

    it('"Save" button does call saveAndContinue and closes modal', () => {
      const wrapper = openWarning()
      wrapper
        .find(Button)
        .at(1)
        .simulate('click')
      expect(wrapper.instance().props.saveAndContinue).toBeCalled()
      expect(wrapper.instance().state.isOpened).toBeFalsy()
    })

    it('"Save" button is disabled for unsavable assessment', () => {
      const wrapper = unsavableAssessment()
      expect(wrapper.find('#unsaved-warning-modal-save').length).toBe(0)
    })

    it('"Save" button is enabled for savable assessment', () => {
      const wrapper = openWarning()
      expect(wrapper.find('#unsaved-warning-modal-save').disabled).toBeFalsy()
    })

    it('"Discard" button does call saveAndContinue and closes modal', () => {
      const wrapper = openWarning()
      wrapper
        .find(Button)
        .at(0)
        .simulate('click')
      expect(wrapper.instance().props.discardAndContinue).toBeCalled()
      expect(wrapper.instance().state.isOpened).toBeFalsy()
    })

    it('should not render discardAndContinue button on a unsaved assessment', () => {
      const wrapper = unsavedAssessment()
      expect(wrapper.state().isAssessmentSaved).toBeFalsy()
    })
  })
})
