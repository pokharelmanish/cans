import React from 'react'
import { mount, shallow } from 'enzyme'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import ReviewConfirmation from './ReviewConfirmation'

describe('<ReviewConfirmation />', () => {
  const shallowComponent = ({ isReviewConfirmed = false, onReviewConfirmedChange = jest.fn() }) =>
    shallow(
      <ReviewConfirmation isReviewConfirmed={isReviewConfirmed} onReviewConfirmedChange={onReviewConfirmedChange} />
    )

  const mountComponent = ({ isReviewConfirmed = false, onReviewConfirmedChange = jest.fn() }) =>
    mount(
      <ReviewConfirmation isReviewConfirmed={isReviewConfirmed} onReviewConfirmedChange={onReviewConfirmedChange} />
    )

  it('renders unchecked checkbox', () => {
    const checkbox = mountComponent({ isReviewConfirmed: false }).find(Checkbox)
    expect(checkbox.props().checked).toBeFalsy()
  })

  it('renders checked checkbox', () => {
    const checkbox = mountComponent({ isReviewConfirmed: true }).find(Checkbox)
    expect(checkbox.props().checked).toBeTruthy()
  })

  it('renders confirmation message', () => {
    const controlLabel = shallowComponent({}).find(FormControlLabel)
    expect(controlLabel.props().label).toBe(
      'I confirm that I have reviewed these reassessment ratings and made all necessary adjustments to ensure they are correct for this child.'
    )
  })

  it('invokes onReviewConfirmedChange callback on checkbox change', () => {
    const onReviewConfirmedChangeMock = jest.fn()
    const checkbox = mountComponent({ onReviewConfirmedChange: onReviewConfirmedChangeMock }).find(Checkbox)
    checkbox.props().onChange()
    expect(onReviewConfirmedChangeMock).toHaveBeenCalledWith()
  })
})
