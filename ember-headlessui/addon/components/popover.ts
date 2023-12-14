import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import type PopoverButtonComponent from './popover/button';
import type PopoverOverlayComponent from './popover/overlay';
import type PopoverPanelComponent from './popover/panel';

interface PopoverComponentSignature {
  Element: HTMLElement;
  Args: {
    as?: string | typeof Component;
  };
  Blocks: {
    default: [
      {
        isOpen: boolean;
        close: () => void;
        toggle: () => void;
        Button: typeof PopoverButtonComponent;
        Panel: typeof PopoverPanelComponent;
        Overlay: typeof PopoverOverlayComponent;
      }
    ];
  };
}

export default class PopoverComponent extends Component<PopoverComponentSignature> {
  DEFAULT_TAG_NAME = 'div';

  guid = `${guidFor(this)}-headlessui-popover`;

  @tracked isOpen = false;

  get tagName() {
    return this.args.as || this.DEFAULT_TAG_NAME;
  }

  get buttonGuid() {
    return `${this.guid}-button`;
  }

  get panelGuid() {
    return `${this.guid}-panel`;
  }

  get overlayGuid() {
    return `${this.guid}-overlay`;
  }

  @action
  handleButtonClick() {
    this.isOpen = !this.isOpen;
  }

  @action
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  @action
  open() {
    this.isOpen = true;
  }

  @action
  close() {
    this.isOpen = false;
  }
}
