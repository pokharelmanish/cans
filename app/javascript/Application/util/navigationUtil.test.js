import { cansBasePath, createUrl } from './navigationUtil'

describe('navigationUtil', () => {
  const cansBasePathTmp = process.env.CANS_BASE_PATH
  afterAll(() => (process.env.CANS_BASE_PATH = cansBasePathTmp))

  describe('#cansBasePath()', () => {
    it('should return base url path', () => {
      process.env.CANS_BASE_PATH = '/cans'
      expect(cansBasePath()).toBe('/cans')
    })

    it('should return base url path with no trailing slash', () => {
      process.env.CANS_BASE_PATH = '/cans/'
      expect(cansBasePath()).toBe('/cans')
    })
  })

  describe('#createUrl()', () => {
    it('should create url for this environment', () => {
      process.env.CANS_BASE_PATH = '/cans'
      expect(createUrl('page-url')).toBe('/cans/page-url')
      expect(createUrl('/page-url')).toBe('/cans/page-url')
    })
  })
})
