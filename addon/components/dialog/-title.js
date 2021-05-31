import Component from '@glimmer/component';

import { modifier } from 'ember-modifier';

export default class DialogTitleComponent extends Component {
  DEFAULT_TAG_NAME = 'h2';

  constructor() {
    super(...arguments);

    let { dialogGuid } = this.args;

    if (dialogGuid === undefined) {
      throw new Error(
        '<Dialog::-Title /> is missing a parent <Dialog /> component.'
      );
    }
  }

  ariaLabelledby = modifier((element, [dialogGuid]) => {
    let $dialog = document.getElementById(dialogGuid);
    $dialog.setAttribute('aria-labelledby', element.id);

    return () => {
      $dialog.removeAttribute('aria-labelledby');
    };
  });

  get tagName() {
    return this.args.as || this.DEFAULT_TAG_NAME;
  }
}
