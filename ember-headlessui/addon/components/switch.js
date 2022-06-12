import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class Switch extends Component {
  guid = `${guidFor(this)}-tailwindui-switch`;
  labelGuid = `${this.guid}-label`;
  buttonGuid = `${this.guid}-button`;

  @action
  onLabelClick() {
    let buttonElement = document.getElementById(this.buttonGuid);
    buttonElement.click();
    buttonElement.focus();
  }

  @action
  onButtonClick(event) {
    event.preventDefault();
    this._toggle();
  }

  @action
  onButtonKeyUp(event) {
    event.preventDefault();
    if (event.key === ' ') {
      event.preventDefault();
      this._toggle();
    }
  }

  _toggle() {
    this.args.onUpdate(!this.args.isOn);
  }
}
