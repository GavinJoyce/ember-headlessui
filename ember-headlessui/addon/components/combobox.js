import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import { Keys } from 'ember-headlessui/utils/keyboard';

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
  @tracked selectedOptionIndexes = [];
  @tracked _isOpen = this.args.isOpen || false;
  @tracked optionElements = [];
  @tracked activateBehaviour = ACTIVATE_NONE;
  @tracked _activeOptionGuid;

  /*
    The idea now is to get rid of `activeOptionIndexes` which were only needed
    to implement keyboard navigation. We should be able to achieve keyboard
    navigation by having guids, `_activeOptionGuid` and maintaining a double
    linked list where each item points to the next and previous items.
    Possibly the first and last items should also be stored to be able to go to
    the first item from the last and the last from the first.
  */

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
      if (this.selectedOptionGuids[0]) {
        this.inputValue = this.optionValues[this.selectedOptionGuids[0]];
      }

      this.selectedOptionIndexes = [];
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

  get selectedOptionGuids() {
    return this.selectedOptionIndexes.map(
      (indx) => this.optionElements[indx]?.id
    );
  }

  get activeOptionGuid() {
    if (this._activeOptionGuid) {
      return this._activeOptionGuid;
    }
    //TODO: Do we have to account for the case when this.selectedOptionIndexes.length > 0 ?
    // If so, what should happen then?

    if (this.activateBehaviour === ACTIVATE_FIRST) {
      return this.firstNonDisabledOption?.id;
    }

    if (this.activateBehaviour === ACTIVATE_LAST) {
      return this.lastNonDisabledOption?.id;
    }

    return null;
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
      //TODO: I think we just need to set activateBehavior to ACTIVATE_FIRST
      this.setFirstOptionActive();
    } else if (event.key === Keys.End || event.key === Keys.PageDown) {
      //TODO: I think we just need to set activateBehavior to ACTIVATE_LAST
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
        } else if (this.optionElements.includes(element)) {
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

  pushOptionElement(optionElement) {
    this.optionElements = Array.from(
      optionElement.parentElement.querySelectorAll('[role="option"]')
    );
  }

  indexForOptionElement(optionElement) {
    let optionElements =
      optionElement.parentElement.querySelectorAll('[role="option"]');
    return [...optionElements].findIndex(
      (anOptionElement) => anOptionElement.id === optionElement.id
    );
  }

  @action
  registerOptionElement(optionComponent, optionElement) {
    this.pushOptionElement(optionElement);
    let index = this.indexForOptionElement(optionElement);

    this.optionValues[optionComponent.guid] = optionComponent.args.value;

    // store the index at which the option appears in the list
    // so we can avoid a O(n) find operation later
    optionComponent.index = index;
    optionElement.setAttribute('data-index', index);

    if (this.args.value) {
      if (this.isMultiselectable) {
        if (this.args.value.includes(optionComponent.args.value)) {
          this.selectedOptionIndexes = [...this.selectedOptionIndexes, index];
        }
      } else if (this.args.value === optionComponent.args.value) {
        this.selectedOptionIndexes = [index];
      }
    }
  }

  get firstNonDisabledOption() {
    return this.optionElements.find((optionElement) => {
      return !optionElement.hasAttribute('disabled');
    });
  }

  get lastNonDisabledOption() {
    return [...this.optionElements.reverse()].find((optionElement) => {
      return !optionElement.hasAttribute('disabled');
    });
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
    let optionIndex, optionValue;

    //TODO: Understand what the `else if` does and see how to do it without
    // `activeOptionIndex`
    if (optionComponent.constructor.name === 'ComboboxOptionComponent') {
      optionValue = optionComponent.args.value;
      optionIndex = optionComponent.index;
    } else if (
      this.activeOptionIndex !== undefined &&
      this.optionElements[this.activeOptionIndex]
    ) {
      optionValue =
        this.optionValues[this.optionElements[this.activeOptionIndex].id];
      optionIndex = parseInt(
        this.optionElements[this.activeOptionIndex].getAttribute('data-index')
      );
    } else {
      return;
    }

    if (
      !this.optionElements[optionIndex] ||
      this.optionElements[optionIndex].hasAttribute('disabled')
    )
      return;

    if (this.isMultiselectable) {
      if (this.selectedOptionIndexes.includes(optionIndex)) {
        this.selectedOptionIndexes = this.selectedOptionIndexes.filter(
          (indx) => indx !== optionIndex
        );
      } else {
        this.selectedOptionIndexes = [
          ...this.selectedOptionIndexes,
          optionIndex,
        ];
      }
    } else {
      this.selectedOptionIndexes = [optionIndex];
    }

    if (this.args.onChange) {
      if (this.isMultiselectable) {
        const selectedOptionValues = this.selectedOptionGuids.map(
          (selectedOptionGuid) => this.optionValues[selectedOptionGuid]
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
    this.optionElements = this.optionElements.filter((anOptionElement) => {
      return optionElement !== anOptionElement;
    });

    this.optionElements.forEach((optionElement, i) => {
      optionElement.setAttribute('data-index', i);
    });
  }

  @action
  setActiveOption({ guid }) {
    this.optionElements.forEach((optionElement) => {
      if (
        optionElement.id === guid &&
        !optionElement.hasAttribute('disabled')
      ) {
        this._activeOptionGuid = guid;
      }
    });
  }
}
