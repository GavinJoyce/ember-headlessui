import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import { modifier } from 'ember-modifier';

export default class Title extends Component {
  guid = `${guidFor(this)}-tailwindui-tabs-title`;
  @tracked element = null;

  registerTabs = modifier((e) => {
    this.element = e;
    this.args.registerTabNames(e);
  });

  @action
  selectTab(changedTo) {
    let changedFrom = this.args.selectedTab;
    return this.args.selectTab(changedTo, changedFrom);
  }
}
