import { countDueDates, countPastDueDates } from './ReassessmentsDueCalculator'
import moment from 'moment'

describe('#countWarningsAndDues()', () => {
  const today = moment('2019-01-01')

  describe('#countDueDates()', () => {
    it('ignores past reminder dates', () => {
      expect(countDueDates(['2018-11-29', '2018-12-03'], today)).toBe(0)
    })

    it('counts in upcoming reminder dates that are between today and 30 days forward inclusively', () => {
      expect(countDueDates(['2019-01-01', '2019-01-30'], today)).toBe(2)
    })

    it('ignores reminder dates that are more than 30 days in future', () => {
      expect(countDueDates(['2019-02-01', '2019-03-03', today])).toBe(0)
    })
  })

  describe('#countPastDueDates()', () => {
    it('counts in past reminder dates', () => {
      expect(countPastDueDates(['2018-12-02', '2018-12-31'], today)).toBe(2)
    })

    it('ignores today and future reminder dates', () => {
      expect(countPastDueDates(['2019-01-01', '2019-01-05', '2019-05-05'], today)).toBe(0)
    })
  })
})
