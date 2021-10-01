import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { setComponentTemplate } from '@ember/component';
import { registerDestructor } from '@ember/destroyable';
import { action } from '@ember/object';
import { hbs } from 'ember-cli-htmlbars';

import { createPopper } from '@popperjs/core';
// could use ember-modifier here as well
import { modifier } from 'ember-could-get-used-to-this';

import type Popper from '@popperjs/core';

interface Args {
  placement?: Popper.Placement;
}

/**
 * This component does not use a long-lived instance of popper as most examples
 * in popper's documentation do.
 *
 * This component *is* persistent, _but_ because in SPAs, it's common to not
 * render what you can't see, the actual popover DOM elements do not exist
 * until the {{trigger}} element is.. triggered.
 * So, when the popover is closed, the _popoverElement is lost, and the popper
 * instance is destroyed.
 *
 * *if* popper had an api to update what the popover element was, then we could
 * avoid all this destruction and re-creating.
 *
 */
class PopperJS extends Component<Args> {
  declare _triggerElement?: HTMLElement;
  declare _popoverElement?: HTMLElement;
  declare _popper?: Popper.Instance;

  @tracked isShown = false;

  trigger = modifier((element: HTMLElement) => {
    this._triggerElement = element;

    if (this._popoverElement) this.positionPopover();

    return () => {
      this._triggerElement = undefined;
      this._popper?.destroy();
    };
  });

  popover = modifier((element: HTMLElement) => {
    this._popoverElement = element;

    if (this._triggerElement) this.positionPopover();

    return () => {
      this._popoverElement = undefined;
      this._popper?.destroy();
    };
  });

  @action
  positionPopover() {
    const { _popoverElement: popover, _triggerElement: trigger } = this;
    const { placement } = this.args;

    if (!popover) return;
    if (!trigger) return;

    this._popper = createPopper(trigger, popover, {
      placement: placement || 'bottom-end',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    });

    registerDestructor(this, () => this._popper?.destroy());
  }
}

export default setComponentTemplate(
  hbs`
    {{yield this.trigger this.popover this.isShown}}
  `,
  PopperJS
);
