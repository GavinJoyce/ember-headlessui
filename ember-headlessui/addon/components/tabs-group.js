import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class TABSGROUP extends Component {
  @tracked tabNames = [];
  @tracked Panels = [];
  @tracked currentTab = 0;
  @action
  registerTabNames(e) {
    this.tabNames = [...this.tabNames, e];
  }
  @action
  registerPanel(e) {
    this.Panels = [...this.Panels, e];
  }
  @action
  selectTab(e) {
    this.currentTab = this.tabNames.indexOf(e.target);
  }

  get selectedTab() {
    return this.tabNames[this.currentTab];
  }
  get selectedPanel() {
    return this.Panels[this.currentTab];
  }
}
