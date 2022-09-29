import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { next } from '@ember/runloop';

import { Keys } from 'ember-headlessui/utils/keyboard';
import { TrackedSet } from 'tracked-maps-and-sets';

const ACTIVATE_NONE = 0;
const ACTIVATE_FIRST = 1;
const ACTIVATE_LAST = 2;

const PREVENTED_KEYDOWN_EVENTS = new Set([
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
]);

export default class ComboboxComponent extends Component {
  @tracked selectedOptionGuids = new TrackedSet();
  @tracked _isOpen = this.args.isOpen || false;
  //TODO: `options` would be a better name as we store other stuff in it, too.
  @tracked optionElements = [];
  @tracked activateBehaviour = ACTIVATE_NONE;
  @tracked _activeOptionGuid;

  guid = `${guidFor(this)}-headlessui-combobox`;
  optionValues = {};
  optionsElement;
  buttonElement;
  labelElement;
  inputElement;
  inputComponent;

  constructor() {
    super(...arguments);

    this._originalValue = this.args.value;
  }

  get inputValue() {
    return (
      this.inputComponent?.displayValue(this.args.value) || this.args.value
    );
  }

  set inputValue(value) {
    if (this.inputComponent?.displayValue) {
      this.inputElement.value = this.inputComponent.displayValue(value) || '';
    } else {
      this.inputElement.value = value;
    }
  }

  get isOpen() {
    return this._isOpen;
  }

  set isOpen(isOpen) {
    if (this.isDisabled) return;

    this.inputComponent?.clearInput();

    if (!isOpen) {
      if (this.selectedOptionGuids.size > 0) {
        let firstSelectedGuid = Array.from(this.selectedOptionGuids)[0];
        this.inputValue = this.optionValues[firstSelectedGuid];
      }

      this.selectedOptionGuids.clear();
      this._activeOptionGuid = null;
      this.optionElements = [];
      this.optionValues = {};
    }

    if (isOpen) {
      this.inputElement?.focus();
      this._isOpen = true;
    } else {
      this._isOpen = false;
    }
  }

  get isDisabled() {
    return !!this.args.disabled;
  }

  get isMultiselectable() {
    return Array.isArray(this.args.value);
  }

  get activeOptionGuid() {
    if (this._activeOptionGuid) {
      return this._activeOptionGuid;
    }

    let selectedGuids = this.selectedOptionGuids;
    if (selectedGuids.size > 0) {
      return Array.from(selectedGuids)[0];
    }

    if (this.activateBehaviour === ACTIVATE_FIRST) {
      return this.firstNonDisabledOption?.id;
    }

    if (this.activateBehaviour === ACTIVATE_LAST) {
      return this.lastNonDisabledOption?.id;
    }

    return null;
  }

  get activeOption() {
    let activeGuid = this.activeOptionGuid;
    return this.optionElements.find((option) => option.id === activeGuid);
  }

  @action
  handleInput(/*e*/) {
    this.isOpen = true;
  }

  @action
  handleButtonClick(e) {
    if (e.button !== 0) return;
    this.activateBehaviour = ACTIVATE_FIRST;

    if (this.isOpen) {
      this.inputElement?.focus();
    }

    this.isOpen = !this.isOpen;
  }

