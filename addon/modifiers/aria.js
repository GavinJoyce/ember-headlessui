import { modifier } from 'ember-modifier';

export default modifier(function aria(element, [name], { value, removeWhen }) {
  if (removeWhen) return;
  element.setAttribute(`aria-${name}`, value);

  return () => {
    element.removeAttribute(`aria-${name}`);
  };
});
