import js from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import nextVitals from 'eslint-config-next/core-web-vitals';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { configs as sonarjs } from 'eslint-plugin-sonarjs';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

const eslintConfig = defineConfig([
  nextVitals,
  js.configs.recommended,
  sonarjs.recommended,

  pluginQuery.configs['flat/recommended-strict'],

  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },

  {
    // This check will cause linter halt.
    // Maybe related to https://github.com/typescript-eslint/typescript-eslint/pull/11605
    rules: {
      '@typescript-eslint/no-deprecated': 'off',
    },
  },
  {
    // https://typescript-eslint.io/troubleshooting/typed-linting/performance#eslint-plugin-import
    rules: {
      'import/named': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
    },
  },
  {
    rules: {
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'prefer-arrow-callback': 'error',
      'func-style': ['error', 'declaration'],
    },
  },

  {
    files: ['commitlint.config.js'],
    ...tseslint.configs.disableTypeChecked,
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'coverage/**',
  ]),

  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...tseslint.configs.disableTypeChecked,
  },

  {
    settings: {
      // https://github.com/jsx-eslint/eslint-plugin-react/issues/3977
      // Fix for ESLint 10+: eslint-plugin-react uses context.getFilename() (legacy API)
      // which was removed in ESLint 10 flat config. Declaring the version explicitly
      // prevents the plugin from trying to auto-detect it and failing.
      react: { version: '19' },
    },
  },

  eslintConfigPrettier,
]);

export default eslintConfig;
