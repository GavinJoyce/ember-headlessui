import Component from '@glimmer/component';

import { modifier } from 'ember-modifier';

export default class ComboboxLabelComponent extends Component {
  registerLabelElement = modifier((element) => {
    this.args.registerLabelElement(element);
  });
}
