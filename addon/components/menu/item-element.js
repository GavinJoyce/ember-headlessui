import Component from '@glimmer/component';
import { action } from '@ember/object';

import { modifier } from 'ember-modifier';

export default class ItemElement extends Component {
  registerElement = modifier((element) => {
    this.registerItemElement(element);

    return () => {
      this.unregisterItemElement(element);
    };
  });

  @action registerItemElement(element) {
    if (this.args.registerItemElement) {
      this.args.registerItemElement(element);
    }
  }

  @action unregisterItemElement(element) {
    if (this.args.registerItemElement) {
      this.args.registerItemElement(element);
    }
  }
}
