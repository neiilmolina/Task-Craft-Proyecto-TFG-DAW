module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  coverageDirectory: "coverage",
  testMatch: ["**/tests/**/*.test.ts"], // This matches all .test.ts files inside the tests folder.
  testPathIgnorePatterns: ["/node_modules/", "/path/to/exclude/"], // Exclude certain directories or files
};
