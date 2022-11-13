import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class TabsTabsBasicController extends Controller {
  @tracked activatedIndex = 0;
  titles = ['cars', 'motor cycles', 'boats', 'planes'];
  contents = [
    'cars content',
    'motor cycles content',
    'boats content',
    'planes content',
  ];
  @action
  onChange(activeIndex, changedTo, changedFrom) {
    alert(
      `sure you want to change to ${changedTo.textContent.trim()} from ${changedFrom.textContent.trim()}?`
    );
    this.activatedIndex = activeIndex;
  }
}
