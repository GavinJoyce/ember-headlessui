import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class TABSGROUP extends Component {
  tabNames = [];
  Contents = [];
  @tracked currentTab = null;
  @action
  registerTabNames(e) {
    this.tabNames = [...this.tabNames, e];
  }
  @action
  registerContent(e) {
    this.Contents = [...this.Contents, e];
    this.currentTab = 0;
  }
  @action
  selectTab(changedTo, changedFrom) {
    this.currentTab = this.tabNames.indexOf(changedTo.target);
    this.pastTab = this.tabNames.indexOf(changedFrom);
    if (this.args.onChange) {
      return this.args.onChange(
        this.currentTab,
        this.tabNames[this.currentTab],
        this.tabNames[this.pastTab]
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
