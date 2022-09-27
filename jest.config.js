module.exports = {
  testEnvironment: 'node',  
  rootDir: 'src',
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest"
  },
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  collectCoverageFrom: [
    "**/*.(t|j)sx?$"
  ],
  coverageDirectory: "../coverage",
};
