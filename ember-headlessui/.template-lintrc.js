'use strict';

module.exports = {
  plugins: ['ember-template-lint-plugin-prettier'],

  extends: ['octane', 'ember-template-lint-plugin-prettier:recommended'],

  rules: {
    'no-down-event-binding': 'warn',
  },
};
