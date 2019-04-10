import React from 'react'
import { shallow } from 'enzyme'
import BooleanRadioGroup from './BooleanRadioGroup'

describe('BooleanRadioGroup', () => {
  const render = ({
    isDisabled = false,
    legend = 'My Fieldset',
    name = 'noname',
    onChange = () => {},
    onNoClicked,
    onYesClicked,
    value = false,
  } = {}) =>
    shallow(
      <BooleanRadioGroup
        isDisabled={isDisabled}
        legend={legend}
        name={name}
        onChange={onChange}
        onNoClicked={onNoClicked}
        onYesClicked={onYesClicked}
        value={value}
      />
    )

  it('has legend text', () => {
    const wrapper = render({ legend: 'Hello, World' })
    expect(wrapper.find('legend').text()).toBe('Hello, World')
  })

  it('renders yes and no options', () => {
    const radioGroup = render({ name: 'my-input' }).find('RadioGroup')
    expect(radioGroup.find('#my-input-yes').exists()).toBe(true)
    expect(radioGroup.find('#my-input-no').exists()).toBe(true)
  })

  it('selects true when value is true', () => {
    const radioGroup = render({ value: true }).find('RadioGroup')
    expect(radioGroup.props().value).toBe('true')
  })

  it('selects false when value is false', () => {
    const radioGroup = render({ value: false }).find('RadioGroup')
    expect(radioGroup.props().value).toBe('false')
  })

  it('adds radio-checked class to options when checked', () => {
    const radios = render().find('Radio')
    radios.forEach(radio => {
      expect(radio.props().classes.checked).toBe('radio-checked')
    })
  })

  it('calls onChange when group selection changes', () => {
    const onChange = jest.fn()
    const wrapper = render({ onChange })
    const args = { foo: 'bar' }
    wrapper
      .find('RadioGroup')
      .props()
      .onChange(args)
    expect(onChange).toHaveBeenCalledWith(args)
  })

  it('calls onYesClicked when Yes is selected', () => {
    const onYesClicked = jest.fn()
    const wrapper = render({ name: 'my-input', onYesClicked })
    const args = { foo: 'bar' }
    wrapper
      .find('#my-input-yes')
      .props()
      .control.props.onClick(args)
    expect(onYesClicked).toHaveBeenCalledWith(args)
  })

  it('calls onNoClicked when No is selected', () => {
    const onNoClicked = jest.fn()
    const wrapper = render({ name: 'my-input', onNoClicked })
    const args = { foo: 'bar' }
    wrapper
      .find('#my-input-no')
      .props()
      .control.props.onClick(args)
    expect(onNoClicked).toHaveBeenCalledWith(args)
  })

  it('propagates isDisabled prop', () => {
    const wrapper = render({ isDisabled: true })
    expect(wrapper.find('RadioGroup').props().disabled).toBe(true)
  })

  describe('when no click callbacks provided', () => {
    it('quietly does nothing when No is selected', () => {
      expect(() => {
        render({ name: 'my-input' })
          .find('#my-input-no')
          .props()
          .control.props.onClick()
      }).not.toThrow()
    })

    it('quietly does nothing when Yes is selected', () => {
      expect(() => {
        render({ name: 'my-input' })
          .find('#my-input-yes')
          .props()
          .control.props.onClick()
      }).not.toThrow()
    })
  })
})
