import React from 'react'
import { mount } from 'enzyme'
import DomainCaregiverControls from './DomainCaregiverControls'

describe('<DomainCaregiverControls/>', () => {
  const fakeDCCProps = {
    onAddCaregiverDomain: jest.fn(),
    onRemoveCaregiverDomain: jest.fn(),
  }

  let wrapper
  beforeEach(() => {
    wrapper = mount(<DomainCaregiverControls {...fakeDCCProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('first Button have text # - Remove Caregiver #', () => {
    expect(
      wrapper
        .find('#caregiver-domain-remove')
        .at(0)
        .text()
    ).toBe('- Remove Caregiver')
  })

  it('second Button have text # + Add Caregiver #', () => {
    expect(
      wrapper
        .find('#caregiver-domain-add')
        .at(1)
        .text()
    ).toBe('+ Add Caregiver')
  })

  it('will invoke onRemoveCaregiverDomain when first button is clicked', () => {
    wrapper
      .find('#caregiver-domain-remove')
      .at(0)
      .simulate('click')
    expect(wrapper.props().onRemoveCaregiverDomain).toHaveBeenCalledTimes(1)
  })

  it('will invoke onRemoveCaregiverDomain when first Button have key pressed', () => {
    wrapper
      .find('#caregiver-domain-remove')
      .at(0)
      .simulate('keyPress')
    expect(wrapper.props().onRemoveCaregiverDomain).toHaveBeenCalledTimes(2)
  })

  it('will invoke onAddCaregiverDomain when second Button is clicked', () => {
    wrapper
      .find('#caregiver-domain-add')
      .at(1)
      .simulate('click')
    expect(wrapper.props().onAddCaregiverDomain).toHaveBeenCalledTimes(1)
  })

  it('will invoke onAddCaregiverDomain when second Button have key pressed', () => {
    wrapper
      .find('#caregiver-domain-add')
      .at(1)
      .simulate('keyPress')
    expect(wrapper.props().onAddCaregiverDomain).toHaveBeenCalledTimes(2)
  })

  it('will invoke onAddCaregiverDomain when second Button have key pressed for second time', () => {
    wrapper
      .find('#caregiver-domain-add')
      .at(1)
      .simulate('keyPress')
    expect(wrapper.props().onAddCaregiverDomain).toHaveBeenCalledTimes(3)
  })
})
