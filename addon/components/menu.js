import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { next } from '@ember/runloop';

export default class Menu extends Component {
  guid = `${guidFor(this)}-tailwindui-menu`;
  @tracked isOpen = false;
  @tracked items = [];
  @tracked activeItem;

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
    if (this.isOpen) {
      this.isOpen = false;
      next(() => {
        this.buttonElement && this.buttonElement.focus();
      });
    }
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

  @action
  registerItem(item) {
    let { items } = this;

    items.push(item);
    this.items = items;
  }

  @action
  unregisterItem(item) {
    let { items } = this;

    let index = items.indexOf(item);
    items.splice(index, 1);
    this.items = items;
  }

  @action
  onPointerDown(event) {
    if (event.defaultPrevented) return;
    if (!this.isOpen) return;

    next(() => {
      this.buttonElement.focus();
    });
  }

  _setActiveItem(item) {
    if (item) {
      this.activeItem = item;
      this.items.forEach((item) => item.deactivate());
      this.activeItem.activate();
      this.itemsElement.focus();
    }
  }

  get itemsGuid() {
    return this.isOpen ? `${this.guid}-items` : undefined;
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
