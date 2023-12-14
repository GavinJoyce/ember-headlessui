/* eslint-disable padding-line-between-statements */
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import { restartableTask, timeout } from 'ember-concurrency';

import type Button from './menu/button';
import type Item from './menu/item';
import type Items from './menu/items';

interface MenuSignature {
  Blocks: {
    default: [
      {
        isOpen: boolean;
        open: () => void;
        close: () => void;
        Button: typeof Button;
        Items: typeof Items;
      }
    ];
  };
}

export default class Menu extends Component<MenuSignature> {
  guid = `${guidFor(this)}-tailwindui-menu`;
  @tracked items: Item[] = [];
  @tracked isOpen = false;
  @tracked activeItem?: Item;
  @tracked searchTerm = '';

  get activeItemIndex() {
    return this.activeItem ? this.items.indexOf(this.activeItem) : -1;
  }

  @action
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  @action
  open() {
    this.isOpen = true;
  }

  @action
  close() {
    this.isOpen = false;
  }

  @action
  goToFirstItem() {
    let firstItem = this.items.find((item) => item.isEnabled);
    this._setActiveItem(firstItem);
  }

  @action
  goToLastItem() {
    let lastItem = this.items
      .slice()
      .reverse()
      .find((item) => item.isEnabled);
    this._setActiveItem(lastItem);
  }

  @action
  goToPreviousItem() {
    let previousItem = this.items
      .slice()
      .reverse()
      .find((item, index) => {
        if (
          this.activeItemIndex !== -1 &&
          this.items.length - index - 1 >= this.activeItemIndex
        ) {
          return false;
        }
        return item.isEnabled;
      });
    this._setActiveItem(previousItem);
  }

  @action
  goToNextItem() {
    let nextItem = this.items.find((item, index) => {
      if (index <= this.activeItemIndex) {
        return false;
      }
      return item.isEnabled;
    });
    this._setActiveItem(nextItem);
  }

  @action
  goToItem(item: Item) {
    this._setActiveItem(item);
  }

  @restartableTask
  *searchTask(nextCharacter: string) {
    this.searchTerm += nextCharacter.toLowerCase();

    const searchResult = this.items.find((item) => {
      const textValue = item.element?.textContent?.toLowerCase().trim();

      return item.isEnabled && textValue?.startsWith(this.searchTerm);
    });

    if (searchResult) {
      this._setActiveItem(searchResult);
    }

    yield timeout(350);

    this.searchTerm = '';
  }

  @action
  async registerItem(item: Item) {
    let { items } = this;

    items.push(item);
    await Promise.resolve(() => (this.items = items));
  }

  @action
  async unregisterItem(item: Item) {
    let { items } = this;

    let index = items.indexOf(item);
    items.splice(index, 1);
    await Promise.resolve(() => (this.items = items));
  }

  _setActiveItem(item?: Item) {
    if (item) {
      this.activeItem = item;
      this.items.forEach((item) => item.deactivate());
      this.activeItem.activate();
      this.itemsElement?.focus();
    }
  }

  get itemsGuid() {
    return `${this.guid}-items`;
  }

  get itemsElement() {
    return document.getElementById(this.itemsGuid);
  }

  get buttonGuid() {
    return `${this.guid}-button`;
  }

  get buttonElement() {
    return document.getElementById(this.buttonGuid);
  }
}
