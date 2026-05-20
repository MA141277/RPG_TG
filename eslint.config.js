import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["node_modules/**", "docs/**", "dist/**", "prototypes/**", ".test-dist/**", "tests/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["PascalCase", "UPPER_CASE"],
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "function",
          format: ["camelCase"],
        },
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "property",
          format: null,
        },
        {
          selector: "typeProperty",
          format: null,
        },
      ],
    },
  },
  {
    files: ["src/domain/**/*.ts", "src/content/**/*.ts", "src/application/**/*.ts"],
    ignores: ["src/main.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/ui/**"],
              message: "Domain and application modules must not import UI modules.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/main.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  {
    files: ["src/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/application/**", "**/ui/**"],
              message: "Domain layer must stay independent from application and UI.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/content/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/application/**", "**/ui/**"],
              message: "Content layer must remain pure data without application or UI imports.",
            },
          ],
        },
      ],
    },
  }
);
