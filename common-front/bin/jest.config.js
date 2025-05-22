/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/config/importJestDOM.ts'],
  moduleNameMapper: {
    '^.+\\.svg$': 'jest-svg-transformer',
  },
};
