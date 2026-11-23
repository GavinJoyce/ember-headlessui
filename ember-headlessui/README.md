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

- **v2 addon (>= 0.19.0):** your app needs [ember-auto-import](https://github.com/embroider-build/ember-auto-import) v2 or later, or [Embroider](https://github.com/embroider-build/embroider). Classic apps keep working through `@embroider/addon-shim`.
- **v1 addon (<= 0.18.x):** if your app can't use ember-auto-import v2 yet, stay on the last v1 release: `ember install ember-headlessui@0.18`.

## Compatibility

| ember-headlessui | Addon format | Ember (`ember-source`) | Node  |
| ---------------- | ------------ | ---------------------- | ----- |
| >= 0.19.0        | v2           | 4.8 – 7.x              | >= 20 |
| 0.18.x           | v1           | 4.8 – 7.x              | >= 20 |
| 0.17.x           | v1           | 4.4 – 6.x              | >= 12 |
| <= 0.16.2        | v1           | 3.28 – 6.x             | >= 12 |

From 0.19.0, ember-headlessui is a [v2 addon](https://rfcs.emberjs.com/id/0507-embroider-v2-package-format/). Classic (non-Embroider) apps keep working through `addonV1Shim`.

## Usage

See the [component examples](test-app/app/templates) for usage samples.

### Classic `.hbs` templates (v1 and v2)

The components, services and modifiers are added to your app, so components resolve by name in loose-mode templates: `<Menu>`, `<Listbox>`, `<Combobox>`, `<Dialog>`, `<RadioGroup>`, `<Switch>` and `<Transition>`. This works the same for the v1 and v2 addon formats.

```hbs
<Menu as |menu|>
  <menu.Button>Options</menu.Button>
  <menu.Items as |items|>
    <items.Item as |item|>
      <item.Element class={{if item.isActive "bg-indigo-500 text-white"}}>
        Account settings
      </item.Element>
    </items.Item>
  </menu.Items>
</Menu>
```

### Template tag `.gjs` / `.gts` (v2 only)

From 0.19.0 you can import components directly, which is required in strict-mode (template tag) components:

```gjs
import Menu from 'ember-headlessui/components/menu';

<template>
  <Menu as |menu|>
    <menu.Button>Options</menu.Button>
    <menu.Items as |items|>
      <items.Item as |item|>
        <item.Element>Account settings</item.Element>
      </items.Item>
    </menu.Items>
  </Menu>
</template>
```

Import paths mirror the addon's `src/` folder, e.g. `ember-headlessui/components/dialog` or `ember-headlessui/components/listbox`. Type declarations are published in `declarations/` for the modules written in TypeScript.

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
