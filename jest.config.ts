//import type { Config } from "jest"

const config = {
    preset: "ts-jest",
    clearMocks: true,
    collectCoverage: true,
    verbose: true,
    coverageDirectory: "coverage",
    coveragePathIgnorePatterns: ["/node_modules"],
    CoverageProvider: "v8",
    moduleDirectories: ["node_modules", "src"]
};

export default config;
