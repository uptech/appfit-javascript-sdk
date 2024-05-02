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
      displayName: "browser",
      testMatch: ['<rootDir>/packages/browser/**/*.spec.ts'],
    },
    {
      preset: "ts-jest",
      displayName: "cdn",
      testMatch: ['<rootDir>/packages/cdn/**/*.spec.ts'],
    },
    {
      preset: "ts-jest",
      displayName: "server",
      testMatch: ['<rootDir>/packages/server/**/*.spec.ts'],
    },
    {
      preset: "ts-jest",
      displayName: "shared",
      testMatch: ['<rootDir>/packages/shared/**/*.spec.ts'],
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
