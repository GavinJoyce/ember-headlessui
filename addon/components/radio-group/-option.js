import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class Option extends Component {
  guid = guidFor(this);
  element;
  id = `headlessui-radiogroup-option-${this.guid}`;
  label = `headlessui-label-${this.guid}`;
  value = this.args.value;

  constructor() {
    super(...arguments);

    let { radioGroupGuid } = this.args;

    if (radioGroupGuid === undefined) {
      throw new Error(
        '<RadioGroup::-Option /> is missing a parent <RadioGroup /> component.'
      );
    }
  }

  @action
  onClick(value) {
    if (this.args.disabled) return;

    let hasOptionNotBeenSelected = this.args.selectedValue !== value;

    if (this.args.onChange && hasOptionNotBeenSelected) {
      this.args.onChange(value);
    }

    this.args.handleClick(value);
  }

  @action
  registerOptionElement(element) {
    this.element = element;
    this.args.registerOption(this);
  }

  @action
  unregisterOptionElement() {
    this.element = null;
    this.args.unregisterOption(this);
  }
}
