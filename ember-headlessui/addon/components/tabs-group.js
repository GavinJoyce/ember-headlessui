import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class TABSGROUP extends Component {
  tabNames = [];
  @tracked Contents = [];
  @tracked currentTab = 0;
  @action
  registerTabNames(e) {
    this.tabNames = [...this.tabNames, e];
  }
  @action
  registerContent(e) {
    this.Contents = [...this.Contents, e];
  }
  @action
  selectTab(changedTo, changedFrom) {
    this.currentTab = this.tabNames.indexOf(changedTo.target);
    this.pastTab = this.tabNames.indexOf(changedFrom);
    if (this.args.onChange) {
      return this.args.onChange(
        this.tabNames[this.currentTab],
        this.tabNames[this.pastTab],
        this.currentTab
      );
    }
  }

  get selectedTab() {
    return this.tabNames[this.currentTab];
  }
  get selectedContent() {
    return this.Contents[this.currentTab];
  }
}
