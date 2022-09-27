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

  @action
  handleOptionClick(e) {
    e.stopPropagation();
    e.preventDefault();

    if (this.args.disabled) return;

    this.args.setSelectedOption(this, e);
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

  get isActiveOption() {
    return this.args.activeOptionGuid === this.guid;
  }

  get isSelectedOption() {
    return this.args.selectedOptionGuids.includes(this.guid);
  }
}
