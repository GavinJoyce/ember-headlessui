'use strict';

const { resolve } = require;

module.exports = {
  presets: ['@babel/preset-typescript'],
  plugins: [
    [
      resolve('@babel/plugin-transform-typescript'),
      {
        allowDeclareFields: true,
        onlyRemoveTypeImports: true,
        // Default enums are IIFEs
        optimizeConstEnums: true,
      },
    ],
    [
      resolve('@babel/plugin-proposal-decorators'),
      {
        // The stage 1 implementation
        version: 'legacy',
      },
    ],
    [
      resolve('@babel/plugin-proposal-class-properties'),
      {
        // The stage 1 implementation
        version: 'legacy',
      },
    ],
  ],
};