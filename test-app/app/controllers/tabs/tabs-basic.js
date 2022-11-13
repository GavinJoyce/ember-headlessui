import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class TabsTabsBasicController extends Controller {
  @tracked activatedIndex = 0;
  titles = ['hello', 'hello1', 'hello2', 'hello3'];
  contents = ['hello world', 'hello world 1', 'hello world 2', 'hello world 3'];
  @action
  onChange(e, f, g) {
    alert(
      `sure you want to change tp ${e.textContent.trim()} from ${f.textContent.trim()}`
    );
    this.activatedIndex = g;
  }
}
