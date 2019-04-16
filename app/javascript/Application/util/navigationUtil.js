import { removeLeadingSlash, removeTrailingSlash } from './formatters'

export const cansBasePath = () => removeTrailingSlash(process.env.CANS_BASE_PATH)

export const createUrl = url => `${cansBasePath()}/${removeLeadingSlash(url)}`
