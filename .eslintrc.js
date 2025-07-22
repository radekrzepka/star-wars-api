const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["prettier", "plugin:@typescript-eslint/recommended"],
  env: {
    node: true,
    jest: true,
  },
  plugins: ["only-warn", "@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore common files and directories in a NestJS project
    "node_modules/",
    "dist/",
    "*.js",
    ".nestjs-cli.json",
    ".env",
  ],
  rules: {
    // TypeScript rules
    "@typescript-eslint/array-type": ["warn", { default: "generic" }],
    "@typescript-eslint/consistent-indexed-object-style": "warn",
    "@typescript-eslint/consistent-type-exports": "warn",
    "@typescript-eslint/consistent-type-imports": "warn",
    "no-array-constructor": "off",
    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/no-base-to-string": "error",
    "@typescript-eslint/no-duplicate-enum-values": "error",
    "@typescript-eslint/no-duplicate-type-constituents": "error",
    "@typescript-eslint/no-empty-interface": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-extra-non-null-assertion": "error",
    "@typescript-eslint/no-for-in-array": "error",
    "no-implied-eval": "off",
    "@typescript-eslint/no-implied-eval": "error",
    "no-loss-of-precision": "off",
    "@typescript-eslint/no-loss-of-precision": "error",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-mixed-enums": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-redundant-type-constituents": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-unnecessary-type-constraint": "error",
    "@typescript-eslint/no-unsafe-argument": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-declaration-merging": "error",
    "@typescript-eslint/no-unsafe-enum-comparison": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/prefer-as-const": "error",
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      { allowNumber: true },
    ],
  },
};
