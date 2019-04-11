import React from 'react'
import { mount, shallow } from 'enzyme'
import { i18n } from './DomainHelper.test'
import SummaryGrid from './SummaryGrid'
import DataGridHeader from '../../common/DataGridHeader'
import ActionRequiredSummary from './ActionRequiredSummary'
import { BrowserRouter } from 'react-router-dom'

describe('<ActionRequiredSummary />', () => {
  it('renders a data grid', () => {
    expect(
      shallow(<ActionRequiredSummary i18n={i18n} />)
        .find(SummaryGrid)
        .exists()
    ).toBe(true)
  })

  it('has an Action Required header', () => {
    expect(shallow(<ActionRequiredSummary i18n={i18n} />).props().header).toEqual(
      <DataGridHeader
        title="Action Required"
        index={'id3'}
        tooltip={
          'Includes a rating of 1 from the Behavioral/Emotional domain and ratings of 2 from all needs domains. These ratings indicate that this need interferes with functioning.'
        }
      />
    )
  })

  it('passes i18n info to the summary grid', () => {
    expect(
      shallow(<ActionRequiredSummary i18n={i18n} />)
        .find(SummaryGrid)
        .props().i18n
    ).toBe(i18n)
  })

  describe('with some items in BEN domain', () => {
    let wrapper
    beforeEach(() => {
      const div = document.createElement('div')
      document.body.appendChild(div)
      // special test setting for mounting the component with toolTip nested
      wrapper = mount(
        <BrowserRouter>
          <ActionRequiredSummary domains={domains} i18n={i18n} />
        </BrowserRouter>,
        { attachTo: div }
      )
    })

    const domains = [
      {
        code: 'BEN',
        items: [
          { code: 'SURPRISE', rating: 1 },
          { code: 'FEAR', rating: 2 },
          { code: 'RUTHLESS_EFFICIENCY', rating: 2 },
          { code: 'NICE_RED_UNIFORMS', rating: -1 },
          { code: 'FANATICAL_DEVOTION', rating: 3 },
        ],
      },
    ]

    it('renders all of the data with rating 1 and 2 in the domain', () => {
      const text = wrapper.text()
      expect(text).toContain('Fear')
      expect(text).toContain('Ruthless Efficiency')
      expect(text).toContain('Surprise')
    })

    it('skips all items with ratings not 2 or 1', () => {
      const text = wrapper.text()
      expect(text).not.toContain('Nice Red Uniforms')
      expect(text).not.toContain('Fanatical Devotion')
    })
  })

  describe('with items in other domains', () => {
    const domains = [
      {
        code: 'LFD',
        items: [
          { code: 'SURPRISE', rating: 1 },
          { code: 'FEAR', rating: 2 },
          { code: 'RUTHLESS_EFFICIENCY', rating: 2 },
          { code: 'NICE_RED_UNIFORMS', rating: -1 },
          { code: 'FANATICAL_DEVOTION', rating: 3 },
        ],
      },
    ]
    const render = () => mount(<ActionRequiredSummary domains={domains} i18n={i18n} />)

    it('renders all of the data with rating 2 in the domain', () => {
      const text = render().text()
      expect(text).toContain('Fear')
      expect(text).toContain('Ruthless Efficiency')
    })

    it('skips all items with ratings not 2', () => {
      const text = render().text()
      expect(text).not.toContain('Surprise')
      expect(text).not.toContain('Nice Red Uniforms')
      expect(text).not.toContain('Fanatical Devotion')
    })
  })

  describe('with multiple domains', () => {
    const strengthItems = [{ code: 'SURPRISE', rating: 2 }]
    const traumaItems = [{ code: 'RUTHLESS_EFFICIENCY', rating: 2 }]
    const childStrengthItems = [{ code: 'FANATICAL_DEVOTION', rating: 2 }]
    const otherItems = [
      { code: 'FEAR', rating: 2 },
      { code: 'NICE_RED_UNIFORMS', rating: 2 },
      { code: 'COMFY_CHAIRS', rating: 2 },
    ]
    const domains = [
      { code: 'STR', items: strengthItems },
      { code: 'TRM', items: traumaItems },
      { code: 'EST', items: childStrengthItems },
      { code: 'OTHER', items: otherItems },
    ]
    const render = () => mount(<ActionRequiredSummary domains={domains} i18n={i18n} />)

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
    const items = new Array(N).fill().map((_, i) => ({ code: `${i}`, rating: 2 }))
    const domains = [{ code: 'WAM', items }]
    const render = () => mount(<ActionRequiredSummary domains={domains} i18n={i18n} />)

    it('renders all of the data', () => {
      const text = render().text()

      domains[0].items.forEach(item => {
        expect(text).toContain(item.code)
      })
    })
  })
})
