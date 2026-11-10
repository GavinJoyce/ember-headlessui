import Component from '@glimmer/component';

import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';

export default class Panel extends Component {
  panelGuid = `${guidFor(this)}-tailwindui-disclosure-panel`;
  
  @tracked isOpen = false;  
}