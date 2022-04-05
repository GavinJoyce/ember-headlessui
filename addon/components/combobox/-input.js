import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ComboboxInputComponent extends Component {
  @action
  displayValue(value) {
    if (this.args.displayValue) {
      return this.args.displayValue(value);
    } else {
      return value;
    }
  }

  @action
  handleInput(event) {
    this.args.handleInput(event);
    this.args.onChange?.(event);
  }

  @action
  clearInput() {
    this.args.onChange?.({ target: { value: '' } });
  }
}
