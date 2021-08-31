import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';

export default class ListboxOptionComponent extends Component {
  @tracked guid = `${guidFor(this)}-headlessui-listbox`;

  get isActiveOption() {
    return this.args.activeOptionGuid == this.guid + '-option';
  }

  get isSelectedOption() {
    return this.args.selectedOptionGuid == this.guid + '-option';
  }
}
