import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import eslintRecommended from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        es2021: true,
        jest: true, // Add jest globals
      },
      ecmaVersion: 12,
      sourceType: 'module',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
  },
  eslintRecommended.configs.recommended,
  pluginReact.configs.flat.recommended,
];