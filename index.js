"use strict";

module.exports = {
  name: require("./package").name,

  //TODO: is this a bug in ember-element-helper? We seem to have to do this for it to work
  setupPreprocessorRegistry(_type, registry) {
    registry.add("htmlbars-ast-plugin", {
      name: "element-helper-syntax",

      plugin: require("./node_modules/ember-element-helper/lib/element-helper-syntax-plugin"),

      baseDir: function () {
        return __dirname;
      },
    });
  },
};
