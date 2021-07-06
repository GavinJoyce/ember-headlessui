import Helper from '@ember/component/helper';
import { all, restartableTask, timeout } from 'ember-concurrency';
import { waitForTransition } from '../../utils/transition';

export class TransitionVisibilityManager extends Helper {
  /**
   * Represents whether or not the `Transition` should be visible
   */
  value = false;

  /**
   * Tracks the last `this.show` value, so we can determine if we need to initiate a transition as part of `compute`
   * being executed
   *
   * This is because `compute` is sometimes called because an argument changed (and we want to kick off a new
   * transition) and sometimes it's called to update the produced value during an existing transition (and we *do
   * not* want to kick off a new transition)
   *
   * @type {undefined|boolean}
   */
  previousShowValue = undefined;

  /**
   * All of the DOM nodes related to a transition
   *
   * Includes the parent element plus any children
   *
   * @type {Set<HTMLElement>}
   */
  get domNodes() {
    return this.args[0];
  }

  /**
   * The `Transition` component's `this.args.show` value
   *
   * Represents the desired visibility of the component.
   *
   * @type {boolean}
   */
  get show() {
    return this.args[1];
  }

  isInitialRender() {
    return typeof this.previousShowValue === 'undefined';
  }

  shouldTransition() {
    return this.show !== this.previousShowValue;
  }

  compute(positionalArgs) {
    this.args = positionalArgs;

    if (this.isInitialRender()) {
      this.value = this.show;
    } else if (this.shouldTransition()) {
      if (this.show) {
        this.value = true;
      } else {
        this.unmountAfterTransitionTask.perform();
      }
    }

    this.previousShowValue = this.show;

    return this.value;
  }

  @restartableTask
  *unmountAfterTransitionTask() {
    // Wait for the next tick, to ensure that the class name string has time to re-build
    yield timeout(0);

    // Wait for all Transition DOM elements to finish transitioning (parent and children)
    yield all(
      Array.from(this.domNodes).map((domNode) => waitForTransition(domNode))
    );

    this.value = false;

    this.recompute();
  }
}
