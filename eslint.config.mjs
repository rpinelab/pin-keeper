import autoImports from './.wxt/eslint-auto-imports.mjs';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';


export default tseslint.config(
  {
    ignores: [
      '.output',
      '.wxt',
    ],
  },
  autoImports,
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
