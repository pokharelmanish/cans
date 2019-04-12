import React from 'react'
import CompleteAssessmentButton from './CompleteAssessmentButton'

import { shallow } from 'enzyme'

describe('<CompleteAssessmentButton/>', () => {
  const onSubmitMock = jest.fn()
  const render = props => shallow(<CompleteAssessmentButton {...props} />)

  it('renders with props and callback called on click', () => {
    const wrapper = render({ onSubmitAssessment: onSubmitMock })
    wrapper.find('Button').simulate('click')
    expect(onSubmitMock).toHaveBeenCalledTimes(1)
  })

  it('renders disabled button', () => {
    const wrapper = render({ onSubmitAssessment: onSubmitMock, disabled: true })
    expect(wrapper.find('Button').props().disabled).toBe(true)
  })
})
