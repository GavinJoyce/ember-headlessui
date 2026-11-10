import Component from '@glimmer/component';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class Disclosure extends Component {

  @tracked isOpen = false;

  @action
  toggleState(){
    this.isOpen = !this.isOpen;
  }

}