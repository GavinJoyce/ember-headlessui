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
export { default as Dialog } from './components/dialog';
export { default as ListBox } from './components/listbox';
export { default as Menu } from './components/menu';
export { default as Switch } from './components/switch';
export { default as Transition } from './components/transition';
