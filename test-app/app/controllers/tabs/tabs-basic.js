import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class TabsTabsBasicController extends Controller {
  @tracked activeOn = 'hello';
  @action
  onChange(e) {
    this.activeOn = e.textContent.trim();
  }
}
