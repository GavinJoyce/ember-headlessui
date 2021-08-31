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
  @tracked isOpen = false;
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

  @action
  handleButtonClick(e) {
    if (e.ctrlKey) return;
    this.activateBehaviour = ACTIVATE_NONE;

    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  @action
  handleKeyDown(event) {
    if (event.key === 'ArrowDown') {
      if (!this.isOpen) {
        this.activateBehaviour = ACTIVATE_FIRST;
        this.open();
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
        this.open();
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
      this.close();
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
        this.close();
      } else {
        this.open();
      }
    } else if (event.key.length === 1) {
      this.addSearchCharacter(event.key);
    }
  }
  @action
  handleLabelClick(e) {
    e.preventDefault();
    if (e.ctrlKey) return;
    this.buttonElement.focus();
  }

  @action
  registerButtonElement(buttonElement) {
    this.buttonElement = buttonElement;
  }

  @action
  registerDocumentClickListener() {
    this._handleDocumentClick = this.handleDocumentClick.bind(this);

    document.addEventListener('click', this._handleDocumentClick);
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
    this.optionsElement.focus();
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
          this.close();
        }

        found = true;
      }
    });

    if (!found) {
      this.optionsElement.focus();
    }
  }

  @action
  unregisterDocumentClickListener() {
    document.removeEventListener('click', this._handleDocumentClick);
  }

  @action
  unregisterOptionsElement() {
    this.optionsElement = undefined;
  }

  @action
  unsetActiveOption() {
    this.activeOptionIndex = undefined;
  }

  handleDocumentClick(e) {
    if (e.ctrlKey) return;

    if (
      !this.buttonElement?.contains(e.target) &&
      !this.optionsElement?.contains(e.target)
    ) {
      this.isOpen = false;

      let hasFocus = this.focusAncestor(e.target);

      if (!hasFocus) {
        this.buttonElement.focus();
      }
    }
  }

  focusAncestor(element) {
    if (!element) return false;
    if (element.tagName === 'BODY') return false;

    element.focus();

    if (document.activeElement === element) {
      return true;
    } else {
      return this.focusAncestor(element.parentElement);
    }
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

  open() {
    this.activeOptionIndex = undefined;
    this.selectedOptionIndex = undefined;
    this.optionElements = [];
    this.optionValues = [];
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.buttonElement.focus();
  }
}
