// eslint.config.mjs
import js from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs}'],
		extends: [js.configs.recommended],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			ecmaVersion: 2021,
			sourceType: 'module',
		},
		rules: {},
	},

	configPrettier,
	{
		files: ['**/*.{js,mjs,cjs}'],
		plugins: {
			prettier: pluginPrettier,
		},
		rules: {
			'prettier/prettier': 'error',
		},
	},
]);
