/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

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
