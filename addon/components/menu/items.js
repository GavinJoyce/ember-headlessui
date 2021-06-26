import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class Items extends Component {
  @action
  onKeydown(event) {
    switch (event.key) {
      // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-12
      case 'Enter':
        if (this.args.activeItem) {
          this.args.activeItem.element.click();
        }
        this.args.closeMenu();
        break;
      case 'ArrowDown':
        return this.args.goToNextItem();
      case 'ArrowUp':
        return this.args.goToPreviousItem();
      default:
        if (event.key.length === 1) {
          return this.args.search(event.key);
        }
    }
  }
}
