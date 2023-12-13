import Component from '@glimmer/component';

interface PopoverButtonComponentSignature {
  Element: HTMLElement
  Args: {
    as?: string
    guid?: string
    popoverGuid?: string
    panelGuid?: string
    onClick?: () => void
    open?: boolean
  }
  Blocks: {
    default?: []
  }
}

export default class PopoverButtonComponent extends Component<PopoverButtonComponentSignature> {
  DEFAULT_TAG_NAME = 'button';

  constructor(owner: unknown, args: PopoverButtonComponentSignature['Args']) {
    super(owner, args);

    let { popoverGuid } = this.args;

    if (!popoverGuid) {
      throw new Error(
        '<Popover::-Button /> is missing a parent <Popover /> component.'
      );
    }
  }

  get tagName() {
    return this.args.as || this.DEFAULT_TAG_NAME;
  }
}