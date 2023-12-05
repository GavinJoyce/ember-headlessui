import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import { modifier } from 'ember-modifier';


interface MenuItemSignature {
  Args: {
    registerItem: (item: Item) => void;
    unregisterItem: (item: Item) => void;
    closeMenu: () => void;
    goToItem: (item: Item) => void;
    isDisabled?: boolean;
  };
  Blocks: {
    default: [{ isActive: boolean; isDisabled: boolean; Element: Element }];
  };
}

export default class Item extends Component<MenuItemSignature> {
  guid = `${guidFor(this)}-tailwindui-menu-item`;
  element?: HTMLElement | null;
  @tracked isActive = false;

  registerItemElement = modifier((element: HTMLElement) => {
    this.element = element;
    this.args.registerItem(this);

    return () => {
      this.element = null;
      this.args.unregisterItem(this);
    };
  });

  get isDisabled() {
    return Boolean(this.args.isDisabled);
  }

  get isEnabled() {
    return !this.isDisabled;
  }

  @action
  focus() {
    if (
      this.element &&
      'focus' in this.element &&
      typeof this.element.focus == 'function'
    )
      this.element?.focus();
  }

  @action
  activate() {
    this.focus();
    this.isActive = true;
  }

  @action
  deactivate() {
    this.isActive = false;
  }

  @action
  onElementClick(event: MouseEvent) {
    if (this.isDisabled) return event.preventDefault();
    this.args.closeMenu();
  }

  @action
  onMouseOver() {
    if (this.args.isDisabled) return;
    if (this.isActive) return;

    this.args.goToItem(this);
  }
}
