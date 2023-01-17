const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['node_modules', 'integration'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: __dirname }),
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  coverageThreshold: {
    global: {
      'branches': 50,
      'functions': 100,
      'lines': 100,
      'statements': 100
    }
  },
  setupFilesAfterEnv: ['jest-extended/all'],
  clearMocks: true,
  verbose: true,
  collectCoverage: false
}
