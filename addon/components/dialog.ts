import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import { typeOf } from '@ember/utils';

import { getOwnConfig } from '@embroider/macros';
import { Keys } from 'ember-headlessui/utils/keyboard';
import { modifier } from 'ember-modifier';

import type DialogStackProvider from 'ember-headlessui/services/dialog-stack-provider';

/**
 * Expose the element that the `Dialog` should be "slotted" into
 *
 * This is exported _only_ for testing purposes; do not consider this API to be public
 *
 * @private
 */
export function getPortalRoot() {
  const { rootElement } = getOwnConfig();

  // If we looked up a `rootElement` config at build-time, use that; otherwise use the body
  return rootElement ? document.querySelector(rootElement) : document.body;
}

interface Args {
  isOpen: boolean;
  onClose: () => void;
  as: string | typeof Component;
}

export default class DialogComponent extends Component<Args> {
  @service declare dialogStackProvider: DialogStackProvider;

  DEFAULT_TAG_NAME = 'div';

  guid = `${guidFor(this)}-headlessui-dialog`;
  $portalRoot = getPortalRoot();
  outsideClickedElement: HTMLElement | null = null;

  handleEscapeKey = modifier(
    (_element, [isOpen, onClose]: [boolean, () => void]) => {
      let handler = (event: KeyboardEvent) => {
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
    }
  );

  lockWindowScroll = modifier(() => {
    // Opt-out of some other dialog already locked scrolling
    if (this.dialogStackProvider.dialogIsOpen) {
      return;
    }

    let overflow = this.$portalRoot.style.overflow;
    let paddingRight = this.$portalRoot.style.paddingRight;

    // Setting `overflow: hidden` will suddenly hide the scroll bar on the window, which can cause horizontal
    // layout shifting when the `Dialog` becomes open
    // By applying the width of the scroll bar as padding, we can avoid that layout shift from happening
    let scrollbarWidth = window.innerWidth - this.$portalRoot.clientWidth;

    this.$portalRoot.style.overflow = 'hidden';
    this.$portalRoot.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      this.$portalRoot.style.overflow = overflow;
      this.$portalRoot.style.paddingRight = paddingRight;
    };
  });

  constructor(owner: unknown, args: Args) {
    super(owner, args);

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

  get dialogElementSelector() {
    return `#${this.guid}`;
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
  setReturnFocus(trigger: HTMLElement) {
    return this.outsideClickedElement ? this.outsideClickedElement : trigger;
  }

  @action
  allowOutsideClick(e: MouseEvent) {
    let target = e.target as HTMLElement;

    if (target && target.tagName !== 'BODY') {
      this.outsideClickedElement = target;
    }

    this.onClose();

    return true;
  }

  @action
  onClose() {
    if (this.dialogStackProvider.hasOpenChild(this)) return;
    this.args.onClose();
  }
}
