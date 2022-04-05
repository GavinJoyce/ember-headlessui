import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import ListboxComponent from 'ember-headlessui/components/listbox';
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

export default class ComboboxComponent extends ListboxComponent {
  @tracked activeOptionIndex;
  @tracked selectedOptionIndexes = [];
  @tracked _isOpen = this.args.isOpen || false;
  @tracked optionElements = [];

  guid = `${guidFor(this)}-headlessui-combobox`;
  optionValues = {};
  optionsElement;
  buttonElement;
  labelElement;
  inputElement;
  inputComponent;
  activateBehaviour = ACTIVATE_NONE;

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

      this.activeOptionIndex = undefined;
      this.selectedOptionIndexes = [];
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

  get isMultiselectable() {
    return Array.isArray(this.args.value);
  }

  get selectedOptionGuids() {
    return this.selectedOptionIndexes.map(
      (indx) => this.optionElements[indx]?.id
    );
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

  pushOptionElement(optionElement) {
    let index = -1;
    const activeOptionGuid = this.activeOptionGuid;

    this.optionElements = Array.from(
      optionElement.parentElement.querySelectorAll('[role="option"]')
    );

    this.optionElements.forEach((anOptionElement, i) => {
      if (anOptionElement.id === activeOptionGuid) {
        this.activeOptionIndex = i;
      }

      if (anOptionElement === optionElement) {
        index = i;
      }
    });

    return index;
  }

  @action
  registerOptionElement(optionComponent, optionElement) {
    const index = this.pushOptionElement(optionElement);

    this.optionValues[optionComponent.guid] = optionComponent.args.value;

    // store the index at which the option appears in the list
    // so we can avoid a O(n) find operation later
    optionComponent.index = index;
    optionElement.setAttribute('data-index', index);

    if (this.args.value) {
      if (this.isMultiselectable) {
        if (this.args.value.includes(optionComponent.args.value)) {
          if (!this.activeOptionIndex) {
            this.activeOptionIndex = index;
          }

          this.selectedOptionIndexes = [...this.selectedOptionIndexes, index];
        }
      } else if (this.args.value === optionComponent.args.value) {
        this.activeOptionIndex = index;
        this.selectedOptionIndexes = [index];
      }
    }

    if (!this.selectedOptionIndexes.length && !this.activeOptionGuid) {
      switch (this.activateBehaviour) {
        case ACTIVATE_FIRST:
          this.setFirstOptionActive();
          break;
        case ACTIVATE_LAST:
          this.setLastOptionActive();
          break;
      }
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
    let optionIndex, optionValue;

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
    const activeOptionGuid = this.activeOptionGuid;

    this.optionElements = this.optionElements.filter((anOptionElement) => {
      return optionElement !== anOptionElement;
    });

    this.activeOptionIndex = 0;

    this.optionElements.forEach((optionElement, i) => {
      if (optionElement.id === activeOptionGuid) {
        this.activeOptionIndex = i;
      }

      optionElement.setAttribute('data-index', i);
    });
  }

  @action
  setActiveOption(optionComponent) {
    this.optionElements.forEach((o, i) => {
      if (o.id === optionComponent.guid && !o.hasAttribute('disabled')) {
        this.activeOptionIndex = i;
      }
    });
  }
}
