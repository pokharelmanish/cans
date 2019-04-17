import { isConfidential, isDiscretionNeeded, redactLevels, shouldBeRedacted } from './PrintAssessmentHelper'
const defaultTrue = {
  confidential_by_default: true,
  confidential: false,
}

const defaultFalse = {
  confidential_by_default: false,
  confidential: true,
}

const bothTrue = {
  confidential_by_default: true,
  confidential: true,
}

const bothFalse = {
  confidential_by_default: false,
  confidential: false,
}

describe('isConfidential', () => {
  const assert = (data, expectedResult) => {
    expect(isConfidential(data)).toBe(expectedResult)
  }
  it('isConfidential function works well', () => {
    assert(defaultTrue, false)
    assert(defaultFalse, false)
    assert(bothTrue, true)
    assert(bothFalse, false)
  })
})

describe('isDiscretionNeeded', () => {
  const assert = (data, expectedResult) => {
    expect(isDiscretionNeeded(data)).toBe(expectedResult)
  }
  it('isDiscretionNeeded function works well', () => {
    assert(defaultTrue, false)
    assert(defaultFalse, true)
    assert(bothTrue, false)
    assert(bothFalse, false)
  })
})

describe('#shouldBeRedacted', () => {
  it('should return false when redactLevel = DO_NOT_REDACT', () => {
    expect(shouldBeRedacted(bothTrue, redactLevels.doNotRedact)).toBeFalsy()
  })

  it('should return false when item is not confidential', () => {
    expect(shouldBeRedacted(bothFalse, redactLevels.all)).toBeFalsy()
  })

  it('should return true when redactLevel = ALL and item is confidential or discretion needed', () => {
    expect(shouldBeRedacted(bothTrue, redactLevels.all)).toBeTruthy()
    expect(shouldBeRedacted(defaultFalse, redactLevels.all)).toBeTruthy()
  })

  it('should return true when redactLevel = CONFIDENTIAL and item is confidential', () => {
    expect(shouldBeRedacted(bothTrue, redactLevels.confidential)).toBeTruthy()
    expect(shouldBeRedacted(defaultFalse, redactLevels.confidential)).toBeFalsy()
  })

  it('should return true when redactLevel = DISCRETION_NEEDED and item is discretion needed', () => {
    expect(shouldBeRedacted(defaultFalse, redactLevels.discrationNeeded)).toBeTruthy()
    expect(shouldBeRedacted(bothTrue, redactLevels.discrationNeeded)).toBeFalsy()
  })
})
