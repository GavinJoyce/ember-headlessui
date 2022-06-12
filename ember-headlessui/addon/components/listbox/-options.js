import Component from '@glimmer/component';

import { modifier } from 'ember-modifier';

export default class ListboxOptionsComponent extends Component {
  registerOptions = modifier((element) => {
    this.args.registerOptionsElement(element);

    return () => {
      this.args.unregisterOptionsElement();
    };
  });
}
