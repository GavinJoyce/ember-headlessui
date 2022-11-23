import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { debounce, scheduleOnce } from '@ember/runloop';

import { TrackedSet } from 'tracked-maps-and-sets';

const ACTIVATE_NONE = 0;
const ACTIVATE_FIRST = 1;
const ACTIVATE_LAST = 2;

const PREVENTED_KEYDOWN_EVENTS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'PageUp',
  'PageDown',
  'Home',
  'End',
]);

export default class ListboxComponent extends Component {
  @tracked activeOptionIndex;
  activateBehaviour = ACTIVATE_NONE;
  buttonElement;
  guid = `${guidFor(this)}-headlessui-listbox`;
  @tracked _isOpen = this.args.isOpen || false;
  labelElement;
  optionsElement;
  optionElements = [];
  optionValues = {};
  search = '';
  @tracked selectedOptionIndexes = new TrackedSet();

  get activeOptionGuid() {
    return this.optionElements[this.activeOptionIndex]?.id;
  }

  get isDisabled() {
    return !!this.args.disabled;
  }

  get selectedOptionGuids() {
    return Array.from(this.selectedOptionIndexes).map(
      (i) => this.optionElements[i]?.id
    );
  }

  get isOpen() {
    return this._isOpen;
  }

  set isOpen(isOpen) {
    if (isOpen) {
      this.activeOptionIndex = undefined;
      this.selectedOptionIndexes.clear();
      this.optionElements = [];
      this.optionValues = {};
      this._isOpen = true;
    } else {
      this._isOpen = false;
    }
  }

  @action
  closeListbox() {
    this.isOpen = false;
  }

  @action
  handleButtonClick(e) {
    if (e.button !== 0) return;
    this.activateBehaviour = ACTIVATE_NONE;
    this.isOpen = !this.isOpen;
  }

  @action
  handleClickOutside(e) {
    let isClickOutsideButton = !e.srcElement.closest(
      `#${this.buttonElement.id}`
    );
    if (isClickOutsideButton) {
      this.closeListbox();
    }
    return true;
  }

  @action
  handleKeyDown(event) {
    if (PREVENTED_KEYDOWN_EVENTS.has(event.key)) {
      event.preventDefault();
    }
  }

  @action
  handleKeyUp(event) {
    if (event.key === 'ArrowDown') {
      if (!this.isOpen) {
        this.activateBehaviour = ACTIVATE_FIRST;
        this.isOpen = true;
      } else {
        this.setNextOptionActive();
      }
    } else if (event.key === 'ArrowRight') {
      if (this.isOpen) {
        this.setNextOptionActive();
      }
    } else if (event.key === 'ArrowUp') {
      if (!this.isOpen) {
        this.activateBehaviour = ACTIVATE_LAST;
        this.isOpen = true;
      } else {
        this.setPreviousOptionActive();
      }
    } else if (event.key === 'ArrowLeft') {
      if (this.isOpen) {
        this.setPreviousOptionActive();
      }
    } else if (event.key === 'Home' || event.key === 'PageUp') {
      this.setFirstOptionActive();
    } else if (event.key === 'End' || event.key === 'PageDown') {
      this.setLastOptionActive();
    } else if (event.key === 'Escape') {
      this.isOpen = false;
    }
  }

