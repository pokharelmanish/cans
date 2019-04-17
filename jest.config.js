const path = require('path')
module.exports = {
  verbose: true,
  testURL: 'http://localhost/',
  rootDir: './app/javascript',
  restoreMocks: true,
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  coverageDirectory: path.resolve(__dirname, 'coverage', 'javascript'),
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: ['**/*.js', '!**/index.js', '!**/packs/**'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    './app/javascript/Application/components/Assessment': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
}
