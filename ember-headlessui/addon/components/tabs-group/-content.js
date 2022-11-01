import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class Content extends Component {
  @tracked element = null;
  get renderContent() {
    return this.element === this.args.selectedContent;
  }
  @action
  registerContent(e) {
    this.element = e;
    return this.args.registerContent(e);
  }
}
