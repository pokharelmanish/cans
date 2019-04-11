import React from 'react'
import { mount, shallow } from 'enzyme'
import { i18n } from './DomainHelper.test'
import SummaryGrid from './SummaryGrid'
import DataGridHeader from '../../common/DataGridHeader'
import TraumaSummary from './TraumaSummary'
import { BrowserRouter } from 'react-router-dom'

describe('<TraumaSummary />', () => {
  it('renders a summary grid', () => {
    expect(
      shallow(<TraumaSummary i18n={i18n} />)
        .find(SummaryGrid)
        .exists()
    ).toBe(true)
  })

  it('has a Trauma header', () => {
    expect(shallow(<TraumaSummary i18n={i18n} />).props().header).toEqual(
      <DataGridHeader
        title="Trauma"
        tooltip={'Includes all "Yes" ratings from the Potentially Traumatic/Adverse Childhood Experiences module.'}
        index={'id4'}
      />
    )
  })

  it('passes i18n info to the summary grid', () => {
    expect(
      shallow(<TraumaSummary i18n={i18n} />)
        .find(SummaryGrid)
        .props().i18n
    ).toBe(i18n)
  })

  describe('with some trauma items', () => {
    let wrapper
    beforeEach(() => {
      const div = document.createElement('div')
      document.body.appendChild(div)
      // special test setting for mounting the component with toolTip nested
      wrapper = mount(
        <BrowserRouter>
          <TraumaSummary domains={domains} i18n={i18n} />
        </BrowserRouter>,
        { attachTo: div }
      )
    })

    const domains = [
      {
        code: 'TRM',
        items: [
          { code: 'SURPRISE', rating: 1 },
          { code: 'FEAR', rating: 1 },
          { code: 'RUTHLESS_EFFICIENCY', rating: 0 },
          { code: 'NICE_RED_UNIFORMS', rating: 8 },
          { code: 'FANATICAL_DEVOTION', rating: -1 },
        ],
      },
    ]

    it('renders items with a rating of Yes/1', () => {
      const text = wrapper.text()
      expect(text).toContain('Surprise')
      expect(text).toContain('Fear')
    })

    it('does not render items other ratings (No/Unset/NA)', () => {
      const text = wrapper.text()
      expect(text).not.toContain('Ruthless Efficiency')
      expect(text).not.toContain('Nice Red Uniforms')
      expect(text).not.toContain('Fanatical Devotion')
    })
  })

  describe('with multiple domains', () => {
    const items = [{ code: 'SURPRISE', rating: 1 }, { code: 'FEAR', rating: 1 }]
    const moreItems = [{ code: 'RUTHLESS_EFFICIENCY', rating: 1 }, { code: 'NICE_RED_UNIFORMS', rating: 1 }]
    const domains = [{ code: 'TRM', items }, { code: 'OTHER', items: moreItems }]
    const render = () => mount(<TraumaSummary domains={domains} i18n={i18n} />)

    it('renders all of the Trauma data', () => {
      const text = render().text()

      expect(text).toContain('Surprise')
      expect(text).toContain('Fear')
      expect(text).not.toContain('Ruthless Efficiency')
      expect(text).not.toContain('Nice Red Uniforms')
    })
  })

  describe('with lots of trauma items', () => {
    const N = 500
    const items = new Array(N).fill().map((_, i) => ({ code: `${i}`, rating: 1 }))
    const domains = [{ code: 'TRM', items }]
    const render = () => mount(<TraumaSummary domains={domains} i18n={i18n} />)

    it('renders all of the data', () => {
      const text = render().text()

      domains[0].items.forEach(item => {
        expect(text).toContain(item.code)
      })
    })
  })
})
