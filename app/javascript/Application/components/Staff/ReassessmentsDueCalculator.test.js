import { countWarningsAndDues } from './ReassessmentsDueCalculator.js'
import moment from 'moment'

describe('#countWarningsAndDues()', () => {
  const dateNowImplTempHolder = Date.now

  beforeAll(() => {
    const todayMock = moment('2019-01-01') // this date will be "today" in tests
    Date.now = jest.fn(() => todayMock)
  })

  afterAll(() => (Date.now = dateNowImplTempHolder))

  describe('warningsCount', () => {
    it('ignores past reminder dates', () => {
      const warningsAndDues = countWarningsAndDues(['2018-11-29', '2018-12-03'])
      expect(warningsAndDues.warningsCount).toBe(0)
    })

    it('counts in upcoming reminder dates that are between today and 30 days forward inclusively', () => {
      const warningsAndDues = countWarningsAndDues(['2019-01-01', '2019-01-30'])
      expect(warningsAndDues.warningsCount).toBe(2)
    })

    it('ignores reminder dates that are more than 30 days in future', () => {
      const warningsAndDues = countWarningsAndDues(['2019-02-01', '2019-03-03'])
      expect(warningsAndDues.warningsCount).toBe(0)
    })
  })

  describe('duesCount', () => {
    it('counts in past reminder dates', () => {
      const warningsAndDues = countWarningsAndDues(['2018-12-02', '2018-12-31'])
      expect(warningsAndDues.duesCount).toBe(2)
    })

    it('ignores today and future reminder dates', () => {
      const warningsAndDues = countWarningsAndDues(['2019-01-01', '2019-01-05', '2019-05-05'])
      expect(warningsAndDues.duesCount).toBe(0)
    })
  })
})
