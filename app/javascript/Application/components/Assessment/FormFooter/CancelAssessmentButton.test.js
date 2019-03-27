import React from 'react'
import { shallow } from 'enzyme'
import CancelAssessmentButton from './CancelAssessmentButton'

describe('<CancelAssessmentButton />', () => {
  const render = (onCancelClick = jest.fn()) => shallow(<CancelAssessmentButton onCancelClick={onCancelClick} />)

  it('renders cancel button', () => {
    const button = render().find('Button')
    expect(button.exists()).toBeTruthy()
    expect(button.children().text()).toBe('Cancel')
  })

  it('invokes onCancelClick callback when button clicked', () => {
    const onCancelClickMock = jest.fn()
    const button = render(onCancelClickMock).find('Button')
    button.simulate('click')
    expect(onCancelClickMock).toHaveBeenCalledWith()
  })
})
