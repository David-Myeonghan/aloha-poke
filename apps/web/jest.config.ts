import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@mydav/design-system$":
      "<rootDir>/../../packages/design-system/src/index.ts",
    "^hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^queries/(.*)$": "<rootDir>/src/queries/$1",
    "^utils/(.*)$": "<rootDir>/src/utils/$1",
    "^api/(.*)$": "<rootDir>/src/api/$1",
    "^pages/(.*)$": "<rootDir>/src/pages/$1",
    "^components$": "<rootDir>/src/components/index.ts",
    "^components/(.*)$": "<rootDir>/src/components/$1",
    "^pages$": "<rootDir>/src/pages/index.ts",
    "^types/(.*)$": "<rootDir>/src/types/$1",
    "^constants/(.*)$": "<rootDir>/src/constants/$1",
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
  ],
};

export default config;
