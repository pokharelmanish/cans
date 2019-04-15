import { isConfidential, isDiscretionNeeded } from './PrintAssessmentHelper'
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
