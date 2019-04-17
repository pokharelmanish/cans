export const isConfidential = item => item.confidential_by_default && item.confidential
export const isDiscretionNeeded = item => !item.confidential_by_default && item.confidential
export const shouldBeRedacted = (item, redactLevel) => {
  return (
    (redactLevel === redactLevels.all && item.confidential) ||
    (redactLevel === redactLevels.confidential && isConfidential(item)) ||
    (redactLevel === redactLevels.discrationNeeded && isDiscretionNeeded(item))
  )
}

export const redactLevels = Object.freeze({
  all: 'ALL',
  confidential: 'CONFIDENTIAL',
  discrationNeeded: 'DISCRETION_NEEDED',
  doNotRedact: 'DO_NOT_REDACT',
})