  @action
  handleKeyPress(event) {
    if (
      event.key === 'Enter' ||
      ((event.key === 'Space' || event.key === ' ') && this.search === '')
    ) {
      this.activateBehaviour = ACTIVATE_FIRST;
      if (this.isOpen) {
        this.setSelectedOption(event.target, event);
        if (!this.args.multiple) {
          this.isOpen = false;
        }
      } else {
        this.isOpen = true;
      }
      event.preventDefault();
      event.stopPropagation();
    } else if (event.key.length === 1) {
      this.addSearchCharacter(event.key);
    }
  }
  @action
  handleLabelClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.ctrlKey || e.button !== 0) return;
    this.buttonElement.focus();
  }

  @action
  openListbox() {
    this.isOpen = true;
  }

  @action
  registerButtonElement(buttonElement) {
    this.buttonElement = buttonElement;
  }

  @action
  unregisterButtonElement() {
    this.buttonElement = undefined;
  }

  @action
  registerLabelElement(labelElement) {
    this.labelElement = labelElement;
  }

  @action
  registerOptionElement(optionComponent, optionElement) {
    this.optionElements.push(optionElement);
    this.optionValues[optionComponent.guid] = optionComponent.args.value;

    // store the index at which the option appears in the list
    // so we can avoid a O(n) find operation later
    optionComponent.index = this.optionElements.length - 1;
    optionElement.setAttribute('data-index', this.optionElements.length - 1);

    if (this.args.value) {
      let isSelected;

      if (this.args.multiple) {
        isSelected = this.args.value.includes(optionComponent.args.value);
      } else {
        isSelected = this.args.value === optionComponent.args.value;
      }

      if (isSelected) {
        this.selectedOptionIndexes.add(this.optionElements.length - 1);
        this.activeOptionIndex = this.optionElements.length - 1;

        this.scrollIntoView(optionElement);
      }
    }

    scheduleOnce('afterRender', this, this.setDefaultActiveOption);
  }

  setDefaultActiveOption() {
    if (this.selectedOptionIndexes.size === 0) {
      switch (this.activateBehaviour) {
        case ACTIVATE_FIRST:
          this.setFirstOptionActive();
          break;
        case ACTIVATE_LAST:
          this.setLastOptionActive();
          break;
      }
    } else {
      this.activeOptionIndex = Math.min(...this.selectedOptionIndexes);
    }
  }

  @action
  registerOptionsElement(optionsElement) {
    this.optionsElement = optionsElement;
  }

  @action
  unregisterOptionsElement() {
    this.optionsElement = undefined;
  }

  @action
  setActiveOption(optionComponent) {
    this.optionElements.forEach((o, i) => {
      if (o.id === optionComponent.guid && !o.hasAttribute('disabled')) {
        this.activeOptionIndex = i;
        document.querySelector('#' + optionComponent.guid).focus();
      }
    });
  }

  @action
  setSelectedOption(optionComponent, e) {
    let optionIndex, optionValue;

    if (optionComponent.constructor.name === 'ListboxOptionComponent') {
      optionValue = optionComponent.args.value;
      optionIndex = optionComponent.index;
    } else if (this.activeOptionIndex !== undefined) {
      optionValue =
        this.optionValues[this.optionElements[this.activeOptionIndex].id];
      optionIndex = parseInt(
        this.optionElements[this.activeOptionIndex].getAttribute('data-index')
      );
    } else {
      return;
    }

    if (!this.optionElements[optionIndex].hasAttribute('disabled')) {
      if (this.args.multiple) {
        let value = this.args.value ?? [];

        if (this.selectedOptionIndexes.has(optionIndex)) {
          optionValue = value.filter((i) => i !== optionValue);
          this.selectedOptionIndexes.delete(optionIndex);
        } else {
          optionValue = [...value, optionValue];
          this.selectedOptionIndexes.add(optionIndex);
        }
      } else {
        this.selectedOptionIndexes.add(optionIndex);
      }

      this.args.onChange?.(optionValue);

      if (e.type === 'click' && !this.args.multiple) {
        this.isOpen = false;
      }
    } else {
      this.optionsElement.focus();
    }
  }

  scrollIntoView(optionElement) {
    // Cannot use optionElement.scrollIntoView() here because that function
    // also scrolls the *window* by some amount. Here, we don't want to
    // jerk the window, we just want to make the the option element visible
    // inside its container.

    optionElement.parentElement.scroll(
      0,
      optionElement.offsetTop - optionElement.parentElement.offsetTop
    );
  }

  @action
  unsetActiveOption() {
    this.activeOptionIndex = undefined;
  }

  setNextOptionActive() {
    for (
      let i = this.activeOptionIndex + 1;
      i < this.optionElements.length;
      i++
    ) {
      if (!this.optionElements[i].hasAttribute('disabled')) {
        this.activeOptionIndex = i;
        break;
      }
    }
  }

  setPreviousOptionActive() {
    for (let i = this.activeOptionIndex - 1; i >= 0; i--) {
      if (!this.optionElements[i].hasAttribute('disabled')) {
        this.activeOptionIndex = i;
        break;
      }
    }
  }

  setFirstOptionActive() {
    for (let i = 0; i < this.optionElements.length; i++) {
      if (!this.optionElements[i].hasAttribute('disabled')) {
        this.activeOptionIndex = i;
        break;
      }
    }
  }

  setLastOptionActive() {
    for (let i = this.optionElements.length - 1; i >= 0; i--) {
      if (!this.optionElements[i].hasAttribute('disabled')) {
        this.activeOptionIndex = i;
        break;
      }
    }
  }

  clearSearch() {
    this.search = '';
  }

  addSearchCharacter(key) {
    debounce(this, this.clearSearch, 500);

    this.search += key.toLowerCase();

    for (let i = 0; i < this.optionElements.length; i++) {
      let optionElement = this.optionElements[i];

      if (
        !optionElement.hasAttribute('disabled') &&
        optionElement.textContent.trim().toLowerCase().startsWith(this.search)
      ) {
        this.scrollIntoView(optionElement);

        this.activeOptionIndex = i;
        break;
      }
    }
  }
}
