'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const getChannelURL = require('ember-source-channel-url');
// const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

const addonDir = path.resolve(__dirname, '../../ember-headlessui');

// Ember 7 ships ember-source as a v2 addon, so ember-auto-import resolves
// Ember's modules from the addon's own location. Through the workspace link
// that finds the addon's devDependencies (ember-source 4.8) instead of the
// app's Ember, and the addon's imports of `@glimmer/tracking` etc. end up
// pointing at modules that don't exist. A published install has no
// devDependencies, so test Ember 7 against the packed addon, the way apps
// consume it. Run `pnpm build` first; this packs the existing build.
function packedAddon() {
  let destination = path.resolve(__dirname, '../tmp/ember-try');

  fs.mkdirSync(destination, { recursive: true });

  let [{ filename }] = JSON.parse(
    execFileSync(
      'npm',
      ['pack', '--json', '--ignore-scripts', '--pack-destination', destination],
      { cwd: addonDir, encoding: 'utf8' }
    )
  );

  return `file:${path.join(destination, filename)}`;
}

function ember7Scenario(name, emberSource) {
  return {
    name,
    npm: {
      dependencies: {
        'ember-headlessui': packedAddon(),
      },
      devDependencies: {
        'ember-source': emberSource,
        // @glimmer/component 1.x imports `ember`, which Ember 7 removed
        '@glimmer/component': '^2.2.1',
      },
    },
  };
}

module.exports = async function () {
  return {
    usePnpm: true,
    scenarios: [
      {
        name: 'ember-lts-4.8',
        npm: {
          devDependencies: {
            'ember-source': '~4.8.0',
          },
        },
      },
      {
        name: 'ember-lts-5.12',
        npm: {
          devDependencies: {
            'ember-source': '~5.12.0',
          },
        },
      },
      {
        name: 'ember-lts-6.12',
        npm: {
          devDependencies: {
            'ember-source': '~6.12.0',
          },
        },
      },
      ember7Scenario('ember-release', await getChannelURL('release')),
      ember7Scenario('ember-beta', await getChannelURL('beta')),
      ember7Scenario('ember-canary', await getChannelURL('canary')),
      // embroiderSafe(), // FIXME: https://github.com/GavinJoyce/ember-headlessui/issues/34
      // embroiderOptimized(),
    ],
  };
};
