import React from 'react'
import { mount } from 'enzyme'
import PrintAssessmentOverallFooter from './PrintAssessmentOverallFooter'

const FirefoxfakeProps = {
  text: 'some text',
  isFirefox: true,
}

const noFirefoxfakeProps = {
  text: 'some text',
  isFirefox: false,
}

describe('<PrintAssessmentOverallFooter />', () => {
  let wrapper
  afterEach(() => {
    wrapper.unmount()
  })

  it('will not render svg when the broswer is Firefox', () => {
    wrapper = mount(<PrintAssessmentOverallFooter {...FirefoxfakeProps} />)
    const target = wrapper.find('svg')
    expect(target.length).toBe(0)
  })

  it('will render a svg with correct content when the broswer is not Firefox', () => {
    wrapper = mount(<PrintAssessmentOverallFooter {...noFirefoxfakeProps} />)
    const target = wrapper.find('svg')
    expect(target.length).toBe(1)
    expect(target.text()).toBe('some text')
  })
})
