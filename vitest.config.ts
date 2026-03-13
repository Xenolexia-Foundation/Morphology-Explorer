import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "packages/analyzer/src/**/*.test.ts",
      "packages/data/**/*.test.ts",
    ],
    exclude: ["**/node_modules/**", "**/dist/**"],
    globals: false,
  },
});
