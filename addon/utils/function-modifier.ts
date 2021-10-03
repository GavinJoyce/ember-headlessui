/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  capabilities as modifierCapabilities,
  setModifierManager,
} from '@ember/modifier';

type LazyTrackedArgs = {
  positional?: Array<unknown>;
  named?: Record<string, unknown>;
};

type FunctionModifier<Args extends LazyTrackedArgs> =
  | ((
      element: HTMLElement,
      args: Args['positional'],
      namedArgs?: Record<string, any>
    ) => () => void)
  | ((element: HTMLElement, args: Args['positional']) => void);

interface ModifierState {
  fn: FunctionModifier<LazyTrackedArgs>;
  args: LazyTrackedArgs;
  // normally this isn't a HTMLElement guarantee, but since this modifier manager has 1 use,
  // we can make the assumption
  element?: HTMLElement;
  destructor?: void | (() => void);
}

/**
 *  This is copied from
 *  https://github.com/pzuraq/ember-could-get-used-to-this/blob/master/addon/-private/modifiers.js
 *
 * Because:
 *  - we don't want to *force* folks into use ember-could-get-used-to-this
 *  - the Default Modifier Manager RFC would replace this
 *    https://github.com/emberjs/rfcs/pull/757
 */
class FunctionalModifierManager<Args extends LazyTrackedArgs> {
  capabilities = modifierCapabilities('3.22');

  createModifier(fn: FunctionModifier<Args>, args: Args): ModifierState {
    return { fn, args, element: undefined, destructor: undefined };
  }

  installModifier(state: ModifierState, element: HTMLElement) {
    state.element = element;
    this.setupModifier(state);
  }

  updateModifier(state: ModifierState) {
    this.destroyModifier(state);
    this.setupModifier(state);
  }

  setupModifier(state: ModifierState) {
    let { fn, args, element } = state;

    state.destructor = fn(element as HTMLElement, args.positional, args.named);
  }

  destroyModifier(state: ModifierState) {
    if (typeof state.destructor === 'function') {
      state.destructor();
    }
  }

  getDebugName(fn) {
    return fn.name || '(anonymous function)';
  }
}

/**
 * Unlike class-based modifier-managing, we can register a modifier manager
 * per-function, so we don't interfer with other implementations of function-based
 * modifier management
 */
const FUNCTIONAL_MODIFIER_MANAGER = new FunctionalModifierManager();
const FUNCTIONAL_MODIFIER_MANAGER_FACTORY = () => FUNCTIONAL_MODIFIER_MANAGER;

export function modifier<Args extends LazyTrackedArgs>(
  fn: FunctionModifier<Args>
) {
  return setModifierManager(FUNCTIONAL_MODIFIER_MANAGER_FACTORY, fn);
}
