import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class Title extends Component {
  guid = `${guidFor(this)}-tailwindui-tabs-title`;
  @tracked element = null;
  get isSelected() {
    return this.element === this.args.selectedTab;
  }
  @action
  registerTabNames(e) {
    this.element = e;
    return this.args.registerTabNames(e);
  }
  @action
  selectTab(e) {
    return this.args.selectTab(e);
  }
}
