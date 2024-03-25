/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  rootDir: ".",
  projects: [
    {
      preset: "ts-jest",
      displayName: "appfit-browser-sdk",
      testMatch: ['<rootDir>/packages/appfit-browser-sdk/**/*.spec.ts'],
    },
    {
      preset: "ts-jest",
      displayName: "appfit-server-sdk",
      testMatch: ['<rootDir>/packages/appfit-server-sdk/**/*.spec.ts'],
    },
    {
      preset: "ts-jest",
      displayName: "appfit-shared",
      testMatch: ['<rootDir>/packages/appfit-shared/**/*.spec.ts'],
    },
  ],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  collectCoverageFrom: [
    "**/*.(t|j)s"
  ],
  coverageDirectory: "./coverage",
  testEnvironment: 'node',
};
