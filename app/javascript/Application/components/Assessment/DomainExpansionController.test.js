import React from 'react'
import { shallow } from 'enzyme'
import DomainExpansionController from './DomainExpansionController'

const DOMAINS = [{ id: 1 }, { id: 2 }, { id: 3 }]

describe('DomainExpansionController', () => {
  const render = (domains = DOMAINS) =>
    shallow(
      <DomainExpansionController domains={domains}>
        <div id="child" />
      </DomainExpansionController>
    )

  it('initializes state for each domain', () => {
    expect(render().state().domainsExpanded).toEqual([
      { domain: DOMAINS[0], isExpanded: false },
      { domain: DOMAINS[1], isExpanded: false },
      { domain: DOMAINS[2], isExpanded: false },
    ])
  })

  it('tracks updates to domains as they are reordered', () => {
    const wrapper = render()
    wrapper.setProps({ domains: [DOMAINS[2], DOMAINS[0], DOMAINS[1]] })
    expect(wrapper.state().domainsExpanded).toEqual([
      { domain: DOMAINS[2], isExpanded: false },
      { domain: DOMAINS[0], isExpanded: false },
      { domain: DOMAINS[1], isExpanded: false },
    ])
  })

  it('adds new domains in a default collapsed state', () => {
    const wrapper = render()
    wrapper.setProps({ domains: [...DOMAINS, { id: 1000 }] })
    expect(wrapper.state().domainsExpanded.find(({ domain }) => domain.id === 1000).isExpanded).toBe(false)
  })

  it('passes the domainsExpanded state to child', () => {
    const wrapper = render()
    wrapper.setState({
      domainsExpanded: [
        { domain: DOMAINS[0], isExpanded: false },
        { domain: DOMAINS[1], isExpanded: true },
        { domain: DOMAINS[2], isExpanded: false },
      ],
    })
    const child = wrapper.find('#child')
    expect(child.props().domainsExpanded).toBe(wrapper.state().domainsExpanded)
  })

  it('toggles the first domainsExpanded item when the first domain is expanded', () => {
    const wrapper = render()
    wrapper.setState({
      domainsExpanded: [
        { domain: DOMAINS[0], isExpanded: true },
        { domain: DOMAINS[1], isExpanded: true },
        { domain: DOMAINS[2], isExpanded: true },
      ],
    })
    wrapper
      .find('#child')
      .props()
      .onExpandedChange(0, false)
    expect(wrapper.state().domainsExpanded).toEqual([
      { domain: DOMAINS[0], isExpanded: false },
      { domain: DOMAINS[1], isExpanded: true },
      { domain: DOMAINS[2], isExpanded: true },
    ])
  })

  it('toggles the first domainsExpanded item when the first domain is collapsed', () => {
    const wrapper = render()
    wrapper.setState({
      domainsExpanded: [
        { domain: DOMAINS[0], isExpanded: false },
        { domain: DOMAINS[1], isExpanded: false },
        { domain: DOMAINS[2], isExpanded: false },
      ],
    })
    wrapper
      .find('#child')
      .props()
      .onExpandedChange(0, true)
    expect(wrapper.state().domainsExpanded).toEqual([
      { domain: DOMAINS[0], isExpanded: true },
      { domain: DOMAINS[1], isExpanded: false },
      { domain: DOMAINS[2], isExpanded: false },
    ])
  })

  it('toggles other domainsExpanded items when the corresponding domain is expanded', () => {
    const wrapper = render()
    wrapper.setState({
      domainsExpanded: [
        { domain: DOMAINS[0], isExpanded: true },
        { domain: DOMAINS[1], isExpanded: true },
        { domain: DOMAINS[2], isExpanded: true },
      ],
    })
    wrapper
      .find('#child')
      .props()
      .onExpandedChange(1, false)
    expect(wrapper.state().domainsExpanded).toEqual([
      { domain: DOMAINS[0], isExpanded: true },
      { domain: DOMAINS[1], isExpanded: false },
      { domain: DOMAINS[2], isExpanded: true },
    ])
  })

  it('toggles other domainsExpanded items when the corresponding domain is collapsed', () => {
    const wrapper = render()
    wrapper.setState({
      domainsExpanded: [
        { domain: DOMAINS[0], isExpanded: false },
        { domain: DOMAINS[1], isExpanded: false },
        { domain: DOMAINS[2], isExpanded: false },
      ],
    })
    wrapper
      .find('#child')
      .props()
      .onExpandedChange(1, true)
    expect(wrapper.state().domainsExpanded).toEqual([
      { domain: DOMAINS[0], isExpanded: false },
      { domain: DOMAINS[1], isExpanded: true },
      { domain: DOMAINS[2], isExpanded: false },
    ])
  })
})