  @action
  handleLabelClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.ctrlKey || e.button !== 0) return;
    this.inputElement?.focus();
  }

  @action
  handleKeyDown(event) {
    if (event.key === Keys.Tab) {
      this.inputValue = this._originalValue;
      this.closeCombobox();
      return;
    }

    if (PREVENTED_KEYDOWN_EVENTS.has(event.key)) {
      event.preventDefault();
    }
  }

  @action
  handleKeyUp(event) {
    if (event.key === Keys.ArrowDown) {
      if (!this.isOpen) {
        this.activateBehaviour = ACTIVATE_FIRST;
        this.isOpen = true;
      } else {
        this.setNextOptionActive();
      }
    } else if (event.key === Keys.ArrowUp) {
      if (!this.isOpen) {
        this.activateBehaviour = ACTIVATE_LAST;
        this.isOpen = true;
      } else {
        this.setPreviousOptionActive();
      }
    } else if (event.key === Keys.Home || event.key === Keys.PageUp) {
      this.setFirstOptionActive();
    } else if (event.key === Keys.End || event.key === Keys.PageDown) {
      this.setLastOptionActive();
    } else if (event.key === Keys.Escape) {
      this.isOpen = false;
      this.inputValue = this._originalValue;
      this.inputElement?.focus();
    }
  }

  @action
  handleKeyPress(event) {
    if (
      event.key === Keys.Enter ||
      ((event.key === 'Space' || event.key === Keys.Space) && !this.isOpen)
    ) {
      this.activateBehaviour = ACTIVATE_FIRST;
      if (this.isOpen) {
        this.setSelectedOption(event.target, event);
        this.isOpen = false;
        this.inputElement?.focus();
      } else {
        this.isOpen = true;
      }
    } else {
      this.isOpen = true;
    }
  }

  @action
  optionsFallbackFocus() {
    if (document.activeElement === this.inputElement) return this.inputElement;
    if (document.activeElement === this.buttonElement)
      return this.buttonElement;

    return this.inputElement;
  }

  @action
  optionsReturnFocus() {
    return this.inputElement;
  }

  @action
  handleClickOutside(e) {
    let hasClickedButtonElement = false;

    if (
      e.composedPath().some((element) => {
        if (element === this.buttonElement) {
          hasClickedButtonElement = true;
          return false;
        } else if (element === this.optionsElement) {
          return true;
        } else if (
          this.optionElements.map(({ element }) => element).includes(element)
        ) {
          return true;
        }
      })
    ) {
      return false;
    }

    if (hasClickedButtonElement) {
      return true;
    }

    this.inputValue = this._originalValue;
    this.closeCombobox();

    return true;
  }

  @action
  closeCombobox() {
    this.isOpen = false;
  }

  @action
  registerInputElement(inputComponent, inputElement) {
    this.inputComponent = inputComponent;
    this.inputElement = inputElement;

    this.inputValue = this.args.value;
  }

  @action
  registerLabelElement(labelElement) {
    this.labelElement = labelElement;
  }

  @action
  registerButtonElement(buttonElement) {
    this.buttonElement = buttonElement;
  }

  @action
  unregisterButtonElement() {
    this.buttonElement = null;
  }

  rebuildOptionElements(optionElement) {
    let optionDOMElements = Array.from(
      optionElement.parentElement.querySelectorAll('[role="option"]')
    );

    let newElements = [];
    optionDOMElements.forEach((anOptionElement) => {
      let data = {
        id: anOptionElement.id,
        element: anOptionElement,
      };

      newElements.push(data);
    });

    newElements.forEach((element, index) => {
      // Current implementation doesn't go around :(
      element.previous = index > 0 ? newElements[index - 1] : null;
      element.next =
        index < optionDOMElements.length - 1 ? newElements[index + 1] : null;
    });

    this.optionElements = newElements;
  }

  indexForOptionElement(optionElement) {
    let optionElements =
      optionElement.parentElement.querySelectorAll('[role="option"]');

    return Array.from(optionElements).findIndex(
      (anOptionElement) => anOptionElement.id === optionElement.id
    );
  }

  @action
  registerOptionElement(optionComponent, optionElement) {
    this.rebuildOptionElements(optionElement);
    let index = this.indexForOptionElement(optionElement);

    let value = this.args.value;
    let optionValue = optionComponent.args.value;
    let optionGuid = optionComponent.guid;

    this.optionValues[optionComponent.guid] = optionValue;

    // store the index at which the option appears in the list
    // so we can avoid a O(n) find operation later
    optionComponent.index = index;
    optionElement.setAttribute('data-index', index);

    if (value) {
      if (this.isMultiselectable) {
        if (value.includes(optionValue)) {
          this.selectedOptionGuids.add(optionGuid);
        }
      } else if (value === optionValue) {
        this.selectedOptionGuids.clear();
        this.selectedOptionGuids.add(optionGuid);
      }
    }
  }

  get firstNonDisabledOption() {
    return this.optionElements.find((optionElement) => {
      return !optionElement.element.hasAttribute('disabled');
    });
  }

  get lastNonDisabledOption() {
    return [...this.optionElements].reverse().find((optionElement) => {
      return !optionElement.element.hasAttribute('disabled');
    });
  }

  setNextOptionActive() {
    let option = this.activeOption.next;
    while (option?.element.hasAttribute('disabled')) {
      option = option.next;
    }

    if (option) {
      this._activeOptionGuid = option.id;
    }
  }

  setPreviousOptionActive() {
    let option = this.activeOption.previous;
    while (option?.element.hasAttribute('disabled')) {
      option = option.previous;
    }

    if (option) {
      this._activeOptionGuid = option.id;
    }
  }

  setFirstOptionActive() {
    let firstOption = this.optionElements[0];
    let option = firstOption;
    while (option?.element.hasAttribute('disabled')) {
      option = option.next;
    }

    if (option) {
      this._activeOptionGuid = option.id;
    }
  }

  setLastOptionActive() {
    let lastOption = this.optionElements[this.optionElements.length - 1];
    let option = lastOption;
    while (option?.element.hasAttribute('disabled')) {
      option = option.previous;
    }

    if (option) {
      this._activeOptionGuid = option.id;
    }
  }

  @action
  registerOptionsElement(optionsElement) {
    this.optionsElement = optionsElement;

    this.optionsElement
      .querySelectorAll(':scope > *:not([role="option"]')
      .forEach((element) => {
        element.setAttribute('role', 'none');
      });
  }

  @action
  setSelectedOption(optionComponent, e) {
    //TODO: This can be called from `-Option` (when clicking one of the options)
    // or when hitting Enter on the active option.
    // Thus it should be possible to simplify the below and not check the constructor name
    // I think even the value (`optionValue` could be had in a simpler way)
    let optionGuid, optionValue;

    let activeOption = this.activeOption;
    if (optionComponent.constructor.name === 'ComboboxOptionComponent') {
      optionValue = optionComponent.args.value;
      optionGuid = optionComponent.guid;
    } else if (activeOption) {
      optionValue = this.optionValues[activeOption.id];
      optionGuid = activeOption.id;
    } else {
      return;
    }

    if (activeOption.element.hasAttribute('disabled')) {
      return;
    }

    if (this.isMultiselectable) {
      let isAlreadySelected = this.selectedOptionGuids.has(optionGuid);
      if (isAlreadySelected) {
        this.selectedOptionGuids.delete(optionGuid);
      } else {
        this.selectedOptionGuids.add(optionGuid);
      }
    } else {
      this.selectedOptionGuids.clear();
      this.selectedOptionGuids.add(optionGuid);
    }

    if (this.args.onChange) {
      if (this.isMultiselectable) {
        let selectedGuids = Array.from(this.selectedOptionGuids.values());
        const selectedOptionValues = selectedGuids.map(
          (guid) => this.optionValues[guid]
        );
        this.args.onChange(selectedOptionValues);
      } else {
        this.args.onChange(optionValue);
      }
    }

    if (e?.type === 'click') {
      if (!this.isMultiselectable) {
        this.closeCombobox();
      }
      this.inputElement?.focus();
    }

    this._originalValue = this.inputValue;
  }

  @action
  unregisterOptionElement(optionComponent, optionElement) {
    next(() => {
      this.optionElements = this.optionElements.filter((anOptionElement) => {
        return optionElement.id !== anOptionElement.id;
      });

      this.optionElements.forEach((optionElement, i) => {
        optionElement.element.setAttribute('data-index', i);
      });
    });
  }

  @action
  setActiveOption({ guid }) {
    this.optionElements.forEach((optionElement) => {
      if (
        optionElement.id === guid &&
        !optionElement.element.hasAttribute('disabled')
      ) {
        this._activeOptionGuid = guid;
      }
    });
  }

  @action
  unsetActiveOption() {
    this._activeOptionGuid = null;
    this.activateBehaviour = ACTIVATE_NONE;
  }
}
