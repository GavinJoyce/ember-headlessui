import { action } from '@ember/object';
import Service from '@ember/service';

interface WithGuid {
  guid: string;
}

export default class DialogStackProvider extends Service {
  stack: string[] = [];

  get dialogIsOpen() {
    return this.stack.length !== 0;
  }

  @action
  hasOpenChild(dialog: WithGuid) {
    return this.stack[this.stack.length - 1] !== dialog.guid;
  }

  @action
  remove(dialog: WithGuid) {
    let ix = this.stack.findIndex((guid) => guid === dialog.guid);

    this.stack.splice(ix, 1);
  }

  @action
  push(dialog: WithGuid) {
    this.stack.push(dialog.guid);
  }
}
