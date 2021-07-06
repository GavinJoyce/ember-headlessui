import Helper from '@ember/component/helper';
import { dropTask, timeout } from 'ember-concurrency';
import {
  ClassNameSet,
  splitClassNames,
  waitForTransition,
} from '../../utils/transition';

export class AppliedClassNamesManager extends Helper {
  appliedClassNames = new ClassNameSet();

  /**
   * Tracks the last `this.show` value, so we can determine if we need to initiate a transition as part of `compute`
   * being executed
   *
   * This is because `compute` is sometimes called because an argument changed (and we want to kick off a new
   * transition) and sometimes it's called to update the produced value during an existing transition (and we *do
   * not* want to kick off a new transition)
   */
  previousShowValue = false;

  /** @type {import('../../components/transition').default} */
  get transition() {
    return this.args[0];
  }

  /**
   * The `Transition` component's `@show` value
   *
   * Represents the desired visibility of the component.
   *
   * @type {boolean}
   */
  get show() {
    return this.args[1];
  }

  get enterClasses() {
    return splitClassNames(this.transition.args.enter);
  }

  get enterFromClasses() {
    return splitClassNames(this.transition.args.enterFrom);
  }

  get enterToClasses() {
    return splitClassNames(this.transition.args.enterTo);
  }

  get enteredClasses() {
    return splitClassNames(this.transition.args.entered);
  }

  get leaveClasses() {
    return splitClassNames(this.transition.args.leave);
  }

  get leaveFromClasses() {
    return splitClassNames(this.transition.args.leaveFrom);
  }

  get leaveToClasses() {
    return splitClassNames(this.transition.args.leaveTo);
  }

  @dropTask
  *setTransitionClassesTask(base, from, to, entered) {
    this.appliedClassNames.delete(...entered);
    this.appliedClassNames.add(...base, ...from);

    this.recompute();

    // Wait for the next tick
    yield timeout(0);

    this.appliedClassNames.delete(...from);
    this.appliedClassNames.add(...to);

    this.recompute();

    yield waitForTransition(this.transition.ownDomNode);

    this.appliedClassNames.delete(...to, ...base);
    this.appliedClassNames.add(...entered);

    this.recompute();
  }

  @dropTask
  *transitionToShow() {
    this.transition.args.beforeEnter?.();

    yield this.setTransitionClassesTask.perform(
      this.enterClasses,
      this.enterFromClasses,
      this.enterToClasses,
      this.enteredClasses
    );

    this.transition.args.afterEnter?.();
  }

  @dropTask
  *transitionToHide() {
    this.transition.args.beforeLeave?.();

    yield this.setTransitionClassesTask.perform(
      this.leaveClasses,
      this.leaveFromClasses,
      this.leaveToClasses,
      this.enteredClasses
    );

    this.transition.args.afterLeave?.();
  }

  shouldTransition() {
    return this.show !== this.previousShowValue;
  }

  compute(positionalArgs) {
    // Make sure we have a reference to the args
    this.args = positionalArgs;

    const skip = this.transition.initialRender && !this.transition.args.appear;

    if (!skip && this.shouldTransition()) {
      if (this.show) {
        this.transitionToShow.perform();
      }

      if (!this.show) {
        this.transitionToHide.perform();
      }
    }

    this.previousShowValue = this.show;

    return this.appliedClassNames.toString();
  }
}
