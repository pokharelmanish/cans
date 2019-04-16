import {
  isoToJsDate,
  isoToLocalDate,
  localToIsoDate,
  isValidIsoDate,
  jsDateToIso,
  isFutureDate,
  getCurrentIsoDate,
  isValidDate,
  isValidLocalDate,
  localToIsoDateOrNull,
  calculateDateDifferenceInYears,
  sortDate,
} from './dateHelper'
import moment from 'moment'

describe('#isoToLocalDate()', () => {
  it('returns a formatted date', () => {
    expect(isoToLocalDate('2012-05-31')).toEqual('05/31/2012')
  })

  it('returns Invalid DateTime when input is null', () => {
    expect(isoToLocalDate(null)).toEqual(null)
  })

  it('returns Invalid Date when input is undefined', () => {
    expect(isoToLocalDate(undefined)).toEqual(undefined)
  })

  it('returns Invalid Date when input is invalid JS Date', () => {
    expect(isoToLocalDate('Wrong Date')).toEqual('Invalid date')
  })
})

describe('#localToIsolDate()', () => {
  it('returns a formatted date', () => {
    expect(localToIsoDate('05/31/2012')).toEqual('2012-05-31')
  })

  it('returns Invalid DateTime when input is null', () => {
    expect(localToIsoDate(null)).toEqual(null)
  })

  it('returns Invalid Date when input is undefined', () => {
    expect(localToIsoDate(undefined)).toEqual('Invalid date')
  })

  it('returns Invalid Date when input is invalid Date', () => {
    expect(localToIsoDate('13/45/2018')).toEqual('Invalid date')
  })
})

describe('#jsDateToIso()', () => {
  it('returns a formatted ISO date when input is valid JS Date', () => {
    expect(jsDateToIso(isoToJsDate('2010-06-30'))).toEqual('2010-06-30')
  })

  it('returns null when input is null', () => {
    expect(jsDateToIso(null)).toEqual(null)
  })

  it('returns Invalid DateTime when input is invalid JS Date', () => {
    expect(jsDateToIso('Wrong Date')).toEqual('Invalid date')
  })
})

describe('#isoToJsDate()', () => {
  it('returns a valid JS Date when input is valid ISO Date', () => {
    const result = isoToJsDate('1970-01-01')
    const expected = jsDateToIso(result)
    expect('1970-01-01').toEqual(expected)
  })

  it('returns null when input is null', () => {
    expect(isoToJsDate(null)).toEqual(null)
  })

  it('returns null when input is invalid JS Date', () => {
    expect(isoToJsDate('Wrong Date')).toEqual(null)
  })
})

describe('#isValidIsoDate()', () => {
  it('returns true is input is valid ISO date', () => {
    expect(isValidIsoDate('1970-01-01')).toEqual(true)
    expect(isValidIsoDate('1970-01')).toEqual(true)
  })

  it('returns false when input is invalid ISO date string', () => {
    expect(isValidIsoDate('wrong date')).toEqual(false)
    expect(isValidIsoDate(null)).toEqual(false)
    expect(isValidIsoDate(undefined)).toEqual(false)
    expect(isValidIsoDate('2018-13-45')).toEqual(false)
  })

  describe('when strict flag for Iso date', () => {
    describe('when partial date', () => {
      it('returns false', () => {
        expect(isValidIsoDate('1970-01', true)).toEqual(false)
      })
    })

    describe('when complete valid date', () => {
      it('returns true', () => {
        expect(isValidIsoDate('1970-01-01', true)).toEqual(true)
      })
    })
  })
})

describe('#isValidLocalDate()', () => {
  it('returns true is input is valid Local date', () => {
    expect(isValidLocalDate('01/01/1970')).toEqual(true)
    expect(isValidLocalDate('01/01/')).toEqual(true)
  })

  it('returns false when input is invalid Local date string', () => {
    expect(isValidLocalDate('wrong date')).toEqual(false)
    expect(isValidLocalDate(null)).toEqual(false)
    expect(isValidLocalDate(undefined)).toEqual(false)
    expect(isValidLocalDate('13/45/2018')).toEqual(false)
  })

  describe('when strict flag for Local date', () => {
    describe('when partial Local date', () => {
      it('returns false', () => {
        expect(isValidLocalDate('12/31/', true)).toEqual(false)
      })
    })

    describe('when complete valid Local date', () => {
      it('returns false', () => {
        expect(isValidLocalDate('12/31/2000', true)).toEqual(true)
      })
    })
  })
})

describe('#isFutureDate()', () => {
  it('returns true if date is in the future', () => {
    expect(isFutureDate('5000-01-01')).toEqual(true)
    expect(isFutureDate('01/01/5000')).toEqual(true)
  })

  it('returns false if date is in the past', () => {
    expect(isFutureDate('1971-01-01')).toEqual(false)
  })

  it('returns false if date is a current date', () => {
    expect(isFutureDate(getCurrentIsoDate())).toEqual(false)
  })
})

