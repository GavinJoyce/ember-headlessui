import { modifier } from 'ember-modifier';
import { createFocusTrap } from 'focus-trap';

export default modifier(function headlessuiFocusTrap(
  element,
  params,
  { focusTrapOptions } = {}
) {
  let trap = createFocusTrap(element, focusTrapOptions);
  trap.activate();

  return () => {
    trap.deactivate();
  };
});
