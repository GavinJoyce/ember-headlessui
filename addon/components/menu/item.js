import Component from "@glimmer/component";
import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import { tracked } from "@glimmer/tracking";

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

  @action
  registerItemElement(element) {
    this.element = element;
    this.args.registerItem(this);
  }

  @action
  unregisterItemElement() {
    this.element = null;
    this.args.unregisterItem(this);
  }

  @action
  onElementClick(event) {
    if (this.isDisabled) return event.preventDefault();
    this.args.closeMenu();
  }

  @action
  onMouseMove() {
    if (this.args.isDisabled) return;
    if (this.isActive) return;

    this.args.goToItem(this);
  }
}
