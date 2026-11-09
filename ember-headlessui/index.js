'use strict';

module.exports = {
  name: require('./package').name,

  options: {
    babel: {
      plugins: [
        // Compiles ember-concurrency's `task(async () => {})` syntax
        require.resolve('ember-concurrency/async-arrow-task-transform'),
      ],
    },
  },

  isDevelopingAddon: () => true,
};
