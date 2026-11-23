# ember-headlessui

[![ember-headlessui Actions Status](https://github.com/GavinJoyce/ember-headlessui/workflows/CI/badge.svg)](https://github.com/GavinJoyce/ember-headlessui/actions)

This is a work-in-progress implementation of:

- https://github.com/tailwindlabs/headlessui

A set of completely unstyled, fully accessible UI components for Ember.js, designed to integrate beautifully with Tailwind CSS.

![ember-headlessui](https://user-images.githubusercontent.com/2526/110099076-ce070680-7d98-11eb-932b-afc075fc7b62.gif)

## Installation

```
ember install ember-headlessui
```

## Compatibility

| ember-headlessui | Ember (`ember-source`) | Node  |
| ---------------- | ---------------------- | ----- |
| 0.18.x           | 4.8 – 7.x              | >= 20 |
| 0.17.x           | 4.4 – 6.x              | >= 12 |
| <= 0.16.2        | 3.28 – 6.x             | >= 12 |

## Usage

See the [component examples](test-app/app/templates) for usage samples.

## Local Development

This is a pnpm monorepo:

- `ember-headlessui/` is the addon, published to npm as a [v2 addon](https://rfcs.emberjs.com/id/0507-embroider-v2-package-format/). Its source lives in `src/`; rollup builds it into `dist/` and `tsc` emits type declarations into `declarations/`.
- `test-app/` is the Ember app that hosts the test suite and the component examples.

The test-app uses the built addon, so build it before running the test-app on its own.

```bash
# Install dependencies
pnpm install

# Build the addon (dist/ and declarations/)
pnpm build

# Rebuild the addon on change and run the test-app (http://localhost:4200)
pnpm dev

# Build the addon, then run the tests
pnpm test

# Linting
pnpm lint
pnpm lint:fix
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
