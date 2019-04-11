import React from 'react'
import { mount, shallow } from 'enzyme'
import { i18n } from './DomainHelper.test'
import SummaryGrid from './SummaryGrid'
import DataGridHeader from '../../common/DataGridHeader'
import ImmediateActionRequiredSummary from './ImmediateActionRequiredSummary'
import { BrowserRouter } from 'react-router-dom'

describe('<ImmediateActionRequiredSummary />', () => {
  it('renders a data grid', () => {
    expect(
      shallow(<ImmediateActionRequiredSummary i18n={i18n} />)
        .find(SummaryGrid)
        .exists()
    ).toBe(true)
  })

  it('has an Action Required header', () => {
    expect(shallow(<ImmediateActionRequiredSummary i18n={i18n} />).props().header).toEqual(
      <DataGridHeader
        title="Immediate Action Required"
        index={'id1'}
        tooltip={
          'Ratings of 3 from all domains except Strengths. This rating indicates that the need is dangerous or disabling.'
        }
      />
    )
  })

  it('passes i18n info to the summary grid', () => {
    expect(
      shallow(<ImmediateActionRequiredSummary i18n={i18n} />)
        .find(SummaryGrid)
        .props().i18n
    ).toBe(i18n)
  })

  describe('with some items', () => {
    let wrapper
    beforeEach(() => {
      const div = document.createElement('div')
      document.body.appendChild(div)
      // special test setting for mounting the component with toolTip nested
      wrapper = mount(
        <BrowserRouter>
          <ImmediateActionRequiredSummary domains={domains} i18n={i18n} />
        </BrowserRouter>,
        { attachTo: div }
      )
    })

    const domains = [
      {
        code: 'BEN',
        items: [
          { code: 'SURPRISE', rating: 1 },
          { code: 'FEAR', rating: 3 },
          { code: 'RUTHLESS_EFFICIENCY', rating: 3 },
          { code: 'NICE_RED_UNIFORMS', rating: -1 },
          { code: 'FANATICAL_DEVOTION', rating: 2 },
        ],
      },
    ]

    it('renders all of the data with rating 3', () => {
      const text = wrapper.text()
      expect(text).toContain('Fear')
      expect(text).toContain('Ruthless Efficiency')
    })

    it('skips all items with ratings not 3', () => {
      const text = wrapper.text()
      expect(text).not.toContain('Surprise')
      expect(text).not.toContain('Nice Red Uniforms')
      expect(text).not.toContain('Fanatical Devotion')
    })
  })

  describe('with multiple domains', () => {
    const strengthItems = [{ code: 'SURPRISE', rating: 3 }]
    const traumaItems = [{ code: 'RUTHLESS_EFFICIENCY', rating: 3 }]
    const childStrengthItems = [{ code: 'FANATICAL_DEVOTION', rating: 3 }]
    const otherItems = [
      { code: 'FEAR', rating: 3 },
      { code: 'NICE_RED_UNIFORMS', rating: 3 },
      { code: 'COMFY_CHAIRS', rating: 3 },
    ]
    const domains = [
      { code: 'STR', items: strengthItems },
      { code: 'TRM', items: traumaItems },
      { code: 'EST', items: childStrengthItems },
      { code: 'OTHER', items: otherItems },
    ]
    const render = () => mount(<ImmediateActionRequiredSummary domains={domains} i18n={i18n} />)

    it('lists non-strength, non-trauma domains', () => {
      const text = render().text()
      expect(text).toContain('Fear')
      expect(text).toContain('Nice Red Uniforms')
      expect(text).toContain('Comfy Chairs')
    })

    it('skips strength and trauma domains', () => {
      const text = render().text()

      expect(text).not.toContain('Surprise')
      expect(text).not.toContain('Ruthless Efficiency')
      expect(text).not.toContain('Fanatical Devotion')
    })
  })

  describe('with lots of items', () => {
    const N = 500
    const items = new Array(N).fill().map((_, i) => ({ code: `${i}`, rating: 3 }))
    const domains = [{ code: 'WAM', items }]
    const render = () => mount(<ImmediateActionRequiredSummary domains={domains} i18n={i18n} />)

    it('renders all of the data', () => {
      const text = render().text()

      domains[0].items.forEach(item => {
        expect(text).toContain(item.code)
      })
    })
  })
})
