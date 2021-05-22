import { modifier } from 'ember-modifier';

export default modifier(function clickOutside(element, [fn]) {
  let handler = function (event) {
    let isClickOutside =
      event.target !== element && !element.contains(event.target);

    if (!isClickOutside) return;

    fn();
  };

  window.addEventListener('mouseup', handler);

  return function () {
    window.removeEventListener('mouseup', handler);
  };
});
