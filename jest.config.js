module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/unit/**/*.test.ts', '**/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/tests/integration/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  // Floor, not a target: keeps `npm run test:coverage` from silently
  // regressing. Command/provider modules are exercised by the integration
  // tests, so the global numbers sit below the pure-transform suite.
  coverageThreshold: {
    global: {
      statements: 52,
      branches: 42,
      functions: 47,
      lines: 54,
    },
  },
  verbose: true,
  moduleNameMapper: {
    '^vscode$': '<rootDir>/tests/mocks/vscode.ts',
    '^transforms/(.*)$': '<rootDir>/src/transforms/$1',
    '^transforms$': '<rootDir>/src/transforms',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        rootDir: '.',
        baseUrl: '.',
      }
    }]
  },
};