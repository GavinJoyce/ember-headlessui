import { getOwnerDocument } from './owner';

let focusableSelector = [
  '[contentEditable=true]',
  '[tabindex]',
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'iframe',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
]
  .map((selector) => `${selector}:not([tabindex='-1'])`)
  .join(',');

export function isFocusableElement(element, mode) {
  if (element === getOwnerDocument(element)?.body) return false;

  if (mode === 'Strict') {
    return element.matches(focusableSelector);
  } else {
    let next = element;

    while (next) {
      if (next.matches(focusableSelector)) return true;
      next = next.parentElement;
    }

    return false;
  }
}
