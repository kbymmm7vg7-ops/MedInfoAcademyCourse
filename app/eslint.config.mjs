import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Scoped to test files only, so the default no-unused-vars behavior is
    // unchanged everywhere else in the app.
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      // Allow intentionally-discarded bindings (e.g. positional params in a
      // stub that must match another function's signature) when prefixed
      // with `_`, matching the convention already used in this repo's test
      // stubs.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { args: "all", argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
