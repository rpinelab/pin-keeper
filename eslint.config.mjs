import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['.output', '.wxt', 'src/components/ui/*'],
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
  },
  eslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    extends: [
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat['jsx-runtime'],
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@radix-ui/*'],
              message: 'Import from @/components/ui instead.',
            },
          ],
        },
      ],
    },
  },
  {
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          alphabetize: { order: 'asc' },
          'newlines-between': 'always',
        },
      ],
    },
  },
  eslintConfigPrettier,
);
