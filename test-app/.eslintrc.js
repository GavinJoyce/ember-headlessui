'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

// accommodates: JS, TS, App, and Addon
const config = configs.ember();

module.exports = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: ['**/*.js', '**/*.ts'],
      rules: {
        'prettier/prettier': ['error', require('./.prettierrc')],
      },
    },
  ],
};
