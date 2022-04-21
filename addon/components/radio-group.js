import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import { Keys } from 'ember-headlessui/utils/keyboard';

export default class RadioGroupComponent extends Component {
  guid = guidFor(this);
  radioGroupGuid = `headlessui-radiogroup-${this.guid}`;
  radioGroupLabel = `headlessui-label-${this.guid}`;

  @tracked activeOption; //-option component
  @tracked activeValue = this.args.value; //string
  @tracked selectedValue; //string
  @tracked options = [];

  get activeOptionIndex() {
    return this.options.indexOf(this.activeOption);
  }

  @action
  goToFirstOption() {
    let firstOption = this.options.find((option) => option);
    this._setActiveOption(firstOption);
  }

  @action
  goToLastOption() {
    let lastOption = this.options
      .slice()
      .reverse()
      .find((option) => option);
    this._setActiveOption(lastOption);
  }

  @action
  goToNextOption() {
    let nextOption = this.options.find((option, index) => {
      if (index <= this.activeOptionIndex) {
        return false;
      }
      return option;
    });
    this._setActiveOption(nextOption);
  }

  @action
  goToPreviousOption() {
    let previousOption = this.options
      .slice()
      .reverse()
      .find((option, index) => {
        if (
          this.activeOptionIndex !== -1 &&
          this.options.length - index - 1 >= this.activeOptionIndex
        ) {
          return false;
        }
        return option;
      });
    this._setActiveOption(previousOption);
  }

  @action
  handleClick(value) {
    this.activeValue = value;
    this.selectedValue = value;
  }

  @action
  handleKeyup(event) {
    switch (event.key) {
      case Keys.Space:
      case Keys.Enter:
        event.preventDefault();
        return this.onKeySelect(event);
      case Keys.ArrowDown:
      case Keys.ArrowRight:
        event.preventDefault();

        if (
          document.activeElement ===
          this.options[this.options.length - 1].element
        )
          return this.goToFirstOption();

        return this.goToNextOption();
      case Keys.ArrowUp:
      case Keys.ArrowLeft:
        event.preventDefault();

        if (document.activeElement === this.options[0].element)
          return this.goToLastOption();

        return this.goToPreviousOption();
      default:
        break;
    }
  }

  @action
  onChange(option) {
    if (this.args.onChange) {
      this.args.onChange(option);
    }
  }

  @action
  onKeySelect(event) {
    if (this.args.disabled) return;
    let hasOptionNotBeenSelected =
      this.selectedValue !== event.target.ariaLabel;

    if (this.args.onChange && hasOptionNotBeenSelected) {
      this.selectedValue = event.target.ariaLabel;
      this.onChange(this.selectedValue);
    }
  }

  @action
  registerOption(option) {
    let { options } = this;

    options.push(option);
    this.options = options;
  }

  @action
  unregisterOption(option) {
    let { options } = this;

    let index = options.indexOf(option);
    options.splice(index, 1);
    this.options = options;
  }

  @action
  setTabIndex() {
    this.options.forEach((option) => {
      let isFirstOption = this.options[0]?.id === option.id;

      let containsCheckedOption = this.options.filter((option) => {
        return (
          option.id &&
          option.value === this.activeValue &&
          option.value !== null
        );
      });

      let checked = this.activeValue === option.value;

      if (this.disabled) {
        option.element.tabIndex = -1;
        return;
      }

      if (checked) {
        this.activeOption = option;
        option.element.tabIndex = 0;
        return;
      }

      if (!containsCheckedOption.length && isFirstOption) {
        this.activeOption = option;
        option.element.tabIndex = 0;
        return;
      }

      option.element.tabIndex = -1;
    });
  }

  _setActiveOption(option) {
    if (option) {
      option.element.focus();
      this.activeOption = option;
      this.activeValue = option.value;
      this.setTabIndex();
      this.onChange(option.value);
    }
  }
}
