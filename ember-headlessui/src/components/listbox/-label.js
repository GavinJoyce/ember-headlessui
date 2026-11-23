import Component from '@glimmer/component';

import { modifier } from 'ember-modifier';

export default class ListboxLabelComponent extends Component {
  registerLabel = modifier((element) => {
    this.args.registerLabelElement(element);
  });
}
