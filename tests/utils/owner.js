export function getOwnerDocument(element) {
  if (typeof window === 'undefined') return null;
  if (element instanceof Node) return element.ownerDocument;

  if (Object.prototype.hasOwnProperty.call(element, 'current')) {
    if (element.current instanceof Node) return element.current.ownerDocument;
  }

  return document;
}
