import Component from '@glimmer/component';
import { action } from '@ember/object';
import { next } from '@ember/runloop';

import { Keys } from 'ember-headlessui/utils/keyboard';

interface MenuButtonSignature {
  Args: {
    buttonGuid: string;
    itemsGuid: string;
    isOpen: boolean;
    openMenu: () => void;
    closeMenu: () => void;
    toggleMenu: () => void;
    goToFirstItem: () => void;
    goToLastItem: () => void;
    goToNextItem: () => void;
    goToPreviousItem: () => void;
  };
  Blocks: {
    default: [];
  };
}

export default class Button extends Component<MenuButtonSignature> {
  @action
  onKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLButtonElement | undefined;

    if (target?.disabled) return;

    switch (event.key) {
      case Keys.Space:
      case Keys.Enter:
      case Keys.ArrowDown:
        event.preventDefault();
        event.stopPropagation();

        if (this.args.isOpen && event.key === Keys.Enter) {
          this.args.closeMenu();
        } else {
          this.args.openMenu();
          next(() => {
            this.args.goToFirstItem();
          });
        }

        break;
      case Keys.ArrowUp:
        event.preventDefault();
        event.stopPropagation();
        this.args.openMenu();

        next(() => {
          this.args.goToLastItem();
        });
        break;
    }
  }
}
