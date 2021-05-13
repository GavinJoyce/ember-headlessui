import Modifier from "ember-modifier";

function addingNodesOnly(mutationsList) {
  let filtered = mutationsList.filter(
    mutation =>
      mutation.addedNodes.length > 0 && mutation.removedNodes.length === 0
  );

  return filtered.length == mutationsList.length;
}

function removingNodesOnly(mutationsList) {
  let filtered = mutationsList.filter(
    mutation =>
      mutation.removedNodes.length > 0 && mutation.addedNodes.length === 0
  );

  return filtered.length == mutationsList.length;
}

export default class HeadlessDialogModifier extends Modifier {
  observer = null;

  didInstall() {
    this.element.style.position = "fixed";

    let config = { childList: true };

    let fn = mutationsList => {
      if (addingNodesOnly(mutationsList)) {
        this.element.style.top = "0";
        this.element.style.bottom = "0";
        this.element.style.left = "0";
        this.element.style.right = "0";
        return;
      }

      if (removingNodesOnly(mutationsList)) {
        this.element.style.top = null;
        this.element.style.bottom = null;
        this.element.style.left = null;
        this.element.style.right = null;
        return;
      }
    };

    this.observer = new MutationObserver(fn);

    this.observer.observe(this.element, config);
  }

  willDestroy() {
    this.element.style.position = null;

    this.observer.disconnect;
  }
}
