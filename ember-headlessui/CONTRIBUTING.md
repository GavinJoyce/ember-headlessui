# How To Contribute

## Installation

- `git clone <repository-url>`
- `cd ember-headlessui`
- `pnpm install`

## Linting

- `pnpm lint`
- `pnpm lint:fix`

## Building the addon

The addon source lives in `ember-headlessui/src/`. The test-app uses the built output, so build the addon first:

- `pnpm build` – Builds `ember-headlessui/dist/` and the type declarations in `ember-headlessui/declarations/`

## Running tests

- `pnpm test` – Builds the addon and runs the test suite on the current Ember version
- `pnpm --filter test-app exec ember test --server` – Runs the test suite in "watch mode" (run `pnpm build` first)
- `pnpm --filter test-app exec ember try:each` – Runs the test suite against multiple Ember versions (run `pnpm build` first)

## Running the test-app

- `pnpm dev` – Rebuilds the addon on change and serves the test-app
- Visit the test-app at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
