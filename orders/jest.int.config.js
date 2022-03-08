module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.int.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
