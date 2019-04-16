export const isConfidential = item => item.confidential_by_default && item.confidential
export const isDiscretionNeeded = item => !item.confidential_by_default && item.confidential
