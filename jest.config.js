module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/payments'],
  testMatch: [
    '**/__tests__/**/*.(js|ts)',
    '**/*.(test|spec).(js|ts)'
  ],
  collectCoverageFrom: [
    'payments/**/*.(js|ts)',
    '!payments/src/sdk/dist/**',
    '!payments/src/sdk/node_modules/**',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};