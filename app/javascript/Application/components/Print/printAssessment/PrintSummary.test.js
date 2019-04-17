import React from 'react'
import { mount } from 'enzyme'
import PrintSummary from './PrintSummary'
import PrintSummaryRecord from './PrintSummaryRecord'

describe('<PrintSummary />', () => {
  const i18n = {
    'ANGER_CONTROL._title_': 'Anger Control',
    'SUBSTANCE_USE._title_': 'Substance Use',
  }
  const domains = [
    { code: 'OBI', under_six: true, above_six: true, items: [] },
    { code: 'WAN', under_six: false, above_six: true, items: [] },
    {
      code: 'BEN',
      under_six: false,
      above_six: true,
      items: [
        {
          under_six_id: '',
          above_six_id: '7',
          code: 'ANGER_CONTROL',
          required: true,
          confidential: false,
          confidential_by_default: false,
          rating_type: 'REGULAR',
          has_na_option: false,
          rating: 1,
        },
        {
          under_six_id: '',
          above_six_id: '8',
          code: 'SUBSTANCE_USE',
          required: true,
          confidential: true,
          confidential_by_default: true,
          rating_type: 'REGULAR',
          has_na_option: false,
          rating: 1,
        },
      ],
    },
    {
      code: 'TRM',
      under_six: false,
      above_six: true,
      items: [
        {
          under_six_id: '',
          above_six_id: '7',
          code: 'ANGER_CONTROL',
          required: true,
          confidential: false,
          confidential_by_default: false,
          rating_type: 'REGULAR',
          has_na_option: false,
          rating: 1,
        },
      ],
    },
  ]

  const domainsWithWrongItemCode = [...domains]
  domainsWithWrongItemCode[2].items = [
    {
      under_six_id: '',
      above_six_id: '7',
      code: 'ANGER_CONTROL',
      required: true,
      confidential: false,
      confidential_by_default: false,
      rating_type: 'REGULAR',
      has_na_option: false,
      rating: 1,
    },
  ]

  const render = ({ domains = [], isUnderSix = false } = {}) =>
    mount(
      <PrintSummary domains={domains} i18n={i18n} isUnderSix={isUnderSix} header="some header" footer="some footer" />
    )

  it('will render header props', () => {
    const wrapper = render({ domainsWithWrongItemCode })
    expect(wrapper.text()).toContain('some header')
  })

  it('will render footer props', () => {
    const wrapper = render({ domainsWithWrongItemCode })
    expect(wrapper.text()).toContain('some footer')
  })

  it('will not render item when item.code is wrong', () => {
    const wrapper = render({ domainsWithWrongItemCode })
    const items = wrapper.find('ul>li')
    expect(items.length).toBe(0)
  })

  it('renders assessment summary header', () => {
    const wrapper = render({ domains })
    expect(wrapper.html()).toContain('CANS Summary')
  })

  it('renders assessment summary with four columns', () => {
    const wrapper = render({ domains })
    expect(wrapper.find(PrintSummaryRecord).length).toBe(4)
  })

  it('renders assessment summary Strengths column', () => {
    const wrapper = render({ domains })
    expect(
      wrapper
        .find(PrintSummaryRecord)
        .at(0)
        .props().title
    ).toBe('Strengths')
  })

  describe('renders assessment summary Action Required column', () => {
    const wrapper = render({ domains, isUnderSix: false })
      .find(PrintSummaryRecord)
      .at(1)
    it('with Action Required header', () => {
      expect(wrapper.props().title).toBe('Action Required')
    })

    it('filters confidential items', () => {
      expect(wrapper.html()).not.toContain('Substance Use')
    })

    it('with one item', () => {
      const items = wrapper.find('ul>li')
      expect(items.length).toBe(1)
      expect(items.text()).toBe('Anger Control')
    })
  })

  it('renders assessment summary Immediate Action Required column', () => {
    const wrapper = render({ domains })
    expect(
      wrapper
        .find(PrintSummaryRecord)
        .at(2)
        .props().title
    ).toBe('Immediate Action Required')
  })

  it('renders assessment summary Trauma column with correct content', () => {
    const wrapper = render({ domains })
    const target = wrapper.find(PrintSummaryRecord).at(3)
    expect(target.props().title).toBe('Trauma')
    expect(target.props().items).toContain('Anger Control')
  })
})
