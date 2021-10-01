import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class ListboxOptionComponent extends Component {
  @tracked guid = `${guidFor(this)}-headlessui-listbox-option`;

  @action
  handleClick(e) {
    e.stopPropagation();
    e.preventDefault();

    this.args.setSelectedOption(this, e);
  }

  get isActiveOption() {
    return this.args.activeOptionGuid == this.guid;
  }

  get isSelectedOption() {
    return this.args.selectedOptionGuid == this.guid;
  }
}
