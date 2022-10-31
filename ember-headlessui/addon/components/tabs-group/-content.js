import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class Content extends Component {
  @tracked element = null;
  get renderPanel() {
    return this.element === this.args.selectedPanel;
  }
  @action
  registerPanel(e) {
    this.element = e;
    return this.args.registerPanel(e);
  }
}
