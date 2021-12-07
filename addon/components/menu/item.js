import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import { modifier } from 'ember-modifier';

export default class Item extends Component {
  guid = `${guidFor(this)}-tailwindui-menu-item`;
  element;
  @tracked isActive = false;

  get isDisabled() {
    return Boolean(this.args.isDisabled);
  }

  get isEnabled() {
    return !this.isDisabled;
  }

  @action
  focus() {
    this.element.focus();
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

  registerItemElement = modifier((element) => {
    this.element = element;
    this.args.registerItem(this);

    return () => {
      this.element = null;
      this.args.unregisterItem(this);
    };
  });

  @action
  onElementClick(event) {
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
