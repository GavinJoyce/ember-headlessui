import Component from '@glimmer/component';

import { modifier } from 'ember-modifier';

export default class ComboboxButtonComponent extends Component {
  registerButtonElement = modifier((element) => {
    this.args.registerButtonElement(element);

    return () => {
      this.args.unregisterButtonElement();
    };
  });
}
