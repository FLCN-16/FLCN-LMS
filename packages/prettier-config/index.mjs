const tailwindStylesheet = new URL(
  "../ui/src/styles/globals.css",
  import.meta.url
)

const config = {
  endOfLine: "lf",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 80,
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "^react$",
    "^next(/.*)?$",
    "",
    "^@flcn-lms/(.*)$",
    "",
    "^@/(.*)$",
    "",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  tailwindStylesheet: tailwindStylesheet.pathname,
  tailwindFunctions: ["cn", "cva"],
}

export default config
