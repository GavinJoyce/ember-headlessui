import Component from '@glimmer/component';
import { typeOf } from '@ember/utils';
import { guidFor } from '@ember/object/internals';
import { getOwnConfig } from '@embroider/macros';

import { modifier } from 'ember-modifier';

import { Keys } from 'ember-headlessui/utils/keyboard';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

function getPortalRoot() {
  const { rootElement } = getOwnConfig();

  // If we looked up a `rootElement` config at build-time, use that; otherwise use the body
  return rootElement ? document.querySelector(rootElement) : document.body;
}

export default class DialogComponent extends Component {
  @service
  dialogStackProvider;

  DEFAULT_TAG_NAME = 'div';

  guid = `${guidFor(this)}-headlessui-dialog`;
  $portalRoot = getPortalRoot();

  handleEscapeKey = modifier((_element, [isOpen, onClose]) => {
    let handler = (event) => {
      if (event.key !== Keys.Escape) return;
      if (!isOpen) return;

      event.preventDefault();
      event.stopPropagation();

      onClose();
    };

    window.addEventListener('keyup', handler);
    return () => {
      window.removeEventListener('keyup', handler);
    };
  });

  constructor() {
    super(...arguments);

    let { isOpen, onClose } = this.args;

    if (isOpen === undefined && onClose === undefined) {
      throw new Error(
        'You have to provide an `isOpen` and an `onClose` prop to the `Dialog` component.'
      );
    }

    if (isOpen === undefined) {
      throw new Error(
        'You provided an `onClose` prop to the `Dialog`, but forgot an `isOpen` prop.'
      );
    }

    if (onClose === undefined) {
      throw new Error(
        'You provided an `isOpen` prop to the `Dialog`, but forgot an `onClose` prop.'
      );
    }

    if (typeOf(isOpen) !== 'boolean') {
      throw new Error(
        `You provided an \`isOpen\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${isOpen}`
      );
    }

    if (typeOf(onClose) !== 'function') {
      throw new Error(
        `You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${onClose}`
      );
    }
  }

  get tagName() {
    return this.args.as || this.DEFAULT_TAG_NAME;
  }

  get overlayGuid() {
    return `${this.guid}-overlay`;
  }

  get titleGuid() {
    return `${this.guid}-title`;
  }

  get descriptionGuid() {
    return `${this.guid}-description`;
  }

  @action
  onClose() {
    if (this.dialogStackProvider.hasOpenChild(this)) return;
    this.args.onClose();
  }
}
