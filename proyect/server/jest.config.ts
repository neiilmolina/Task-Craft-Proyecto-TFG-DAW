// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // collectCoverage: true,  // Comenta temporalmente para ver si afecta
  coverageDirectory: 'coverage',
  testMatch: ['**/tests/**/*.test.ts'],
};
