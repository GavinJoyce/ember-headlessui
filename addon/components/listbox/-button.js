import Component from '@glimmer/component';
import { action } from '@ember/object';

import { modifier } from 'ember-modifier';

export default class ListboxButtonComponent extends Component {
  registerButton = modifier((element) => {
    this.registerButtonElement(element);

    return () => {
      this.unregisterButtonElement(element);
    };
  });

  @action registerButtonElement(element) {
    if (this.args.registerButtonElement) {
      this.args.registerButtonElement(element);
    }
  }

  @action unregisterButtonElement(element) {
    if (this.args.unregisterButtonElement) {
      this.args.unregisterButtonElement(element);
    }
  }
}
