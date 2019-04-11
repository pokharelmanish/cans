import React from 'react'
import { mount, shallow } from 'enzyme'
import { i18n } from './DomainHelper.test'
import SummaryGrid from './SummaryGrid'
import DataGridHeader from '../../common/DataGridHeader'
import StrengthsSummary from './StrengthsSummary'
import { BrowserRouter } from 'react-router-dom'

describe('<StrengthsSummary />', () => {
  it('renders a data grid', () => {
    expect(
      shallow(<StrengthsSummary i18n={i18n} />)
        .find(SummaryGrid)
        .exists()
    ).toBe(true)
  })

  it('has a Strengths header', () => {
    expect(shallow(<StrengthsSummary i18n={i18n} />).props().header).toEqual(
      <DataGridHeader
        title="Strengths"
        index={'id2'}
        tooltip={'Ratings of 0 or 1 in the Strengths Domain. These are central or useful in planning.'}
      />
    )
  })

  it('passes i18n info to the summary grid', () => {
    expect(
      shallow(<StrengthsSummary i18n={i18n} />)
        .find(SummaryGrid)
        .props().i18n
    ).toBe(i18n)
  })

  describe('with some strengths', () => {
    let wrapper
    beforeEach(() => {
      const div = document.createElement('div')
      document.body.appendChild(div)
      // special test setting for mounting the component with toolTip nested
      wrapper = mount(
        <BrowserRouter>
          <StrengthsSummary domains={domains} i18n={i18n} />
        </BrowserRouter>,
        { attachTo: div }
      )
    })

    const domains = [
      {
        code: 'STR',
        items: [
          { code: 'SURPRISE', rating: 0 },
          { code: 'FEAR', rating: 1 },
          { code: 'RUTHLESS_EFFICIENCY', rating: 2 },
          { code: 'NICE_RED_UNIFORMS', rating: 3 },
          { code: 'FANATICAL_DEVOTION', rating: -1 },
        ],
      },
    ]

    it('renders items with a rating of 0 or 1', () => {
      const text = wrapper.text()
      expect(text).toContain('Surprise')
      expect(text).toContain('Fear')
    })

    it('does not render items with other ratings', () => {
      const text = wrapper.text()
      expect(text).not.toContain('Ruthless Efficiency')
      expect(text).not.toContain('Nice Red Uniforms')
      expect(text).not.toContain('Fanatical Devotion')
    })
  })

  describe('with multiple domains', () => {
    const items = [{ code: 'SURPRISE', rating: 0 }, { code: 'FEAR', rating: 0 }]
    const moreItems = [{ code: 'RUTHLESS_EFFICIENCY', rating: 0 }, { code: 'NICE_RED_UNIFORMS', rating: 0 }]
    const childStrengthItems = [{ code: 'FANATICAL_DEVOTION', rating: 0 }, { code: 'COMFY_CHAIRS', rating: 0 }]
    const domains = [
      { code: 'STR', items },
      { code: 'TRM', items: moreItems },
      { code: 'EST', items: childStrengthItems },
    ]
    const render = () => mount(<StrengthsSummary domains={domains} i18n={i18n} />)

    it('renders all of the Strength data', () => {
      const text = render().text()

      expect(text).toContain('Surprise')
      expect(text).toContain('Fear')
      expect(text).toContain('Fanatical Devotion')
      expect(text).toContain('Comfy Chairs')
      expect(text).not.toContain('Ruthless Efficiency')
      expect(text).not.toContain('Nice Red Uniforms')
    })
  })

  describe('with lots of strengths', () => {
    const N = 500
    const items = new Array(N).fill().map((_, i) => ({ code: `${i}`, rating: 0 }))
    const domains = [{ code: 'STR', items }]
    const render = () => mount(<StrengthsSummary domains={domains} i18n={i18n} />)

    it('renders all of the data', () => {
      const text = render().text()

      domains[0].items.forEach(item => {
        expect(text).toContain(item.code)
      })
    })
  })
})
