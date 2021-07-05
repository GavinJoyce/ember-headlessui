import Service from '@ember/service';
import { action } from '@ember/object';

export default class DialogStackProviderService extends Service {
  stack = [];

  @action
  hasOpenChild(dialog) {
    return this.stack[this.stack.length - 1] !== dialog.guid;
  }

  @action
  remove(dialog) {
    let ix = this.stack.findIndex((guid) => guid === dialog.guid);
    this.stack.splice(ix, 1);
  }

  @action
  push(dialog) {
    this.stack.push(dialog.guid);
  }
}
