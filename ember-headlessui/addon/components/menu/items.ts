/* eslint-disable padding-line-between-statements */
import Component from '@glimmer/component';
import { action } from '@ember/object';

import { Keys } from 'ember-headlessui/utils/keyboard';

import type Item from './item';

interface MenuItemsSignature {
  Args: {
    buttonGuid: string;
    itemsGuid: string;
    isOpen: boolean;
    closeMenu: () => void;
    activeItem: Item;
    registerItem: (item: Item) => void;
    unregisterItem: (item: Item) => void;
    goToFirstItem: () => void;
    goToLastItem: () => void;
    goToNextItem: () => void;
    goToPreviousItem: () => void;
    goToItem: (item: Item) => void;
    search: (key: string) => void;
    searchTaskIsRunning: boolean;
  };
}

export default class Items extends Component<MenuItemsSignature> {
  get menuItemsElementSelector() {
    return `#${this.args.itemsGuid}`;
  }

  @action
  onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-12
      // `Escape` key is handled by focus-trap
      case Keys.Space:
        if (this.args.searchTaskIsRunning) {
          event.preventDefault();
          event.stopPropagation();
          return this.args.search(event.key);
        }
      // eslint-disable-next-line no-fallthrough
      case Keys.Enter:
        if (this.args.activeItem) {
          this.args.activeItem?.element?.click();
        }
        this.args.closeMenu();
        break;
      case Keys.ArrowDown:
        event.preventDefault();
        event.stopPropagation();
        return this.args.goToNextItem();
      case Keys.ArrowUp:
        event.preventDefault();
        event.stopPropagation();
        return this.args.goToPreviousItem();
      case Keys.Home:
      case Keys.PageUp:
        event.preventDefault();
        event.stopPropagation();
        return this.args.goToFirstItem();
      case Keys.End:
      case Keys.PageDown:
        event.preventDefault();
        event.stopPropagation();
        return this.args.goToLastItem();
      default:
        if (event.key.length === 1) {
          return this.args.search(event.key);
        }
    }
  }

  clickInsideMenuTrigger(event: MouseEvent) {
    const buttonElement = document.getElementById(
      this.args.buttonGuid
    ) as HTMLButtonElement | null;

    // The `buttonElement` could not exist if the element has been removed from the DOM
    return buttonElement ? buttonElement.contains(event.target as Node) : false;
  }

  @action
  allowClickOutsideFocusTrap(event: MouseEvent) {
    return this.clickInsideMenuTrigger(event);
  }

  @action
  clickOutsideFocusTrapDeactivates(event: MouseEvent) {
    return !this.clickInsideMenuTrigger(event);
  }
}
