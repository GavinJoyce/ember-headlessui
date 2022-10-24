import Component from '@glimmer/component';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';


export default class Button extends Component {
  guid = `${guidFor(this)}-tailwindui-disclosure-button`;


  get itemsGuid() {
    return `${this.guid}-items`;
  }

  get buttonGuid() {
    return `${this.guid}-button`;
  }
}