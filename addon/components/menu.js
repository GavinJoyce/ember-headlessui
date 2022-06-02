import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import { restartableTask, timeout } from 'ember-concurrency';

export default class Menu extends Component {
  guid = `${guidFor(this)}-tailwindui-menu`;
  _items = [];
  @tracked isOpen = false;
  @tracked activeItem;
  @tracked searchTerm = '';

  get items() {
    return this._items;
  }

  get activeItemIndex() {
    return this.items.indexOf(this.activeItem);
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
  goToItem(item) {
    this._setActiveItem(item);
  }

  @restartableTask
  *searchTask(nextCharacter) {
    this.searchTerm += nextCharacter.toLowerCase();

    const searchResult = this.items.find((item) => {
      const textValue = item.element.textContent.toLowerCase().trim();

      return item.isEnabled && textValue.startsWith(this.searchTerm);
    });

    if (searchResult) {
      this._setActiveItem(searchResult);
    }

    yield timeout(350);

    this.searchTerm = '';
  }

  @action
  registerItem(item) {
    let { _items } = this;

    _items.push(item);
    this._items = _items;
  }

  @action
  unregisterItem(item) {
    let { _items } = this;

    let index = _items.indexOf(item);
    _items.splice(index, 1);
    this._items = _items;
  }

  _setActiveItem(item) {
    if (item) {
      this.activeItem = item;
      this._items.forEach((item) => item.deactivate());
      this.activeItem.activate();
      this.itemsElement.focus();
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
