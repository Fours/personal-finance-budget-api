import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}", // include all files in src
    "!src/**/*.d.ts"            // exclude typescript definitions
  ]
};