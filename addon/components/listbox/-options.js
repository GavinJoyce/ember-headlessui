import Component from '@glimmer/component';
import { action } from '@ember/object';

import { modifier } from 'ember-modifier';

export default class ListboxOptionsComponent extends Component {
  registerOptions = modifier((element) => {
    this.registerOptionsElement(element);

    return () => {
      this.unregisterOptionsElement(element);
    };
  });

  @action registerOptionsElement(element) {
    if (this.args.registerOptionsElement) {
      this.args.registerOptionsElement(element);
    }
  }

  @action unregisterOptionsElement(element) {
    if (this.args.unregisterOptionsElement) {
      this.args.unregisterOptionsElement(element);
    }
  }
}
