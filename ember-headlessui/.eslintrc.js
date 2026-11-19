'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

// accommodates: JS, TS, App, and Addon
const config = configs.ember();

// The shared config targets the v1 `addon/` layout. This is a v2 addon whose
// source lives in `src/`, so apply the addon overrides there instead.
const overrides = config.overrides.map((override) => {
  const files = [].concat(override.files);

  if (!files.some((file) => file.startsWith('./addon/'))) {
    return override;
  }

  return {
    ...override,
    files: files.map((file) => file.replace(/^\.\/addon\//, './src/')),
  };
});

module.exports = {
  ...config,
  overrides: [
    ...overrides,
    {
      files: ['**/*.js', '**/*.ts'],
      rules: {
        'prettier/prettier': ['error', require('./.prettierrc')],
      },
    },
  ],
};
