import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import { next } from "@ember/runloop";

export default class MenuComponent extends Component {
  guid = `${guidFor(this)}-tailwindui-menu`;
  @tracked isOpen = false;

  @action
  toggle() {
    this.isOpen = !this.isOpen;
  }

  @action
  close() {
    this.isOpen = false;
  }

  @action
  onPointerDown(event) {
    if (event.defaultPrevented) return;
    if (!this.isOpen) return;
    //TODO: if (!itemsRef.value?.contains(event.target as HTMLElement)) {
    // this.close();
    next(() => {
      this.buttonElement.focus();
    });
  }

  get itemsGuid() {
    return this.isOpen ? `${this.guid}-items` : undefined;
  }

  get buttonGuid() {
    return `${this.guid}-button`;
  }

  get buttonElement() {
    return document.getElementById(this.buttonGuid);
  }
}
