/* eslint-disable @typescript-eslint/ban-ts-comment */
// Public API
//
// Tradeoffs with using the short-hand imports:
//  - the entirety of the addon will be included in the bundle
//  - tree-shaking will be required to undo including everything in the bundle
//
//  Pros:
//    - unified import, `import { Menu } from 'ember-headlessui';`
//    - Public API is clearly declared
//      any other components / modifiers / etc, are considered Private API

// As we move this library to be more typescript, these
// expect-error flags will throw errors during type-checking
// and can be removed
// @ts-expect-error
export { default as Dialog } from './dialog';
// @ts-expect-error
export { default as ListBox } from './list-box';
// @ts-expect-error
export { default as Menu } from './menu';
// @ts-expect-error
export { default as Switch } from './switch';
// @ts-expect-error
export { default as Transition } from './transition';
