import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import { version } from 'react';

export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { settings: { react: { version } } },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        module: 'readonly'
      }
    }
  },
  { rules: { 'react/react-in-jsx-scope': 'off' } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended
];