describe('#isValidDate()', () => {
  it('returns false if pass not a date object', () => {
    expect(isValidDate('')).toEqual(false)
    expect(isValidDate('some text')).toEqual(false)
    expect(isValidDate(null)).toEqual(false)
  })

  it('returns true if pass date', () => {
    expect(isValidDate('12/31/2018')).toEqual(true)
    expect(isValidDate('2018-12-31')).toEqual(true)
  })

  describe('No future date allowed', () => {
    const conf = {
      allowFutureDate: false,
    }

    it('returns true if pass the past date', () => {
      expect(isValidDate('1971-12-31', conf)).toEqual(true)
    })

    it('returns false if pass the futute date', () => {
      expect(isValidDate('5000-12-31', conf)).toEqual(false)
    })
  })
})

describe('#localToIsoDateOrNull()', () => {
  it('returns null if pass not valid local date', () => {
    expect(localToIsoDateOrNull('')).toEqual(null)
    expect(localToIsoDateOrNull('12/31/____')).toEqual(null)
    expect(localToIsoDateOrNull(null)).toEqual(null)
  })

  it('returns iso date if pass valid Local date', () => {
    expect(localToIsoDateOrNull('12/31/2018')).toEqual('2018-12-31')
  })
})

describe('#calculateDateDifferenceInYears()', () => {
  it('returns null if pass invalid dates', () => {
    expect(calculateDateDifferenceInYears('', '')).toEqual(null)
    expect(calculateDateDifferenceInYears('12/31/____', '')).toEqual(null)
    expect(calculateDateDifferenceInYears(null, null)).toEqual(null)
    expect(calculateDateDifferenceInYears(null, moment('2019-02-08'))).toEqual(null)
    expect(calculateDateDifferenceInYears('01/15/2016', '02/08/2019')).toEqual(null)
  })

  it('returns date difference in years if passing valid moment date', () => {
    expect(calculateDateDifferenceInYears(moment('2018-12-31'), moment('2019-02-08'))).toEqual(0)
    expect(calculateDateDifferenceInYears(moment('2017-12-31'), moment('2019-02-08'))).toEqual(1)
    expect(calculateDateDifferenceInYears(moment('1981-12-31'), moment('2019-02-08'))).toEqual(37)
  })

  it('returns date difference in years if passing valid JS Date', () => {
    expect(calculateDateDifferenceInYears(moment('2018-12-31').toDate(), moment('2019-02-08').toDate())).toEqual(0)
    expect(calculateDateDifferenceInYears(moment('2017-12-31').toDate(), moment('2019-02-08').toDate())).toEqual(1)
    expect(calculateDateDifferenceInYears(moment('1981-12-31').toDate(), moment('2019-02-08').toDate())).toEqual(37)
  })

  it('returns date difference in years if passing valid ISO dates in String format', () => {
    expect(calculateDateDifferenceInYears('2018-12-31', '2019-02-08')).toEqual(0)
    expect(calculateDateDifferenceInYears('2007-07-14', '2019-02-08')).toEqual(11)
    expect(calculateDateDifferenceInYears('1981-12-26', '2019-02-08')).toEqual(37)
    expect(calculateDateDifferenceInYears('2012-02-29', '2019-02-08')).toEqual(6)
  })

  describe('sortDate', () => {
    it('sorts by month', () => {
      const dates = ['10/02/2018', '08/02/2018', '11/02/2018']
      expect(dates.sort(sortDate)).toEqual(['08/02/2018', '10/02/2018', '11/02/2018'])
    })

    it('sorts by day', () => {
      const dates = ['10/18/2018', '10/07/2018', '10/09/2018']
      expect(dates.sort(sortDate)).toEqual(['10/07/2018', '10/09/2018', '10/18/2018'])
    })

    it('sorts by year', () => {
      const dates = ['10/18/2020', '10/18/2019', '10/18/2018']
      expect(dates.sort(sortDate)).toEqual(['10/18/2018', '10/18/2019', '10/18/2020'])
    })

    it('sorts by all criteria', () => {
      const dates = ['10/11/2021', '03/01/2021', '05/21/2051', '10/18/2020']
      expect(dates.sort(sortDate)).toEqual(['10/18/2020', '03/01/2021', '10/11/2021', '05/21/2051'])
    })

    it('sorts with undefined values', () => {
      const dates = [
        null,
        '10/11/2021',
        undefined,
        null,
        '03/01/2021',
        null,
        '05/21/2051',
        undefined,
        undefined,
        '10/18/2020',
        undefined,
        null,
      ]
      expect(dates.sort(sortDate)).toEqual([
        '10/18/2020',
        '03/01/2021',
        '10/11/2021',
        '05/21/2051',
        null,
        null,
        null,
        null,
        undefined,
        undefined,
        undefined,
        undefined,
      ])
    })
  })
})
