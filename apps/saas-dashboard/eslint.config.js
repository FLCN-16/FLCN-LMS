import eslintConfig from "@flcn-lms/eslint-config"

export default [
  ...eslintConfig,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": ["warn", { extraHOCs: ["withAuth"] }],
    },
  },
]
