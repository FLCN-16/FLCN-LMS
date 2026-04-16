import js from "@eslint/js"
import importPlugin from "eslint-plugin-import"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import { defineConfig, globalIgnores } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.app.json",
        },
      },
    },
    rules: {
      // Import ordering
      "import/order": [
        "warn",
        {
          groups: [
            "builtin", // node built-ins (fs, path…)
            "external", // npm packages
            "internal", // workspace aliases (@flcn-lms/…)
            "parent", // ../
            "sibling", // ./
            "index", // ./index
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "@flcn-lms/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-duplicates": "error",

      // General quality rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off", // handled by @typescript-eslint
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],
      "react-refresh/only-export-components": [
        "error",
        { allowConstantExport: true, extraHOCs: ["withAuth"] },
      ],
    },
  },
])
