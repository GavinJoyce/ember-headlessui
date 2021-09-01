import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import { debounce } from '@ember/runloop';

const ACTIVATE_NONE = 0;
const ACTIVATE_FIRST = 1;
const ACTIVATE_LAST = 2;

export default class ListboxComponent extends Component {
  @tracked activeOptionIndex;
  activateBehaviour = ACTIVATE_NONE;
  buttonElement;
  guid = `${guidFor(this)}-headlessui-listbox`;
  @tracked _isOpen = false;
  labelElement;
  optionsElement;
  optionElements = [];
  optionValues = [];
  search = '';
  @tracked selectedOptionIndex;

  get activeOptionGuid() {
    return this.optionElements[this.activeOptionIndex]?.id;
  }

  get selectedOptionGuid() {
    return this.optionElements[this.selectedOptionIndex]?.id;
  }

  get isOpen() {
    return this._isOpen;
  }

  set isOpen(isOpen) {
    if (isOpen) {
      this.activeOptionIndex = undefined;
      this.selectedOptionIndex = undefined;
      this.optionElements = [];
      this.optionValues = [];
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
    if (e.button !== 0) return;
    this.closeListbox();

    for (let i = 0; i < e.path?.length; i++) {
      if (typeof e.path[i].focus === 'function') {
        e.path[i].focus();
      }

      if (document.activeElement === e.path[i]) {
        e.stopPropagation();
        break;
      }
    }
  }

  @action
  handleKeyDown(event) {
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
        this.setSelectedOption(undefined, event);
        this.isOpen = false;
      } else {
        this.isOpen = true;
      }
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
  registerLabelElement(labelElement) {
    this.labelElement = labelElement;
  }

  @action
  registerOptionElement(optionValue, optionElement) {
    this.optionElements.push(optionElement);
    this.optionValues.push(optionValue);

    if (this.args.value) {
      if (this.args.value === optionValue) {
        this.selectedOptionIndex = this.activeOptionIndex =
          this.optionElements.length - 1;
      }
    }

    if (!this.selectedOptionIndex) {
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
  }

  @action
  setActiveOption(optionComponent) {
    this.optionElements.find((o, i) => {
      if (
        o.id === optionComponent.guid + '-option' &&
        !o.hasAttribute('disabled')
      ) {
        this.activeOptionIndex = i;
        document.querySelector('#' + optionComponent.guid + '-option').focus();
      }
    });
  }

  @action
  setSelectedOption(optionComponent, e) {
    let optionId, optionValue, found;

    if (optionComponent) {
      optionId = optionComponent.guid + '-option';
      optionValue = optionComponent.args.value;
    } else if (this.activeOptionIndex !== undefined) {
      optionId = this.optionElements[this.activeOptionIndex].id;
      optionValue = this.optionValues[this.activeOptionIndex];
    } else {
      return;
    }

    this.optionElements.find((o, i) => {
      if (!found && o.id === optionId && !o.hasAttribute('disabled')) {
        this.selectedOptionIndex = i;

        if (this.args.onChange) {
          this.args.onChange(optionValue);
        }

        if (e.type === 'click') {
          this.isOpen = false;
        }

        found = true;
      }
    });

    if (!found) {
      this.optionsElement.focus();
    }
  }

  @action
  unregisterOptionsElement() {
    this.optionsElement = undefined;
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
      if (
        !this.optionElements[i].hasAttribute('disabled') &&
        this.optionElements[i].textContent
          .trim()
          .toLowerCase()
          .startsWith(this.search)
      ) {
        this.activeOptionIndex = i;
        break;
      }
    }
  }
}
