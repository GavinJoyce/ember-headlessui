import Component from '@glimmer/component';
import { assert } from '@ember/debug';
export default class TransitionChildComponent extends Component {
  constructor() {
    super(...arguments);

    let { parent } = this.args;

    assert(PARENT_MISSING_ERROR_MESSAGE, typeof parent !== 'undefined');
  }
}

export const PARENT_MISSING_ERROR_MESSAGE =
  '<Transition::Child /> is missing a parent <Transition /> component.';
