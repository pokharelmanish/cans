import React from 'react'
import { shallow } from 'enzyme'
import HasCaregiverQuestion from './HasCaregiverQuestion'

describe('<HasCaregiverQuestion />', () => {
  const defaultProps = { hasCaregiver: false, onHasCaregiverChange: () => {}, onHasCaregiverNoClicked: () => {} }
  const render = props => shallow(<HasCaregiverQuestion {...props} />)

  it('renderHasCaregiverQuestion() returns correct label text', () => {
    const wrapper = render(defaultProps)
    expect(wrapper.props().legend).toBe('Child/Youth has Caregiver? *')
  })

  it('selects true when assessment has a caregiver', () => {
    const wrapper = render({ ...defaultProps, hasCaregiver: true })
    expect(wrapper.props().value).toBe(true)
  })

  it('selects false when assessment has no caregiver', () => {
    const wrapper = render({ ...defaultProps, hasCaregiver: false })
    expect(wrapper.props().value).toBe(false)
  })

  it('calls onHasCaregiverChange when group selection changes', () => {
    const onHasCaregiverChange = jest.fn()
    const wrapper = render({ ...defaultProps, onHasCaregiverChange })
    const args = { foo: 'bar' }
    wrapper.props().onChange(args)
    expect(onHasCaregiverChange).toHaveBeenCalledWith(args)
  })

  it('calls onHasCaregiverNoClicked when No is selected', () => {
    const onHasCaregiverNoClicked = jest.fn()
    const wrapper = render({ ...defaultProps, onHasCaregiverNoClicked })
    const args = { foo: 'bar' }
    wrapper.props().onNoClicked(args)
    expect(onHasCaregiverNoClicked).toHaveBeenCalledWith(args)
  })

  it('propagates disabled prop to #has-caregiver', () => {
    const wrapper = render({ ...defaultProps, disabled: true })
    expect(wrapper.props().isDisabled).toEqual(true)
  })

  it('has a message', () => {
    const wrapper = render(defaultProps)
    expect(wrapper.props().message).toBeDefined()
    expect(wrapper.props().message).not.toBe(null)
  })
})
