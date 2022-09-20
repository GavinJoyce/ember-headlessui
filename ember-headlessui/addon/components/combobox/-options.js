import Component from '@glimmer/component';

import { modifier } from 'ember-modifier';

export default class ComboboxOptionsComponent extends Component {
  registerOptionsElement = modifier((element) => {
    this.args.registerOptionsElement(element);
  });
}
