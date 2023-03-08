import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import { modifier } from 'ember-modifier';

export default class ComboboxOptionComponent extends Component {
  registerOption = modifier((element) => {
    this.args.registerOptionElement(this, element);

    return () => {
      this.args.unregisterOptionElement(this, element);
    };
  });

  @tracked guid = `${guidFor(this)}-headlessui-combobox-option`;
  index;

  constructor() {
    super(...arguments);
    this.args.registerOption(this);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.args.unregisterOption(this);
  }

  @action
  handleOptionClick(e) {
    e.stopPropagation();
    e.preventDefault();

    if (this.args.disabled) return;

    this.args.setSelectedOption(this, e);
    this.callOnChangeWithSelectedValue();
  }

  @action
  handleMouseOut() {
    if (this.args.hold) return;

    this.args.unsetActiveOption();
  }

  @action
  handleMouseDown(e) {
    if (this.args.disabled) {
      e.preventDefault();
    }
  }

  callOnChangeWithSelectedValue() {
    if (this.args.onChange) {
      let newSelectedValue;

      if (this.isMultiselectable) {
        if (this.isSelectedOption) {
          newSelectedValue = this.args.selectedValue.filter(
            (s) => s !== this.args.value
          );
        } else {
          newSelectedValue = [...this.args.selectedValue, this.args.value];
        }
      } else {
        newSelectedValue = this.args.value;
      }
      this.args.onChange(newSelectedValue);
    }
  }

  get isActiveOption() {
    return this.args.activeOptionGuid === this.guid;
  }

  get isSelectedOption() {
    if (this.isMultiselectable) {
      return this.args.selectedValue.includes(this.args.value);
    } else {
      return this.args.selectedValue === this.args.value;
    }
  }

  get isMultiselectable() {
    return Array.isArray(this.args.selectedValue);
  }
}
