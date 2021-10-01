import Component from '@glimmer/component';
import { action } from '@ember/object';
import { next } from '@ember/runloop';

import { Keys } from 'ember-headlessui/utils/keyboard';

export default class Button extends Component {
  @action
  onKeydown(event) {
    switch (event.key) {
      case Keys.Space:
      case Keys.Enter:
      case Keys.ArrowDown:
        event.preventDefault();

        if (this.args.isOpen && event.key === Keys.Enter) {
          this.args.closeMenu();
        } else {
          this.args.openMenu();
          next(() => {
            this.args.goToFirstItem();
          });
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.args.openMenu();

        next(() => {
          this.args.goToLastItem();
        });
        break;
    }
  }
}
