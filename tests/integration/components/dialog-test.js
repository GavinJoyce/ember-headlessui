import { module, test, todo } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, setupOnerror } from '@ember/test-helpers';
import triggerKeyEvent from '@ember/test-helpers/dom/trigger-key-event';
import { hbs } from 'ember-cli-htmlbars';

import { Keys } from 'ember-headlessui/utils/keyboard';

import {
  DialogState,
  assertDialog,
  assertDialogDescription,
  assertDialogOverlay,
  assertDialogTitle,
  getDialog,
  getDialogOverlay,
  assertActiveElement,
  getByText,
} from '../../accessibility-assertions';

module('Integration | Component | <Dialog>', function (hooks) {
  setupRenderingTest(hooks);

  module('Safe guards', function () {
    test('should error when we are using a <Dialog::-Overlay /> without a parent <Dialog />', async function (assert) {
      setupOnerror(function (err) {
        assert.equal(
          err.message,
          '<Dialog::-Overlay /> is missing a parent <Dialog /> component.',
          'Throw initialization error'
        );
      });

      await render(hbs`<Dialog::-Overlay />`);
    });

    test('should error when we are using a <Dialog::-Title /> without a parent <Dialog />', async function (assert) {
      setupOnerror(function (err) {
        assert.equal(
          err.message,
          '<Dialog::-Title /> is missing a parent <Dialog /> component.',
          'Throw initialization error'
        );
      });

      await render(hbs`<Dialog::-Title />`);
    });

    test('should error when we are using a <Dialog::-Description /> without a parent <Dialog />', async function (assert) {
      setupOnerror(function (err) {
        assert.equal(
          err.message,
          '<Dialog::-Description /> is missing a parent <Dialog /> component.',
          'Throw initialization error'
        );
      });

      await render(hbs`<Dialog::-Description />`);
    });

    test('it should be possible to render a Dialog without crashing', async function () {
      this.set('noop', function () {});

      await render(hbs`
        <Dialog
          @isOpen={{false}}
          @onClose={{this.noop}}
          as |d|
        >
          <button type="button">Trigger</button>
          <d.Overlay />
          <d.Title />
          <p>Contents</p>
          <d.Description />
        </Dialog>
      `);

      assertDialog({ state: DialogState.InvisibleUnmounted });
    });
  });

  module('Rendering', function () {
    module('Dialog', function () {
      test('it should complain when the `isOpen` and `onClose` prop are missing', async function (assert) {
        setupOnerror(function (err) {
          assert.equal(
            err.message,
            'You have to provide an `isOpen` and an `onClose` prop to the `Dialog` component.',
            'Throw initialization error'
          );
        });

        await render(hbs`<Dialog @as="div" />`);
      });

      test('it should complain when an `isOpen` prop is provided without an `onClose` prop', async function (assert) {
        setupOnerror(function (err) {
          assert.equal(
            err.message,
            'You provided an `isOpen` prop to the `Dialog`, but forgot an `onClose` prop.',
            'Throw initialization error'
          );
        });

        await render(hbs`<Dialog @as="div" @isOpen={{false}} />`);
      });

      test('it should complain when an `onClose` prop is provided without an `isOpen` prop', async function (assert) {
        this.set('noop', function () {});

        setupOnerror(function (err) {
          assert.equal(
            err.message,
            'You provided an `onClose` prop to the `Dialog`, but forgot an `isOpen` prop.',
            'Throw initialization error'
          );
        });

        await render(hbs`<Dialog @as="div" @onClose={{this.noop}}/>`);
      });

      test('it should complain when an `isOpen` prop is not a boolean', async function (assert) {
        this.set('noop', function () {});

        setupOnerror(function (err) {
          assert.equal(
            err.message,
            'You provided an `isOpen` prop to the `Dialog`, but the value is not a boolean. Received: null',
            'Validate the type of the `isOpen` arg'
          );
        });

        await render(
          hbs`<Dialog @as="div" @isOpen={{null}} @onClose={{this.noop}}/>`
        );
      });

      test('it should complain when an `onClose` prop is not a function', async function (assert) {
        setupOnerror(function (err) {
          assert.equal(
            err.message,
            'You provided an `onClose` prop to the `Dialog`, but the value is not a function. Received: null',
            'Validate the type of the `onClose` arg'
          );
        });

        await render(
          hbs`<Dialog @as="div" @isOpen={{false}} @onClose={{null}}/>`
        );
      });

      test('it should be possible to render a Dialog using a render prop', async function () {
        this.set('isOpen', false);

        await render(hbs`
          <button id="trigger" type="button" {{on "click" (set this.isOpen true)}}>
            Trigger
          </button>
          <Dialog @isOpen={{this.isOpen}} @onClose={{set this.isOpen false}}>
            <pre>Hello</pre>
            <div tabindex="0"></div>
          </Dialog>
        `);

        assertDialog({ state: DialogState.InvisibleUnmounted });

        await click(document.getElementById('trigger'));

        assertDialog({ state: DialogState.Visible, textContent: 'Hello' });
      });

      test('it should be possible to pass props to the Dialog itself', async function () {
        this.set('isOpen', false);

        await render(hbs`
          <button id="trigger" type="button" {{on "click" (set this.isOpen true)}}>
            Trigger
          </button>
          <Dialog
            class="relative bg-blue-500"
            @isOpen={{this.isOpen}}
            @onClose={{set this.isOpen false}}
          >
            <div tabindex="0"></div>
          </Dialog>
        `);

        assertDialog({ state: DialogState.InvisibleUnmounted });

        await click(document.getElementById('trigger'));

        assertDialog({
          state: DialogState.Visible,
          attributes: { class: 'relative bg-blue-500' },
        });
      });

      todo(
        'it should be possible to always render the Dialog if we provide it a `static` prop (and enable focus trapping based on `isOpen`)',
        async function () {}
      );

      todo(
        'it should be possible to always render the Dialog if we provide it a `static` prop (and disable focus trapping based on `isOpen`)',
        async function () {}
      );

      todo(
        'it should be possible to use a different render strategy for the Dialog',
        async function () {}
      );

      todo('it should add a scroll lock to the html tag', async function () {});
    });

    module('Dialog.Overlay', function () {
      test('it should be possible to render Dialog.Overlay using a render prop', async function () {
        this.set('isOpen', false);

        await render(hbs`
          <button id="trigger" type="button" {{on "click" (set this.isOpen true)}}>
            Trigger
          </button>
          <Dialog
            class="relative bg-blue-500"
            @isOpen={{this.isOpen}}
            @onClose={{set this.isOpen false}}
            as |d|
          >
            <d.Overlay>Hello</d.Overlay>
            <div tabindex="0"></div>
          </Dialog>
        `);

        assertDialogOverlay({ state: DialogState.InvisibleUnmounted });

        await click(document.getElementById('trigger'));

        assertDialogOverlay({
          state: DialogState.Visible,
          attributes: { id: 'headlessui-dialog-overlay' },
          textContent: 'Hello',
        });
      });
    });

    module('Dialog.Title', function () {
      test('it should be possible to render Dialog.Title using a render prop', async function () {
        this.set('noop', function () {});

        await render(hbs`
          <Dialog @isOpen={{true}} @onClose={{this.noop}} as |d|>
            <d.Title>Hello</d.Title>
            <div tabindex="0"></div>
          </Dialog>
        `);

        assertDialog({
          state: DialogState.Visible,
          attributes: { id: 'headlessui-dialog' },
        });

        assertDialogTitle({
          state: DialogState.Visible,
          textContent: 'Hello',
        });
      });
    });

    module('Dialog.Description', function () {
      test('it should be possible to render Dialog.Description using a render prop', async function () {
        this.set('noop', function () {});

        await render(hbs`
          <Dialog @isOpen={{true}} @onClose={{this.noop}} as |d|>
            <d.Description>Hello</d.Description>
            <div tabindex="0"></div>
          </Dialog>
        `);

        assertDialog({
          state: DialogState.Visible,
          attributes: { id: 'headlessui-dialog' },
        });

        assertDialogDescription({
          state: DialogState.Visible,
          textContent: 'Hello',
        });
      });
    });
  });

  module('Composition', function () {
    todo(
      'it should be possible to open the Dialog via a Transition component',
      async function () {}
    );

    todo(
      'it should be possible to close the Dialog via a Transition component',
      async function () {}
    );
  });

  module('Keyboard interactions', function () {
    module('Escape key', function () {
      test('it should be possible to close the dialog with Escape', async function () {
        this.set('isOpen', false);

        await render(hbs`
          <button type="button" {{on "click" (set this.isOpen true)}}>
            Trigger
          </button>

          <Dialog @isOpen={{this.isOpen}} @onClose={{set this.isOpen false}}>
            Hello
            <div tabindex="0"></div>
          </Dialog>
        `);

        assertDialog({ state: DialogState.InvisibleUnmounted });

        await click(getByText('Trigger'));

        assertDialog({
          state: DialogState.Visible,
          attributes: { id: 'headlessui-dialog' },
        });

        await triggerKeyEvent(getDialog(), 'keyup', Keys.Escape);

        assertDialog({ state: DialogState.InvisibleUnmounted });
      });
    });
  });

  module('Mouse interactions', function () {
    test('it should be possible to close a Dialog using a click on the Dialog.Overlay', async function () {
      this.set('isOpen', false);

      await render(hbs`
        <button type="button" {{on "click" (set this.isOpen true)}}>
          Trigger
        </button>

        <Dialog @isOpen={{this.isOpen}} @onClose={{set this.isOpen false}} as |d|>
          <d.Overlay />
          Contents
          <div tabindex="0"></div>
        </Dialog>
      `);

      await click(getByText('Trigger'));

      assertDialog({ state: DialogState.Visible });

      await click(getDialogOverlay());

      assertDialog({ state: DialogState.InvisibleUnmounted });
    });

    test('it should be possible to close the dialog, and re-focus the button when we click outside on the body element', async function () {
      this.set('isOpen', false);

      await render(hbs`
        <button type="button" {{on "click" (set this.isOpen true)}}>
          Trigger
        </button>

        <Dialog @isOpen={{this.isOpen}} @onClose={{set this.isOpen false}}>
          Contents
          <div tabindex="0"></div>
        </Dialog>
      `);

      await click(getByText('Trigger'));

      assertDialog({ state: DialogState.Visible });

      await click(document.body);

      assertDialog({ state: DialogState.InvisibleUnmounted });

      assertActiveElement(getByText('Trigger'));
    });

    todo(
      'it should be possible to close the dialog, and keep focus on the focusable element',
      async function () {}
    );

    test('it should stop propagating click events when clicking on the Dialog.Overlay', async function (assert) {
      this.set('isOpen', true);

      let callCount = 0;

      this.set('wrapperFn', function () {
        callCount++;
      });

      await render(hbs`
        {{!-- template-lint-disable no-invalid-interactive  --}}
        <div {{on "click" this.wrapperFn}}>
          <Dialog @isOpen={{this.isOpen}} @onClose={{set this.isOpen false}} as |d|>
            Contents
            <d.Overlay />
            <div tabindex="0"></div>
          </Dialog>
        </div>
      `);

      assertDialog({ state: DialogState.Visible });

      assert.equal(callCount, 0, 'Call count starts as zero');

      await click(getDialogOverlay());

      assertDialog({ state: DialogState.InvisibleUnmounted });

      assert.equal(callCount, 0, 'Click has not propagated to wrapper element');
    });

    test('it should be possible to submit a form inside a Dialog', async function (assert) {
      this.set('noop', function () {});

      let callCount = 0;

      this.set('submitFn', function (event) {
        event.preventDefault();
        event.stopPropagation();
        callCount++;
      });

      await render(hbs`
        <Dialog @isOpen={{true}} @onClose={{this.noop}}>
          <form {{on "submit" this.submitFn}}>
            <input type="hidden" value="abc" />
            <button type="submit">Submit</button>
          </form>
        </Dialog>
      `);

      assertDialog({ state: DialogState.Visible });

      await click(getByText('Submit'));

      assert.equal(callCount, 1, 'Form was able to be submitted');
    });

    test('it should stop propagating click events when clicking on an element inside the Dialog', async function (assert) {
      this.set('isOpen', true);

      let callCount = 0;

      this.set('wrapperFn', function () {
        callCount++;
      });

      await render(hbs`
        {{!-- template-lint-disable no-invalid-interactive  --}}
        <div {{on "click" this.wrapperFn}}>
          <Dialog
            @isOpen={{this.isOpen}}
            @onClose={{set this.isOpen false}}
            as |dialog|
          >
            Contents
            <button type="button" {{on "click" dialog.onClose}}>Inside</button>
          </Dialog>
        </div>
      `);

      assertDialog({ state: DialogState.Visible });

      assert.equal(callCount, 0, 'Call count starts at zero');

      await click(getByText('Inside'));

      assertDialog({ state: DialogState.InvisibleUnmounted });

      assert.equal(callCount, 0, 'Click has not propagated out of Dialog');
    });
  });

  module('Nesting', function () {
    todo(
      'it should be possible to open nested Dialog components and close them with `Escape`',
      async function () {}
    );

    todo(
      'it should be possible to open nested Dialog components and close them with `Outside Click`',
      async function () {}
    );

    todo(
      'it should be possible to open nested Dialog components and close them with `Click on Dialog.Overlay`',
      async function () {}
    );
  });

  module('InitialFocus', function () {
    test('it should focus requested element', async function (assert) {
      this.set('isOpen', false);

      await render(hbs`
        <button id='trigger' type="button" {{on "click" (set this.isOpen true)}}>
          Trigger
        </button>
        <Dialog
          @isOpen={{this.isOpen}}
          @onClose={{set this.isOpen false}}
          @initialFocus='[data-test-focused-button]'
        >
          <input type="text" value="first">
          <button data-test-focused-button type="button">focused</button>
        </Dialog>
      `);
      await click('#trigger');
      await assert.waitFor(() => {
        assertActiveElement(getByText('focused'));
      });
    });
  });
});
