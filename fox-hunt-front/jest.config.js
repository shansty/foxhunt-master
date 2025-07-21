module.exports = {
  moduleDirectories: ['node_modules', '<rootDir>', '<rootDir>/../common-front'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '^common-front$': '<rootDir>/../common-front/bin/src',
    '^common-front/(.*)$': '<rootDir>/../common-front/bin/src/$1',
    '^.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.svg': '<rootDir>/src/__mocks__/svgrMock.js',
    '#(.*)': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!common-front|chroma-js|another)',
  ],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.svg$': '<rootDir>/svgTransform.js',
  },
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      useESM: true,
      compilerOptions: {
        jsx: 'react-jsx',
      },
    },
  },
  testEnvironment: 'jsdom',
  modulePaths: ['<rootDir>'],
};
