import Component from '@glimmer/component';

interface PopoverOverlayComponentSignature {
  Element: HTMLElement
  Args: {
    as?: string
    guid?: string
    popoverGuid?: string
    open?: boolean
  }
  Blocks: {
    default?: []
  }
}

export default class PopoverOverlayComponent extends Component<PopoverOverlayComponentSignature> {
  DEFAULT_TAG_NAME = 'div';

  constructor(owner: unknown, args: PopoverOverlayComponentSignature['Args']) {
    super(owner, args);

    let { popoverGuid } = this.args;

    if (!popoverGuid) {
      throw new Error(
        '<Popover::-Overlay /> is missing a parent <Popover /> component.'
      );
    }
  }

  get tagName() {
    return this.args.as || this.DEFAULT_TAG_NAME;
  }
}