import { totalScoreCalculation, itemFilter } from './DomainScoreHelper'

const fakeRatedRegItems = [{ rating: 1 }, { rating: 2 }, { rating: 3 }]
const fakeRatedNaItems = [{ rating: 1 }, { rating: 2 }, { rating: 8 }]
const fakeUnratedItems = [{ rating: -1 }, { rating: -1 }, { rating: -1 }]
const fakeZeroRatedItems = [{ rating: 0 }, { rating: 0 }, { rating: 0 }]
const fakeMixedRatedItems = [{ rating: -1 }, { rating: 0 }, { rating: 8 }, { rating: 1 }]

describe('totalScoreCalculation ()', () => {
  it('will return correct number when all item with regular rating', () => {
    const actualReturn = totalScoreCalculation(fakeRatedRegItems)
    expect(actualReturn).toBe(6)
  })

  it('will return correct number when items with N/A rating', () => {
    const actualReturn = totalScoreCalculation(fakeRatedNaItems)
    expect(actualReturn).toBe(3)
  })

  it('will return string - when items with out any rating', () => {
    const actualReturn = totalScoreCalculation(fakeUnratedItems)
    expect(actualReturn).toBe('-')
  })

  it('will return 0 when all items are rated with 0 ', () => {
    const actualReturn = totalScoreCalculation(fakeZeroRatedItems)
    expect(actualReturn).toBe(0)
  })

  it('will return correct number when items contain N/A, noneTouched, zero and regular rating ', () => {
    const actualReturn = totalScoreCalculation(fakeMixedRatedItems)
    expect(actualReturn).toBe(1)
  })
})

describe('itemFilter()', () => {
  const fakeItems = [{ id: 1, under_six_id: 'underSix' }, { id: 1, above_six_id: 'aboveSix' }]
  it('will return under six items when isAssessmentUnderSix equal to true', () => {
    const actualReturn = itemFilter(fakeItems, true)
    expect(actualReturn[0].under_six_id).toBe('underSix')
  })

  it('will return above six items when isAssessmentUnderSix equal to false', () => {
    const actualReturn = itemFilter(fakeItems, false)
    expect(actualReturn[0].above_six_id).toBe('aboveSix')
  })
})
