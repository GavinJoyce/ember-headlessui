import Component from '@glimmer/component';
import { action } from '@ember/object';

import { modifier } from 'ember-modifier';

export default class ListboxLabelComponent extends Component {
  registerLabel = modifier((element) => {
    this.registerLabelElement(element);
  });

  @action registerLabelElement(element) {
    if (this.args.registerLabelElement) {
      this.args.registerLabelElement(element);
    }
  }
}
