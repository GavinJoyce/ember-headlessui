import Component from '@glimmer/component';
import { assert } from '@ember/debug';
import { action } from '@ember/object';

import { modifier } from 'ember-modifier';
export default class TransitionChildComponent extends Component {
  constructor() {
    super(...arguments);

    let { parent } = this.args;

    assert(PARENT_MISSING_ERROR_MESSAGE, typeof parent !== 'undefined');
  }

  trackChild = modifier((element) => {
    this.trackDomNode(element);

    return () => {
      this.untrackDomNode(element);
    };
  });

  @action
  trackDomNode(element) {
    if (this.args.trackDomNode) {
      this.args.trackDomNode(element);
    }
  }

  @action
  untrackDomNode(element) {
    if (this.args.untrackDomNode) {
      this.args.untrackDomNode(element);
    }
  }
}

export const PARENT_MISSING_ERROR_MESSAGE =
  '<Transition::Child /> is missing a parent <Transition /> component.';
