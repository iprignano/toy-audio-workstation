import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import solid from 'eslint-plugin-solid';

export default tseslint.config(
  {
    ignores: ['dist', 'coverage', '.astro', 'node_modules'],
  },
  {
    files: ['src/**/*.{ts,tsx}', '*.ts', '*.tsx'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      solid.configs['flat/recommended'],
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      solid: {
        env: 'client',
      },
    },
  }
);

