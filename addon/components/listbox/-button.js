import Component from '@glimmer/component';

import { modifier } from 'ember-modifier';

export default class ListboxButtonComponent extends Component {
  registerButton = modifier((element) => {
    this.args.registerButtonElement(element);

    return () => {
      this.args.unregisterButtonElement(element);
    };
  });
}
