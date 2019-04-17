import React from 'react'
import { mount } from 'enzyme'
import {
  assessmentPrint,
  assessmentWithConfidentialItem,
  assessmentWithNoConfidentialItem,
  i18nPrint,
} from '../../Assessment/assessment.mocks.test'
import { getI18nByCode } from '../../common/I18nHelper'
import PrintItem from './PrintItem'
import PrintOptions from './PrintOptions'
import { redactLevels } from './PrintAssessmentHelper'

const fakePropsWithNoConfidentialItem = {
  item: { ...assessmentWithNoConfidentialItem.state.domains[0].items[0] },
  itemI18n: getI18nByCode(i18nPrint, 'PSYCHOSIS'),
  index: 0,
  caregiverIndex: 'some',
  isAssessmentUnderSix: true,
} // normal

const fakePropsWithConfidentialItem = {
  item: { ...assessmentWithConfidentialItem.state.domains[0].items[0] },
  itemI18n: getI18nByCode(i18nPrint, 'PSYCHOSIS'),
  index: 1,
  caregiverIndex: 'another',
  isAssessmentUnderSix: true,
} // confidential

const fakePropsWithDiscretionItem = {
  item: { ...assessmentPrint.state.domains[0].items[0] },
  itemI18n: getI18nByCode(i18nPrint, 'PSYCHOSIS'),
  index: 1,
  caregiverIndex: 'another',
  isAssessmentUnderSix: true,
} // Discretion

describe('<PrintItem />', () => {
  let wrapper
  const getWrapper = props => {
    wrapper = mount(<PrintItem {...props} />)
  }

  afterEach(() => {
    wrapper.unmount()
  })

  it('will render a PrintOptions when the item is neither confidential nor discretion', () => {
    getWrapper(fakePropsWithNoConfidentialItem)
    const target = wrapper.find(PrintOptions)
    expect(fakePropsWithNoConfidentialItem.item.confidential).toBe(false)
    expect(fakePropsWithNoConfidentialItem.item.confidential_by_default).toBe(false)
    expect(target.length).toBe(1)
  })

  it('will render a PrintOptions when redactLevel = doNotRedact and item is confidential', () => {
    getWrapper({ ...fakePropsWithConfidentialItem, redactLevel: redactLevels.doNotRedact })
    const target = wrapper.find(PrintOptions)
    expect(target.length).toBe(1)
  })

  it('will render a PrintOptions when redactLevel = doNotRedact and item is discretion', () => {
    getWrapper({ ...fakePropsWithDiscretionItem, redactLevel: redactLevels.doNotRedact })
    const target = wrapper.find(PrintOptions)
    expect(target.length).toBe(1)
  })

  it('will not render a PrintOptions when redactLevel = confidential and item is confidential', () => {
    getWrapper({ ...fakePropsWithConfidentialItem, redactLevel: redactLevels.confidential })
    const target = wrapper.find(PrintOptions)
    expect(target.length).toBe(0)
  })

  it('will not render a PrintOptions when redactLevel = discretionNeeded and item is discretion', () => {
    getWrapper({ ...fakePropsWithDiscretionItem, redactLevel: redactLevels.discrationNeeded })
    const target = wrapper.find(PrintOptions)
    expect(target.length).toBe(0)
  })

  it('will render a PrintOptions when redactLevel = confidential and item is discretion', () => {
    getWrapper({ ...fakePropsWithDiscretionItem, redactLevel: redactLevels.confidential })
    const target = wrapper.find(PrintOptions)
    expect(target.length).toBe(1)
  })

  it('will render a PrintOptions when redactLevel = discretionNeeded and item is confidential', () => {
    getWrapper({ ...fakePropsWithConfidentialItem, redactLevel: redactLevels.discrationNeeded })
    const target = wrapper.find(PrintOptions)
    expect(target.length).toBe(1)
  })

  it('will render PrintOptions with correct props', () => {
    getWrapper(fakePropsWithNoConfidentialItem)
    const target = wrapper.find(PrintOptions)
    expect(Object.keys(target.props())).toContain('item', 'isRegularType')
  })

  it('will not render a PrintOptions, but will render #confidential# for confidential item', () => {
    getWrapper(fakePropsWithConfidentialItem)
    const target = wrapper.find(PrintOptions)
    expect(fakePropsWithConfidentialItem.item.confidential).toBe(true)
    expect(fakePropsWithConfidentialItem.item.confidential_by_default).toBe(true)
    expect(target.length).toBe(0)
    expect(wrapper.text()).toContain('Confidential')
  })

  it('will not render a PrintOptions, but will render #use Discretion# for discretion checked item', () => {
    getWrapper(fakePropsWithDiscretionItem)
    const target = wrapper.find(PrintOptions)
    expect(fakePropsWithDiscretionItem.item.confidential).toBe(true)
    expect(fakePropsWithDiscretionItem.item.confidential_by_default).toBe(false)
    expect(target.length).toBe(0)
    expect(wrapper.text()).toContain('Use discretion')
  })
})
