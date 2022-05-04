import {
  click,
  render,
  setupOnerror,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test, todo } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import userEvent from '@testing-library/user-event';
import { Keys } from 'ember-headlessui/utils/keyboard';

import {
  assertActiveElement,
  assertDialog,
  assertDialogDescription,
  assertDialogOverlay,
  assertDialogTitle,
  DialogState,
  getByText,
  getDialog,
  getDialogOverlay,
  getDialogOverlays,
  getDialogs,
} from '../../accessibility-assertions';

module('Integration | Component | <Dialog>', function (hooks) {
  setupRenderingTest(hooks);

  module('Safe guards', function () {
    test('should error when we are using a <Dialog::-Overlay /> without a parent <Dialog />', async function (assert) {
      assert.expect(1);

      setupOnerror(function (err) {
        assert.strictEqual(
          err.message,
          '<Dialog::-Overlay /> is missing a parent <Dialog /> component.',
          'Throw initialization error'
        );
      });

      await render(hbs`<Dialog::-Overlay />`);
    });

    test('should error when we are using a <Dialog::-Title /> without a parent <Dialog />', async function (assert) {
      assert.expect(1);

      setupOnerror(function (err) {
        assert.strictEqual(
          err.message,
          '<Dialog::-Title /> is missing a parent <Dialog /> component.',
          'Throw initialization error'
        );
      });

      await render(hbs`<Dialog::-Title />`);
    });

    test('should error when we are using a <Dialog::-Description /> without a parent <Dialog />', async function (assert) {
      assert.expect(1);

      setupOnerror(function (err) {
        assert.strictEqual(
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
        assert.expect(1);

        setupOnerror(function (err) {
          assert.strictEqual(
            err.message,
            'You have to provide an `isOpen` and an `onClose` prop to the `Dialog` component.',
            'Throw initialization error'
          );
        });

        await render(hbs`<Dialog @as="div" />`);
      });

      test('it should complain when an `isOpen` prop is provided without an `onClose` prop', async function (assert) {
        assert.expect(1);

        setupOnerror(function (err) {
          assert.strictEqual(
            err.message,
            'You provided an `isOpen` prop to the `Dialog`, but forgot an `onClose` prop.',
            'Throw initialization error'
          );
        });

        await render(hbs`<Dialog @as="div" @isOpen={{false}} />`);
      });

      test('it should complain when an `onClose` prop is provided without an `isOpen` prop', async function (assert) {
        assert.expect(1);

        this.set('noop', function () {});

        setupOnerror(function (err) {
          assert.strictEqual(
            err.message,
            'You provided an `onClose` prop to the `Dialog`, but forgot an `isOpen` prop.',
            'Throw initialization error'
          );
        });

        await render(hbs`<Dialog @as="div" @onClose={{this.noop}}/>`);
      });

      test('it should complain when an `isOpen` prop is not a boolean', async function (assert) {
        assert.expect(1);

        this.set('noop', function () {});

        setupOnerror(function (err) {
          assert.strictEqual(
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
        assert.expect(1);

        setupOnerror(function (err) {
          assert.strictEqual(
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
          <button id="trigger" type="button" {{on "click" (set this "isOpen" true)}}>
            Trigger
          </button>
          <Dialog @isOpen={{this.isOpen}} @onClose={{set this "isOpen" false}}>
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
          <button id="trigger" type="button" {{on "click" (set this "isOpen" true)}}>
            Trigger
          </button>
          <Dialog
            class="relative bg-blue-500"
            @isOpen={{this.isOpen}}
            @onClose={{set this "isOpen" false}}
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

      test('it should add a scroll lock to the html tag', async function (assert) {
        const portalRoot = document.querySelector('#ember-testing');
        this.set('isOpen', false);

        await render(hbs`
          <button id="trigger" type="button" {{on "click" (set this "isOpen" true)}}>
            Trigger
          </button>
          <Dialog
            class="relative bg-blue-500"
            @isOpen={{this.isOpen}}
            @onClose={{set this "isOpen" false}}
            as |d|
          >
            <d.Overlay>Hello</d.Overlay>
            <div tabindex="0"></div>
          </Dialog>
        `);

        assert
          .dom(portalRoot)
          .doesNotHaveStyle(
            { overflow: 'hidden' },
            'The page is not initially "locked"'
          );

        await click(document.getElementById('trigger'));

        assert
          .dom(portalRoot)
          .hasStyle(
            { overflow: 'hidden' },
            'The page becomes "locked" when the dialog is open'
          );

        await click(getDialogOverlay());

        assert
          .dom(portalRoot)
          .doesNotHaveStyle(
            { overflow: 'hidden' },
            'The page is "unlocked" when the dialog closes'
          );
      });
    });

    module('Dialog.Overlay', function () {
      test('it should be possible to render Dialog.Overlay using a render prop', async function () {
        this.set('isOpen', false);

        await render(hbs`
          <button id="trigger" type="button" {{on "click" (set this "isOpen" true)}}>
            Trigger
          </button>
          <Dialog
            class="relative bg-blue-500"
            @isOpen={{this.isOpen}}
            @onClose={{set this "isOpen" false}}
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
    test('it should be possible to open the Dialog via a Transition component', async function () {
      this.set('noop', function () {});

      await render(hbs`
        <Transition @show={{true}}>
          <Dialog @isOpen={{true}} @onClose={{this.noop}} as |d|>
            <d.Description>Hello</d.Description>
            <div tabindex="0"></div>
          </Dialog>
        </Transition>
      `);

      assertDialog({ state: DialogState.Visible });
      assertDialogDescription({
        state: DialogState.Visible,
        textContent: 'Hello',
      });
    });

    test('it should be possible to close the Dialog via a Transition component', async function () {
      this.set('noop', function () {});

      await render(hbs`
        <Transition @show={{false}}>
          <Dialog @isOpen={{true}} @onClose={{this.noop}} as |d|>
            <d.Description>Hello</d.Description>
            <div tabindex="0"></div>
          </Dialog>
        </Transition>
      `);

      assertDialog({ state: DialogState.InvisibleUnmounted });
    });
  });

  module('Keyboard interactions', function () {
    module('Escape key', function () {
      test('it should be possible to close the dialog with Escape', async function () {
        this.set('isOpen', false);

        await render(hbs`
          <button type="button" {{on "click" (set this "isOpen" true)}}>
            Trigger
          </button>

          <Dialog @isOpen={{this.isOpen}} @onClose={{set this "isOpen" false}}>
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
        <button type="button" {{on "click" (set this "isOpen" true)}}>
          Trigger
        </button>

        <Dialog @isOpen={{this.isOpen}} @onClose={{set this "isOpen" false}} as |d|>
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
        <button type="button" {{on "click" (set this "isOpen" true)}}>
          Trigger
        </button>

        <Dialog @isOpen={{this.isOpen}} @onClose={{set this "isOpen" false}}>
          Contents
          <div tabindex="0"></div>
        </Dialog>
      `);

      await click(getByText('Trigger'));

      assertDialog({ state: DialogState.Visible });

      await click(document.body);

      assertDialog({ state: DialogState.InvisibleUnmounted });

      await assertActiveElement(getByText('Trigger'));
    });

    test('it should be possible to close the dialog, and keep focus on the focusable element', async function () {
      this.set('isOpen', false);

      await render(hbs`
        <button>Hello</button>
        <button type="button" {{on "click" (set this "isOpen" true)}}>
          Trigger
        </button>
        <Dialog @isOpen={{this.isOpen}} @onClose={{set this "isOpen" false}}>
          Contents
          <div tabindex="0"></div>
        </Dialog>
      `);

      await click(getByText('Trigger'));

      assertDialog({ state: DialogState.Visible });

      await click(getByText('Hello'));

      assertDialog({ state: DialogState.InvisibleUnmounted });

      await assertActiveElement(getByText('Hello'));
    });

    test('it should stop propagating click events when clicking on the Dialog.Overlay', async function (assert) {
      this.set('isOpen', true);

      let callCount = 0;

      this.set('wrapperFn', function () {
        callCount++;
      });

      await render(hbs`
        {{!-- template-lint-disable no-invalid-interactive  --}}
        <div {{on "click" this.wrapperFn}}>
          <Dialog @isOpen={{this.isOpen}} @onClose={{set this "isOpen" false}} as |d|>
            Contents
            <d.Overlay />
            <div tabindex="0"></div>
          </Dialog>
        </div>
      `);

      assertDialog({ state: DialogState.Visible });

      assert.strictEqual(callCount, 0, 'Call count starts as zero');

      await click(getDialogOverlay());

      assertDialog({ state: DialogState.InvisibleUnmounted });

      assert.strictEqual(
        callCount,
        0,
        'Click has not propagated to wrapper element'
      );
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

      assert.strictEqual(callCount, 1, 'Form was able to be submitted');
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
            @onClose={{set this "isOpen" false}}
            as |dialog|
          >
            Contents
            <button type="button" {{on "click" dialog.onClose}}>Inside</button>
          </Dialog>
        </div>
      `);

      assertDialog({ state: DialogState.Visible });

      assert.strictEqual(callCount, 0, 'Call count starts at zero');

      await click(getByText('Inside'));

      assertDialog({ state: DialogState.InvisibleUnmounted });

      assert.strictEqual(
        callCount,
        0,
        'Click has not propagated out of Dialog'
      );
    });
  });

  module('Nesting', function () {
    test.each(
      'it should be possible to open nested Dialog components and close them with `${strategy}`',
      [
        {
          strategy: 'outside click',
          action: () => click(document.body),
        },
        {
          strategy: 'ESCAPE click',
          action: () =>
            triggerKeyEvent(document.activeElement, 'keyup', Keys.Escape),
        },
        {
          strategy: 'click on Dialog.Overlay',
          action: () => click(getDialogOverlays().pop()),
        },
      ],
      async function (assert, { action }) {
        this.isOpen = false;

        await render(hbs`
          <button
            type="button"
            {{on 'click' (set this "isOpen" true)}}>
            Open 1
          </button>
          <Dialogs::Nested
            @isOpen={{this.isOpen}}
            @onClose={{set this "isOpen" false}}
            @level={{1}}
          />
        `);

        assert.strictEqual(
          getDialogs().length,
          0,
          'Verify we have no open dialogs'
        );

        await click(getByText('Open 1'), 'Open Dialog 1');

        assert.strictEqual(
          getDialogs().length,
          1,
          'Verify that we have 1 open dialog'
        );

        await assertActiveElement(
          getByText('Open 2 a'),
          'Verify that the `Open 2 a` has focus'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 2 b'),
          'Verify that we can tab around'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 2 c'),
          'Verify that we can tab around'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 2 a'),
          'Verify that we can tab around'
        );

        // Open Dialog 2 via the second button
        await click(getByText('Open 2 b'));

        assert.strictEqual(
          getDialogs().length,
          2,
          'Verify that we have 2 open dialogs'
        );

        await assertActiveElement(
          getByText('Open 3 a'),
          'Verify that the `Open 3 a` has focus'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 3 b'),
          'Verify that we can tab around'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 3 c'),
          'Verify that we can tab around'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 3 a'),
          'Verify that we can tab around'
        );

        //close the top most dialog with ${strategy}
        await action();

        assert.strictEqual(
          getDialogs().length,
          1,
          'Verify that we have 1 open dialog'
        );

        await assertActiveElement(
          getByText('Open 2 b'),
          'Verify that the `Open 2 b` button got focused again'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 2 c'),
          'Verify that we can tab around'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 2 a'),
          'Verify that we can tab around'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 2 b'),
          'Verify that we can tab around'
        );

        // Open Dialog 2 via the second button
        await click(getByText('Open 2 b'));

        await assertActiveElement(
          getByText('Open 3 a'),
          'Verify that the `Open 3 a` has focus'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 3 b'),
          'Verify that we can tab around'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 3 c'),
          'Verify that we can tab around'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 3 a'),
          'Verify that we can tab around'
        );

        assert.strictEqual(
          getDialogs().length,
          2,
          'Verify that we have 2 open dialogs'
        );

        // Open Dialog 3 via button c
        await click(getByText('Open 3 c'));

        await assertActiveElement(
          getByText('Open 4 a'),
          'Verify that the `Open 4 a` has focus'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 4 b'),
          'Verify that we can tab around'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 4 c'),
          'Verify that we can tab around'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 4 a'),
          'Verify that we can tab around'
        );

        assert.strictEqual(
          getDialogs().length,
          3,
          'Verify that we have 3 open dialogs'
        );

        //close the top most dialog with ${strategy}
        await action();

        await assertActiveElement(
          getByText('Open 3 c'),
          'Verify that the `Open 3 c` button got focused again'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 3 a'),
          'Verify that we can tab around'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 3 b'),
          'Verify that we can tab around'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 3 c'),
          'Verify that we can tab around'
        );

        assert.strictEqual(
          getDialogs().length,
          2,
          'Verify that we have 2 open dialogs'
        );

        //close the top most dialog with ${strategy}
        await action();

        assert.strictEqual(
          getDialogs().length,
          1,
          'Verify that we have 1 open dialog'
        );

        await assertActiveElement(
          getByText('Open 2 b'),
          'Verify that the `Open 2 b` button got focused again'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 2 c'),
          'Verify that we can tab around'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 2 a'),
          'Verify that we can tab around'
        );

        userEvent.tab();
        await assertActiveElement(
          getByText('Open 2 b'),
          'Verify that we can tab around'
        );

        //close the top most dialog with ${strategy}
        await action();

        assert.strictEqual(
          getDialogs().length,
          0,
          'Verify that we have 0 open dialogs'
        );

        await assertActiveElement(
          getByText('Open 1'),
          'Verify that the `Open 1` got focused again'
        );
      }
    );
  });

  module('InitialFocus', function () {
    test('it should focus requested element', async function (assert) {
      this.set('isOpen', false);

      await render(hbs`
        <button id='trigger' type="button" {{on "click" (set this "isOpen" true)}}>
          Trigger
        </button>
        <Dialog
          @isOpen={{this.isOpen}}
          @onClose={{set this "isOpen" false}}
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

    test('it should fallback to focus the dialog if there are no focusable elements', async function (assert) {
      this.set('isOpen', false);

      await render(hbs`
        <button id='trigger' type="button" {{on "click" (set this "isOpen" true)}}>
          Trigger
        </button>
        <Dialog
          @isOpen={{this.isOpen}}
          @onClose={{set this "isOpen" false}}
        >
          <h2>focused the whole dialog</h2>
        </Dialog>
      `);

      await click('#trigger');

      await assert.waitFor(() => {
        // focus is on the actual dialog as a fallback
        return assertActiveElement(getDialog());
      });
    });
  });
});
