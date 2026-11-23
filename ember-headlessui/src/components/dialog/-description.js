import Component from '@glimmer/component';

import { modifier } from 'ember-modifier';

export default class DialogDescriptionComponent extends Component {
  DEFAULT_TAG_NAME = 'p';

  constructor() {
    super(...arguments);

    let { dialogGuid } = this.args;

    if (dialogGuid === undefined) {
      throw new Error(
        '<Dialog::-Description /> is missing a parent <Dialog /> component.'
      );
    }
  }

  ariaDescribedby = modifier((element, [dialogGuid]) => {
    let $dialog = document.getElementById(dialogGuid);
    $dialog.setAttribute('aria-describedby', element.id);

    return () => {
      $dialog.removeAttribute('aria-describedby');
    };
  });

  get tagName() {
    return this.args.as || this.DEFAULT_TAG_NAME;
  }
}
