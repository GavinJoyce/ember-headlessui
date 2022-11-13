import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { modifier } from 'ember-modifier';

export default class Content extends Component {
  @tracked element = null;
  get renderContent() {
    return this.element === this.args.selectedContent;
  }
  registerContent = modifier((e) => {
    this.element = e;
    this.args.registerContent(e);
  });
}
