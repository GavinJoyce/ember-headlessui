import Component from '@glimmer/component';
import { action } from '@ember/object';

interface PopoverPanelComponentSignature {
  Element: HTMLElement;
  Args: {
    as?: string | typeof Component;
    guid?: string;
    popoverGuid?: string;
    panelGuid?: string;
    buttonGuid?: string;
    static?: boolean;
    unmount?: boolean;
    open?: boolean;
    close?(): void;
    onFocusDeactivate?(): void;
  };
  Blocks: {
    default: [];
  };
}

export default class PopoverPanelComponent extends Component<PopoverPanelComponentSignature> {
  DEFAULT_TAG_NAME = 'div';

  constructor(owner: unknown, args: PopoverPanelComponentSignature['Args']) {
    super(owner, args);

    let { popoverGuid } = this.args;

    if (!popoverGuid) {
      throw new Error(
        '<Popover::-Panel /> is missing a parent <Popover /> component.'
      );
    }

    if (this.args.static !== undefined && this.args.unmount !== undefined) {
      throw new Error(
        '<Popover::Panel /> cannot be passed `@static` and `@unmount` at the same time'
      );
    }
  }

  get popoverPanelElementSelector() {
    return `#${this.args.panelGuid}`;
  }

  get tagName() {
    return this.args.as || this.DEFAULT_TAG_NAME;
  }

  @action
  clickInsidePanelTrigger(event: Event) {
    const buttonElement = this.args.buttonGuid
      ? document.getElementById(this.args.buttonGuid)
      : undefined;

    // The `buttonElement` could not exist if the element has been removed from the DOM
    return buttonElement ? buttonElement.contains(event.target as Node) : false;
  }

  @action
  allowClickOutsideFocusTrap(event: Event) {
    return this.clickInsidePanelTrigger(event);
  }

  @action
  clickOutsideDeactivates(event: Event) {
    return !this.clickInsidePanelTrigger(event);
  }

  @action
  onFocusDeactivate(event: Event) {
    const clickInsidePanelTrigger = this.clickInsidePanelTrigger(event);

    if (clickInsidePanelTrigger) return false;

    return this.args.onFocusDeactivate?.();
  }
}
