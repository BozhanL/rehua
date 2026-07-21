import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import jest from 'eslint-plugin-jest';
import { configs as sonarjs } from 'eslint-plugin-sonarjs';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const eslintConfig = defineConfig([
  eslint.configs.recommended,
  sonarjs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/consistent-type-exports': 'error',

      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/promise-function-async': 'error',
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
    // NestJS has a lot of empty classes as Module.
    rules: {
      '@typescript-eslint/no-extraneous-class': ['error', { allowEmpty: true }],
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
      // Duplicate of @typescript-eslint/no-unused-vars
      'sonarjs/no-unused-vars': 'off',
      'no-unused-vars': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',

          args: 'all',
          argsIgnorePattern: '^_',

          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',

          destructuredArrayIgnorePattern: '^_',

          reportUsedIgnorePattern: true,
        },
      ],
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
    files: [
      '**/*.test.tsx',
      '**/*.test.ts',
      '**/*.spec.tsx',
      '**/*.spec.ts',
      '**/*e2e-spec.ts',
    ],
    ...jest.configs['flat/all'],
  },
  {
    rules: {
      'jest/no-hooks': 'off',
      'jest/prefer-mock-return-shorthand': 'off',
    },
  },

  globalIgnores(['node_modules/**', 'dist/**', 'coverage/**', '.husky/**']),

  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...tseslint.configs.disableTypeChecked,
  },

  eslintConfigPrettier,
]);

export default eslintConfig;
