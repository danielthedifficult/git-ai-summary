module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
    '!<rootDir>/src/types/**/*.js',
  ],
  setupFiles: ['./src/loadEnv.js'],
};
