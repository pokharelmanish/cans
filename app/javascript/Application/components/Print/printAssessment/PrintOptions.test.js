import React from 'react'
import { mount } from 'enzyme'
import PrintOptions from './PrintOptions'
import CheckedRadio from '../printUtil/CheckedRadio'
import UncheckedRadio from '../printUtil/UncheckedRadio'

const regularFakeProps = {
  item: {
    rating: 3,
    has_na_option: false,
  },
  isRegularType: true,
}

const fakePropsWithNa = {
  item: {
    rating: 8,
    has_na_option: true,
  },
  isRegularType: true,
}

const yesFakeProps = {
  item: {
    rating: 1,
    has_na_option: false,
  },
  isRegularType: false,
}

const noFakeProps = {
  item: {
    rating: 0,
    has_na_option: false,
  },
  isRegularType: false,
}

describe('<PrintOptions />', () => {
  let wrapper
  const getWrapper = props => {
    wrapper = mount(<PrintOptions {...props} />)
  }

  afterEach(() => {
    wrapper.unmount()
  })

  it('will render NA option', () => {
    getWrapper(fakePropsWithNa)
    const target1 = wrapper.find(CheckedRadio)
    const target2 = wrapper.find(UncheckedRadio)
    expect(wrapper.text()).toContain('N/A')
    expect(target1.length).toBe(1)
    expect(target2.length).toBe(4)
  })

  it('will render regular option', () => {
    getWrapper(regularFakeProps)
    const target1 = wrapper.find(CheckedRadio)
    const target2 = wrapper.find(UncheckedRadio)
    expect(wrapper.text()).toContain(3)
    expect(target1.length).toBe(1)
    expect(target2.length).toBe(3)
  })

  it('will render Boolean option Yes', () => {
    getWrapper(yesFakeProps)
    const target1 = wrapper.find(CheckedRadio)
    const target2 = wrapper.find(UncheckedRadio)
    expect(wrapper.text()).toContain('Yes')
    expect(target1.length).toBe(1)
    expect(target2.length).toBe(1)
  })

  it('will render Boolean option No', () => {
    getWrapper(noFakeProps)
    const target1 = wrapper.find(CheckedRadio)
    const target2 = wrapper.find(UncheckedRadio)
    expect(wrapper.text()).toContain('No')
    expect(target1.length).toBe(1)
    expect(target2.length).toBe(1)
  })
})
