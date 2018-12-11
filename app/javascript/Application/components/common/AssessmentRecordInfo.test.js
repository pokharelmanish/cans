import React from 'react'
import { shallow } from 'enzyme'
import { Card, CardBody } from '@cwds/components'
import AssessmentRecordInfo from './AssessmentRecordInfo'
import AssessmentLink from '../common/AssessmentLink'
import Ellipsis from '../common/Ellipsis'
import AssessmentRecordStatus from '../common/AssessmentRecordStatus'
import {
  assessmentInProgressWithCaseNumber,
  assessmentCompletedWithCaseNumber,
  assessmentWithNoUpdateInfoWithCaseNumber,
  assessmentInProgressWithReferralNumber,
  assessmentCompletedWithReferralNumber,
  assessmentWithNoUpdateInfoWithReferralNumber,
  assessmentInProgressWithNoClientandReferralNumber,
  assessmentCompletedWithNoClientandReferralNumber,
  assessmentWithNoUpdateInfoWithNoClientandReferralNumber,
} from '../Assessment/assessment.mocks.test'

const prepareWrapper = (assessment, header) => shallow(<AssessmentRecordInfo assessment={assessment} header={header} />)

describe('AssessmentRecordInfo', () => {
  describe('component layout', () => {
    let wrapper

    beforeEach(() => {
      wrapper = prepareWrapper(assessmentInProgressWithCaseNumber, 'client-profile')
    })

    it('renders a Card component', () => {
      expect(wrapper.find(Card).exists()).toBe(true)
    })

    it('renders a CardBody component', () => {
      expect(wrapper.find(CardBody).exists()).toBe(true)
    })

    it('renders an Ellipsis component', () => {
      expect(wrapper.find(Ellipsis).exists()).toBe(true)
    })

    it('renders an assessment-record-info div', () => {
      expect(wrapper.find('div.assessment-record-info').exists()).toBe(true)
    })

    describe('assessment record info headers', () => {
      describe('header prop equals assessment-status', () => {
        it('renders a status icon header', () => {
          const wrapper = prepareWrapper(assessmentInProgressWithCaseNumber, 'assessment-status')
          expect(wrapper.find(AssessmentRecordStatus).exists()).toBe(true)
        })
      })

      describe('header prop equals assessment-client-name', () => {
        it('renders a client name header', () => {
          const wrapper = prepareWrapper(assessmentInProgressWithCaseNumber, 'assessment-client-name')
          expect(wrapper.find('div.assessment-record-client-name').exists()).toBe(true)
        })
      })
    })

    it('renders 5 paragraphs', () => {
      expect(wrapper.find('p').length).toBe(5)
    })
  })

  describe('ClientAssessmentHistoryWithCaseNumber', () => {
    it('renders IN_PROGRESS assessment with all fields', () => {
      const { id } = assessmentInProgressWithCaseNumber
      const wrapper = prepareWrapper(assessmentInProgressWithCaseNumber, 'assessment-client-name')
      const assessmentInfo = wrapper
        .find('div.assessment-record-info')
        .children()
        .map(child => child.props().children)

      expect(wrapper.find(Ellipsis).props().id).toBe(97501)
      expect(assessmentInfo).toEqual([
        'Client name: Casey Middle Test, Jr',
        <AssessmentLink assessment={assessmentInProgressWithCaseNumber} key={id} />,
        'Saved on 06/06/2015 by',
        'Name 1 LastName 1',
        'Case: 4444-333-4444-88888888',
        'County: Alameda',
      ])
    })

    it('renders COMPLETED assessment with all fields', () => {
      const { id } = assessmentCompletedWithCaseNumber
      const wrapper = prepareWrapper(assessmentCompletedWithCaseNumber, 'assessment-client-name')
      const assessmentInfo = wrapper
        .find('div.assessment-record-info')
        .children()
        .map(child => child.props().children)

      expect(wrapper.find(Ellipsis).props().id).toBe(97502)
      expect(assessmentInfo).toEqual([
        'Client name: Casey Middle Test, Jr',
        <AssessmentLink assessment={assessmentCompletedWithCaseNumber} key={id} />,
        'Completed on 06/06/2018 by',
        'Name 2 LastName 2',
        'Case: 4444-333-4444-88888888',
        'County: Alameda',
      ])
    })

    it('renders assessment with no update info (create info only)', () => {
      const { id } = assessmentWithNoUpdateInfoWithCaseNumber
      const wrapper = prepareWrapper(assessmentWithNoUpdateInfoWithCaseNumber, 'assessment-client-name')
      const assessmentInfo = wrapper
        .find('div.assessment-record-info')
        .children()
        .map(child => child.props().children)

      expect(wrapper.find(Ellipsis).props().id).toBe(97503)
      expect(assessmentInfo).toEqual([
        'Client name: Casey Middle Test, Jr',
        <AssessmentLink assessment={assessmentWithNoUpdateInfoWithCaseNumber} key={id} />,
        'Saved on 06/06/2018 by',
        'Name 3 LastName 3',
        'Case: 4444-333-4444-88888888',
        'County: Alameda',
      ])
    })
  })

  describe('ClientAssessmentHistoryWithReferralNumber', () => {
    it('renders IN_PROGRESS assessment with all fields', () => {
      const { id } = assessmentInProgressWithReferralNumber
      const wrapper = prepareWrapper(assessmentInProgressWithReferralNumber, 'assessment-client-name')
      const assessmentInfo = wrapper
        .find('div.assessment-record-info')
        .children()
        .map(child => child.props().children)

      expect(wrapper.find(Ellipsis).props().id).toBe(97501)
      expect(assessmentInfo).toEqual([
        'Client name: Casey Middle Test, Jr',
        <AssessmentLink assessment={assessmentInProgressWithReferralNumber} key={id} />,
        'Saved on 06/06/2015 by',
        'Name 1 LastName 1',
        'Case: 4444-333-4444-88888888',
        'County: Alameda',
      ])
    })

    it('renders COMPLETED assessment with all fields', () => {
      const { id } = assessmentCompletedWithReferralNumber
      const wrapper = prepareWrapper(assessmentCompletedWithReferralNumber, 'assessment-client-name')
      const assessmentInfo = wrapper
        .find('div.assessment-record-info')
        .children()
        .map(child => child.props().children)

      expect(wrapper.find(Ellipsis).props().id).toBe(97502)
      expect(assessmentInfo).toEqual([
        'Client name: Casey Middle Test, Jr',
        <AssessmentLink assessment={assessmentCompletedWithReferralNumber} key={id} />,
        'Completed on 06/06/2018 by',
        'Name 2 LastName 2',
        'Case: 4444-333-4444-88888888',
        'County: Alameda',
      ])
    })

    it('renders assessment with no update info (create info only)', () => {
      const { id } = assessmentWithNoUpdateInfoWithReferralNumber
      const wrapper = prepareWrapper(assessmentWithNoUpdateInfoWithReferralNumber, 'assessment-client-name')
      const assessmentInfo = wrapper
        .find('div.assessment-record-info')
        .children()
        .map(child => child.props().children)

      expect(wrapper.find(Ellipsis).props().id).toBe(97503)
      expect(assessmentInfo).toEqual([
        'Client name: Casey Middle Test, Jr',
        <AssessmentLink assessment={assessmentWithNoUpdateInfoWithReferralNumber} key={id} />,
        'Saved on 06/06/2018 by',
        'Name 3 LastName 3',
        'Case: 4444-333-4444-88888888',
        'County: Alameda',
      ])
    })
  })

  describe('ClientAssessmentHistoryWithNoClientorReferralNumber', () => {
    it('renders IN_PROGRESS assessment with all fields', () => {
      const { id } = assessmentInProgressWithNoClientandReferralNumber
      const wrapper = prepareWrapper(assessmentInProgressWithNoClientandReferralNumber, 'assessment-client-name')
      const assessmentInfo = wrapper
        .find('div.assessment-record-info')
        .children()
        .map(child => child.props().children)

      expect(wrapper.find(Ellipsis).props().id).toBe(97501)
      expect(assessmentInfo).toEqual([
        'Client name: Casey Middle Test, Jr',
        <AssessmentLink assessment={assessmentInProgressWithNoClientandReferralNumber} key={id} />,
        'Saved on 06/06/2015 by',
        'Name 1 LastName 1',
        'Case: ',
        'County: Alameda',
      ])
    })

    it('renders COMPLETED assessment with all fields', () => {
      const { id } = assessmentCompletedWithNoClientandReferralNumber
      const wrapper = prepareWrapper(assessmentCompletedWithNoClientandReferralNumber, 'assessment-client-name')
      const assessmentInfo = wrapper
        .find('div.assessment-record-info')
        .children()
        .map(child => child.props().children)

      expect(wrapper.find(Ellipsis).props().id).toBe(97502)
      expect(assessmentInfo).toEqual([
        'Client name: Casey Middle Test, Jr',
        <AssessmentLink assessment={assessmentCompletedWithNoClientandReferralNumber} key={id} />,
        'Completed on 06/06/2018 by',
        'Name 2 LastName 2',
        'Case: ',
        'County: Alameda',
      ])
    })

    it('renders assessment with no update info (create info only)', () => {
      const { id } = assessmentWithNoUpdateInfoWithNoClientandReferralNumber
      const wrapper = prepareWrapper(assessmentWithNoUpdateInfoWithNoClientandReferralNumber, 'assessment-client-name')
      const assessmentInfo = wrapper
        .find('div.assessment-record-info')
        .children()
        .map(child => child.props().children)

      expect(wrapper.find(Ellipsis).props().id).toBe(97503)
      expect(assessmentInfo).toEqual([
        'Client name: Casey Middle Test, Jr',
        <AssessmentLink assessment={assessmentWithNoUpdateInfoWithNoClientandReferralNumber} key={id} />,
        'Saved on 06/06/2018 by',
        'Name 3 LastName 3',
        'Case: ',
        'County: Alameda',
      ])
    })
  })
})
