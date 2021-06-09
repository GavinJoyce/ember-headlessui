'use strict';

module.exports = {
  name: require('./package').name,

  options: {
    '@embroider/macros': {
      setOwnConfig: {},
    },
  },

  config(_emberEnv, config) {
    // Pass `rootElement` config into a location where it can be looked up at run-time
    this.options['@embroider/macros'].setOwnConfig.rootElement =
      config.APP.rootElement;
  },
};
