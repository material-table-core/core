import js from '@eslint/js';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '__tests__/coverage/**',
      '__tests__/demo/**',
      'types/**'
    ]
  },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2025,
        // bundlers statically replace process.env.NODE_ENV
        process: 'readonly'
      }
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'no-unused-vars': ['warn', { args: 'none' }]
    }
  },
  {
    files: ['__tests__/**'],
    languageOptions: {
      globals: { ...globals.vitest, ...globals.node }
    }
  },
  {
    files: ['vite.config.js', 'eslint.config.js', 'vitest.setup.js'],
    languageOptions: { globals: { ...globals.node } }
  }
];
