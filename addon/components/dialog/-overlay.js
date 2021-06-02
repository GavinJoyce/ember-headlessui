import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class DialogOverlayComponent extends Component {
  DEFAULT_TAG_NAME = 'div';

  constructor() {
    super(...arguments);

    let { dialogGuid } = this.args;

    if (dialogGuid === undefined) {
      throw new Error(
        '<Dialog::-Overlay /> is missing a parent <Dialog /> component.'
      );
    }
  }

  get tagName() {
    return this.args.as || this.DEFAULT_TAG_NAME;
  }

  @action
  handleClick(event) {
    let { onClose } = this.args;
    event.preventDefault();
    event.stopPropagation();

    onClose();
  }
}
