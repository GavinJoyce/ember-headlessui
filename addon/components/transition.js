import Component from '@glimmer/component';
import { getValue } from '@glimmer/tracking/primitives/cache';
import { invokeHelper } from '@ember/helper';
import { action } from '@ember/object';
import { schedule } from '@ember/runloop';
import { assert } from '@ember/debug';
import {
  AppliedClassNamesManager,
  TransitionVisibilityManager,
} from '../helpers/transition';

export default class TransitionComponent extends Component {
  constructor() {
    super(...arguments);

    let { show } = this.args;

    assert(ARG_SHOW_MISSING_ERROR_MESSAGE, typeof show === 'boolean');

    schedule('afterRender', () => {
      this.initialRender = false;
    });
  }

  get tagName() {
    return this.args.tagName ?? 'div';
  }

  get unmount() {
    return this.args.unmount ?? true;
  }

  /* === Component Visibility Management === */

  allTransitionDomNodes = new Set();

  transitionVisibilityManager = invokeHelper(
    this,
    TransitionVisibilityManager,
    () => ({
      positional: [this.allTransitionDomNodes, this.args.show],
    })
  );

  get componentIsVisible() {
    return getValue(this.transitionVisibilityManager);
  }

  get componentIsMounted() {
    return this.unmount ? this.componentIsVisible : true;
  }

  get componentIsHidden() {
    return this.unmount ? false : !this.componentIsVisible;
  }

  @action
  trackDomNode(element) {
    this.allTransitionDomNodes.add(element);
  }

  @action
  untrackDomNode(element) {
    this.allTransitionDomNodes.delete(element);
  }

  /* === Transition Class Name Management === */

  initialRender = true;

  /** @type {HTMLElement} */
  ownDomNode;

  appliedClassNamesManager = invokeHelper(
    this,
    AppliedClassNamesManager,
    () => ({
      positional: [this, this.args.show],
    })
  );

  get transitionClassNames() {
    return getValue(this.appliedClassNamesManager);
  }
}

export const ARG_SHOW_MISSING_ERROR_MESSAGE =
  'You have to provide a `show` prop to the `Transition` component';
