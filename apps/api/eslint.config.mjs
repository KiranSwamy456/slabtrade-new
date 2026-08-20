import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  eslintConfigPrettier,

  {
    files: ["**/*.ts"],

    languageOptions: {
      parser: tseslint.parser,

      parserOptions: {
        project: "./tsconfig.json",
      },

      globals: {
        ...globals.node,
      },
    },

    rules: {
      "no-console": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];
