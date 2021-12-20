import Component from '@glimmer/component';
import {
  click,
  focus,
  render,
  triggerEvent,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, skip, test, todo } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import {
  assertActiveElement,
  assertActiveListboxOption,
  assertListbox,
  assertListboxButton,
  assertListboxButtonLinkedWithListbox,
  assertListboxButtonLinkedWithListboxLabel,
  assertListboxLabel,
  assertListboxLabelLinkedWithListbox,
  assertListboxOption,
  assertNoActiveListboxOption,
  assertNoSelectedListboxOption,
  getListbox,
  getListboxButton,
  getListboxButtons,
  getListboxes,
  getListboxLabel,
  getListboxOptions,
  ListboxState,
} from '../../accessibility-assertions';

async function typeWord(word) {
  word.split('').forEach((char) => {
    triggerEvent(document.activeElement, 'keypress', {
      key: char,
    });
  });
  await new Promise((r) => setTimeout(r, 600));
}

module('Integration | Component | <Listbox>', function (hooks) {
  setupRenderingTest(hooks);

  test('should be possible to render a Listbox without crashing', async function () {
    await render(hbs`
      <Listbox as |listbox|>
        <listbox.Button data-test="my-custom-property">Trigger</listbox.Button>
        <listbox.Options as |options|>
          <options.Option>option</options.Option>
        </listbox.Options>
      </Listbox>
    `);
    assertListboxButton({
      state: ListboxState.InvisibleUnmounted,
      attributes: { 'data-test': 'my-custom-property' },
    });
    assertListbox({
      state: ListboxState.InvisibleUnmounted,
    });
  });

  test('should be possible to render a Listbox using a "isOpen" property', async function () {
    await render(hbs`
      <Listbox as |listbox|>
        <listbox.Button data-test="my-custom-property">Trigger</listbox.Button>
        {{#if listbox.isOpen}}
          <listbox.Options as |options|>
            <options.Option>option</options.Option>
          </listbox.Options>
        {{/if}}
      </Listbox>
    `);
    assertListboxButton({
      state: ListboxState.InvisibleUnmounted,
      attributes: { 'data-test': 'my-custom-property' },
    });
    assertListbox({ state: ListboxState.InvisibleUnmounted });

    await click(getListboxButton());

    assertListboxButton({
      state: ListboxState.Visible,
      attributes: { 'data-test': 'my-custom-property' },
    });
    assertListbox({ state: ListboxState.Visible });
  });

  test('should be possible to disable a Listbox', async function () {
    await render(hbs`
      <Listbox @disabled={{true}} as |listbox|>
        <listbox.Button data-test="my-custom-property">Trigger</listbox.Button>
        <listbox.Options as |options|>
          <options.Option>option</options.Option>
        </listbox.Options>
      </Listbox>
    `);
    assertListboxButton({
      state: ListboxState.InvisibleUnmounted,
      attributes: { 'data-test': 'my-custom-property' },
    });
    assertListbox({ state: ListboxState.InvisibleUnmounted });
  });

  module('<listbox.Label>', () => {
    test('should be possible to render a <listbox.Label> using yielded props', async function () {
      await render(hbs`
        <Listbox as |listbox|>
          <listbox.Label data-test="headlessui-listbox-label-1">{{listbox.isOpen}} {{listbox.disabled}}</listbox.Label>
          <listbox.Button data-test="my-custom-property">Trigger</listbox.Button>
          <listbox.Options as |options|>
            <options.Option>option</options.Option>
          </listbox.Options>
        </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'my-custom-property' },
      });
      assertListboxLabel({
        attributes: { 'data-test': 'headlessui-listbox-label-1' },
        textContent: 'false false',
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      await click(getListboxButton());

      assertListboxLabel({
        attributes: { 'data-test': 'headlessui-listbox-label-1' },
        textContent: 'true false',
      });
      assertListbox({ state: ListboxState.Visible });
      assertListboxLabelLinkedWithListbox();
      assertListboxButtonLinkedWithListboxLabel();
    });

    test('should be possible to render a Listbox.Label using a yielded props and tag name', async function () {
      await render(hbs`
        <Listbox as |listbox|>
          <listbox.Label data-test="headlessui-listbox-label-1" @as="p">Label</listbox.Label>
          <listbox.Button>Trigger</listbox.Button>
          <listbox.Options as |options|>
            <options.Option @value="a">Option A</options.Option>
            <options.Option @value="b">Option B</options.Option>
            <options.Option @value="c">Option C</options.Option>
          </listbox.Options>
        </Listbox>
      `);

      assertListboxLabel({
        attributes: { 'data-test': 'headlessui-listbox-label-1' },
        textContent: 'Label',
        tag: 'p',
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      await click(getListboxButton());
      assertListboxLabel({
        attributes: { 'data-test': 'headlessui-listbox-label-1' },
        textContent: 'Label',
        tag: 'p',
      });
      assertListbox({ state: ListboxState.Visible });
    });
  });

  module('<listbox.Button>', () => {
    test('should be possible to render a <listbox.Button> using yielded props', async function () {
      await render(hbs`
        <Listbox as |listbox|>
          <listbox.Label>Label</listbox.Label>
          <listbox.Button data-test="headlessui-listbox-button-1">{{listbox.isOpen}} {{listbox.disabled}}</listbox.Button>
          <listbox.Options as |options|>
            <options.Option @value="a">Option A</options.Option>
            <options.Option @value="b">Option B</options.Option>
            <options.Option @value="c">Option C</options.Option>
          </listbox.Options>
        </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
        textContent: 'false false',
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      await click(getListboxButton());

      assertListboxButton({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
        textContent: 'true false',
      });
      assertListbox({ state: ListboxState.Visible });
    });

    test('should be possible to render a <listbox.Button> using yielded props and tag name', async function () {
      await render(hbs`
        <Listbox as |listbox|>
          <listbox.Label>Label</listbox.Label>
          <listbox.Button data-test="headlessui-listbox-button-1" @as="p" @role="button">{{listbox.isOpen}} {{listbox.disabled}}</listbox.Button>
          <listbox.Options as |options|>
            <options.Option @value="a">Option A</options.Option>
            <options.Option @value="b">Option B</options.Option>
            <options.Option @value="c">Option C</options.Option>
          </listbox.Options>
        </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
        textContent: 'false false',
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      await click(getListboxButton());

      assertListboxButton({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
        textContent: 'true false',
      });
      assertListbox({ state: ListboxState.Visible });
    });

    test('should be possible to render a Listbox.Button and a Listbox.Label and see them linked together', async function () {
      await render(hbs`
        <Listbox as |listbox|>
          <listbox.Label>Label</listbox.Label>
          <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
          <listbox.Options as |options|>
            <options.Option @value="a">Option A</options.Option>
            <options.Option @value="b">Option B</options.Option>
            <options.Option @value="c">Option C</options.Option>
          </listbox.Options>
        </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });
      assertListboxButtonLinkedWithListboxLabel();
    });
  });

  module('<listbox.Options>', () => {
    test('should be possible to render a <listbox.Options> using yielded props', async function () {
      await render(hbs`
        <Listbox as |listbox|>
          <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
          <listbox.Options as |options|>
            <options.Option @value="a">{{listbox.isOpen}}</options.Option>
            <options.Option @value="b">{{listbox.isOpen}}</options.Option>
            <options.Option @value="c">{{listbox.isOpen}}</options.Option>
          </listbox.Options>
        </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      await click(getListboxButton());

      assertListboxButton({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({
        state: ListboxState.Visible,
        textContent: 'true true true',
      });
      await assertActiveElement(getListbox());
    });

    test('should be possible to always render the Listbox.Options if we provide it a `static` prop', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
          <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
          <listbox.Options @static={{true}} as |options|>
            <options.Option @value="a">Option A</options.Option>
            <options.Option @value="b">Option B</options.Option>
            <options.Option @value="c">Option C</options.Option>
          </listbox.Options>
        </Listbox>
      `);

      // Let's verify that the Listbox is already there
      assert.dom(getListbox()).exists();
    });

    todo(
      'should be possible to use a different render strategy for the Listbox.Options',
      async () => {}
    );
  });

  module('<listbox.Option>', () => {
    test('should be possible to render a <listbox.Option> using yielded props', async function () {
      await render(hbs`
        <Listbox as |listbox|>
          <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
          <listbox.Options as |options|>
            <options.Option @value="a" as |option|>{{option.active}} {{option.selected}} {{option.disabled}}</options.Option>
          </listbox.Options>
        </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      await click(getListboxButton());

      assertListboxButton({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({
        state: ListboxState.Visible,
        textContent: 'false false false',
      });
    });
  });

  module('Listbox Rendering composition', () => {
    todo(
      'should be possible to conditionally render classNames (aka className can be a function?!)',
      async function () {}
    );

    test('should be possible to swap the Listbox option with a button for example', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options as |options|>
             <options.Option @as="button" @value="a">
               Option A
             </options.Option>
             <options.Option @as="button" @value="b">
               Option B
             </options.Option>
             <options.Option @as="button" @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Open Listbox
      await click(getListboxButton());

      // Verify options are buttons now
      getListboxOptions().forEach((option) =>
        assertListboxOption({ tag: 'button' }, option)
      );
    });
  });

  module('Listbox composition', () => {
    test('test should be possible to wrap the Listbox.Options with a Transition component', async function (assert) {
      let order = [];

      this.set('orderFn', (value) => {
        order.push(value);
      });

      this.owner.register(
        'component:debug',
        class DebugComponent extends Component {
          constructor() {
            super(...arguments);
            this.args.fn('Mounting - ' + this.args.name);
          }

          willDestroy() {
            this.args.fn('Unmounting - ' + this.args.name);
          }
        }
      );

      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <Debug @name="Listbox" @fn={{this.orderFn}}/>
           <Transition @show={{listbox.isOpen}}>
             <Debug @name="Transition" @fn={{this.orderFn}}/>
             <listbox.Options
               @isOpen={{true}}
               as |options|>
               <options.Option as |option|>
                 {{option.active}} {{option.selected}} {{option.disabled}}
                 <Debug @name="Listbox.Option" @fn={{this.orderFn}}/>
               </options.Option>
             </listbox.Options>
            </Transition>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      await click(getListboxButton());

      assertListboxButton({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({
        state: ListboxState.Visible,
        textContent: 'false false false',
      });

      await click(getListboxButton());

      // Verify that we tracked the `mounts` and `unmounts` in the correct order
      assert.deepEqual(order, [
        'Mounting - Listbox',
        'Mounting - Transition',
        'Mounting - Listbox.Option',
        'Unmounting - Transition',
        'Unmounting - Listbox.Option',
      ]);
    });
  });

  module('Listbox keyboard actions', () => {
    test('`Enter` key', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({
        state: ListboxState.Visible,
      });
      await assertActiveElement(getListbox());
      assertListboxButtonLinkedWithListbox();

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);

      getListboxOptions().forEach((option) =>
        assertListboxOption({ selected: false }, option)
      );
      // Verify that the first listbox option is active
      assertActiveListboxOption(options[0]);
      assertNoSelectedListboxOption();
    });

    test('should not be possible to open the listbox with Enter when the button is disabled', async function () {
      await render(hbs`
        <Listbox @disabled={{true}} as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Try to open the listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      // Verify it is still closed
      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });
    });

    test('should be possible to open the listbox with Enter, and focus the selected option', async function (assert) {
      await render(hbs`
        <Listbox @value="b" as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-options-1' },
      });
      await assertActiveElement(getListbox());
      assertListboxButtonLinkedWithListbox();

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option, i) =>
        assertListboxOption({ selected: i === 1 }, option)
      );

      // Verify that the second listbox option is active (because it is already selected)
      assertActiveListboxOption(options[1]);
    });

    todo(
      'should be possible to open the listbox with Enter, and focus the selected option (when using the `hidden` render strategy)',
      async () => {}
    );

    test('should be possible to open the listbox with Enter, and focus the selected option (with a list of objects)', async function (assert) {
      this.set('myOptions', [
        { id: 'a', name: 'Option A' },
        { id: 'b', name: 'Option B' },
        { id: 'c', name: 'Option C' },
      ]);
      this.set('selectedOption', this.myOptions[1]);
      await render(hbs`
        <Listbox @value={{this.selectedOption}} as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             {{#each this.myOptions as |myOption|}}
               <options.Option @value={{myOption}}>
                 {{myOption.name}}
               </options.Option>
             {{/each}}
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-options-1' },
      });
      await assertActiveElement(getListbox());
      assertListboxButtonLinkedWithListbox();

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option, i) =>
        assertListboxOption({ selected: i === 1 }, option)
      );

      // Verify that the second listbox option is active (because it is already selected)
      assertActiveListboxOption(options[1]);
    });

    test('should have no active listbox option when there are no listbox options at all', async function () {
      await render(hbs`
        <Listbox @value={{this.selectedOption}} as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1"/>
         </Listbox>
      `);

      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');
      assertListbox({ state: ListboxState.Visible });
      await assertActiveElement(getListbox());

      assertNoActiveListboxOption();
    });

    test('should focus the first non disabled listbox option when opening with Enter', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      let options = getListboxOptions();

      // Verify that the first non-disabled listbox option is active
      assertActiveListboxOption(options[1]);
    });

    test('should focus the first non disabled listbox option when opening with Enter (jump over multiple disabled ones)', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      let options = getListboxOptions();

      // Verify that the first non-disabled listbox option is active
      assertActiveListboxOption(options[2]);
    });

    test('should have no active listbox option upon Enter key press, when there are no non-disabled listbox options', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @disabled={{true}} @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton().focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      assertNoActiveListboxOption();
    });

    test('should be possible to close the listbox with Enter when there is no active listboxoption', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Open listbox
      await click(getListboxButton());

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });

      // Close listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      // Verify it is closed
      assertListboxButton({ state: ListboxState.InvisibleUnmounted });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Verify the button is focused again
      await assertActiveElement(getListboxButton());
    });

    test('should be possible to close the listbox with Enter and choose the active listbox option', async function (assert) {
      let callValue = '',
        callCount = 0;

      this.set('onChange', (value) => {
        this.set('selectedOption', value);
        callValue = value;
        callCount++;
      });

      await render(hbs`
        <Listbox @onChange={{this.onChange}} @value={{this.selectedOption}} as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Open listbox
      await click(getListboxButton());

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });

      // Activate the first listbox option
      let options = getListboxOptions();
      await triggerEvent(options[0], 'mouseover');

      // Choose option, and close listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      // Verify it is closed
      assertListboxButton({ state: ListboxState.InvisibleUnmounted });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Verify we got the change event
      assert.strictEqual(callCount, 1, 'handleChange called once exactly');
      assert.strictEqual(callValue, 'a', 'handleChange called with "a"');

      // Verify the button is focused again
      await assertActiveElement(getListboxButton());

      // Open listbox again
      await click(getListboxButton());

      // Verify the active option is the previously selected one
      assertActiveListboxOption(getListboxOptions()[0]);
    });
  });

  module('Listbox `Space` key', () => {
    test('should be possible to open the listbox with Space', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Space');

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-options-1' },
      });
      await assertActiveElement(getListbox());
      assertListboxButtonLinkedWithListbox();

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option) => assertListboxOption({}, option));
      assertActiveListboxOption(options[0]);
    });

    test('should not be possible to open the listbox with Space when the button is disabled', async function () {
      await render(hbs`
        <Listbox @disabled={{true}} as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Try to open the listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Space');
      // Verify it is still closed
      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });
    });

    test('should be possible to open the listbox with Space, and focus the selected option', async function (assert) {
      await render(hbs`
        <Listbox @value="b" as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Space');

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-options-1' },
      });
      await assertActiveElement(getListbox());
      assertListboxButtonLinkedWithListbox();

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option, i) =>
        assertListboxOption({ selected: i === 1 }, option)
      );

      // Verify that the second listbox option is active (because it is already selected)
      assertActiveListboxOption(options[1]);
    });

    test('should have no active listbox option when there are no listbox options at all', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" />
         </Listbox>
      `);

      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Space');
      assertListbox({ state: ListboxState.Visible });
      await assertActiveElement(getListbox());

      assertNoActiveListboxOption();
    });

    test('should focus the first non disabled listbox option when opening with Space', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Space');

      let options = getListboxOptions();

      // Verify that the first non-disabled listbox option is active
      assertActiveListboxOption(options[1]);
    });

    test('should focus the first non disabled listbox option when opening with Space (jump over multiple disabled ones)', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Space');

      let options = getListboxOptions();

      // Verify that the first non-disabled listbox option is active
      assertActiveListboxOption(options[2]);
    });

    test('should have no active listbox option upon Space key press, when there are no non-disabled listbox options', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @disabled={{true}} @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Space');

      assertNoActiveListboxOption();
    });

    test('should be possible to close the listbox with Space and choose the active listbox option', async function (assert) {
      let callValue = '',
        callCount = 0;

      this.set('onChange', (value) => {
        this.set('selectedOption', value);
        callValue = value;
        callCount++;
      });

      await render(hbs`
        <Listbox @onChange={{this.onChange}} @value={{this.selectedOption}} as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">Option A</options.Option>
             <options.Option @value="b">Option B</options.Option>
             <options.Option @value="c">Option C</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Open listbox
      await click(getListboxButton());

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });

      // Activate the first listbox option
      let options = getListboxOptions();
      await triggerEvent(options[0], 'mouseover');

      // Choose option, and close listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Space');

      // Verify it is closed
      assertListboxButton({ state: ListboxState.InvisibleUnmounted });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Verify we got the change event
      assert.strictEqual(callCount, 1, 'handleChange called once exactly');
      assert.strictEqual(callValue, 'a', 'handleChange called with "a"');

      // Verify the button is focused again
      await assertActiveElement(getListboxButton());

      // Open listbox again
      await click(getListboxButton());

      // Verify the active option is the previously selected one
      assertActiveListboxOption(getListboxOptions()[0]);
    });
  });

  module('Listbox `Escape` key', () => {
    test('should be possible to close an open listbox with Escape', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Focus the button
      getListboxButton().focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Space');

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-options-1' },
      });
      await assertActiveElement(getListbox());
      assertListboxButtonLinkedWithListbox();

      // Close listbox
      await triggerKeyEvent(document.activeElement, 'keyup', 'Escape');

      // Verify it is closed
      assertListboxButton({ state: ListboxState.InvisibleUnmounted });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Verify the button is focused again
      await assertActiveElement(getListboxButton());
    });
  });

  module('Listbox `Tab` key', () => {
    test('should focus trap when we use Tab', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-options-1' },
      });
      await assertActiveElement(getListbox());
      assertListboxButtonLinkedWithListbox();

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option) => assertListboxOption({}, option));
      assertActiveListboxOption(options[0]);

      // Try to tab
      await triggerKeyEvent(document.activeElement, 'keypress', 'Tab');

      // Verify it is still open
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({ state: ListboxState.Visible });
      await assertActiveElement(getListbox());
    });

    test('should focus trap when we use Shift+Tab', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-options-1' },
      });
      await assertActiveElement(getListbox());
      assertListboxButtonLinkedWithListbox();

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option) => assertListboxOption({}, option));
      assertActiveListboxOption(options[0]);

      // Try to Shift+Tab
      await triggerKeyEvent(document.activeElement, 'keypress', 'Tab', {
        shiftKey: true,
      });

      // Verify it is still open
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({ state: ListboxState.Visible });
      await assertActiveElement(getListbox());
    });
  });

  module('Listbox `ArrowDown` key', () => {
    test('should be possible to open the listbox with ArrowDown', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowDown');

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-options-1' },
      });
      await assertActiveElement(getListbox());
      assertListboxButtonLinkedWithListbox();

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option) => assertListboxOption({}, option));

      // Verify that the first listbox option is active
      assertActiveListboxOption(options[0]);
    });

    test('should be possible to use ArrowDown to navigate the listbox options', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option) => assertListboxOption({}, option));
      assertActiveListboxOption(options[0]);

      // We should be able to go down once
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowDown');
      assertActiveListboxOption(options[1]);

      // We should be able to go down again
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowDown');
      assertActiveListboxOption(options[2]);

      // We should NOT be able to go down again (because last option). Current implementation won't go around.
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowDown');
      assertActiveListboxOption(options[2]);
    });

    test('should be possible to use ArrowDown to navigate the listbox options and skip the first disabled one', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option) => assertListboxOption({}, option));
      assertActiveListboxOption(options[1]);

      // We should be able to go down once
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowDown');
      assertActiveListboxOption(options[2]);
    });

    test('should be possible to use ArrowDown to navigate the listbox options and jump to the first non-disabled one', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option) => assertListboxOption({}, option));
      assertActiveListboxOption(options[2]);
    });
  });

  module('Listbox `ArrowRight` key', () => {
    test('should be possible to use ArrowRight to navigate the listbox options', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option) => assertListboxOption({}, option));
      assertActiveListboxOption(options[0]);

      // We should be able to go right once
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowRight');
      assertActiveListboxOption(options[1]);

      // We should be able to go right again
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowRight');
      assertActiveListboxOption(options[2]);

      // We should NOT be able to go right again (because last option). Current implementation won't go around.
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowRight');
      assertActiveListboxOption(options[2]);
    });
  });

  module('Listbox `ArrowUp` key', () => {
    test('should be possible to open the listbox with ArrowUp and the last option should be active', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-options-1' },
      });
      await assertActiveElement(getListbox());
      assertListboxButtonLinkedWithListbox();

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option) => assertListboxOption({}, option));

      // ! ALERT: The LAST option should now be active
      assertActiveListboxOption(options[2]);
    });

    test('should not be possible to open the listbox with ArrowUp and the last option should be active when the button is disabled', async function () {
      await render(hbs`
        <Listbox @disabled={{true}} as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Try to open the listbox
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');

      // Verify it is still closed
      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });
    });

    test('should be possible to open the listbox with ArrowUp, and focus the selected option', async function (assert) {
      await render(hbs`
        <Listbox @value="b" as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-options-1' },
      });
      await assertActiveElement(getListbox());
      assertListboxButtonLinkedWithListbox();

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option, i) =>
        assertListboxOption({ selected: i === 1 }, option)
      );

      // Verify that the second listbox option is active (because it is already selected)
      assertActiveListboxOption(options[1]);
    });

    test('should have no active listbox option when there are no listbox options at all', async function () {
      await render(hbs`
        <Listbox as |listbox|>
          <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
          <listbox.Options data-test="headlessui-listbox-options-1" />
        </Listbox>
      `);

      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');
      assertListbox({ state: ListboxState.Visible });
      await assertActiveElement(getListbox());

      assertNoActiveListboxOption();
    });

    test('should be possible to use ArrowUp to navigate the listbox options and jump to the first non-disabled one', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @disabled={{true}} @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option) => assertListboxOption({}, option));
      assertActiveListboxOption(options[0]);
    });

    test('should not be possible to navigate up or down if there is only a single non-disabled option', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option) => assertListboxOption({}, option));
      assertActiveListboxOption(options[2]);

      // We should not be able to go up (because those are disabled)
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');
      assertActiveListboxOption(options[2]);

      // We should not be able to go down (because this is the last option)
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowDown');
      assertActiveListboxOption(options[2]);
    });

    test('should be possible to use ArrowUp to navigate the listbox options', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-options-1' },
      });
      await assertActiveElement(getListbox());
      assertListboxButtonLinkedWithListbox();

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option) => assertListboxOption({}, option));
      assertActiveListboxOption(options[2]);

      // We should be able to go down once
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');
      assertActiveListboxOption(options[1]);

      // We should be able to go down again
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');
      assertActiveListboxOption(options[0]);

      // We should NOT be able to go up again (because first option). Current implementation won't go around.
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');
      assertActiveListboxOption(options[0]);
    });
  });

  module('Listbox `ArrowLeft` key', () => {
    test('should be possible to use ArrowLeft to navigate the listbox options', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-options-1' },
        orientation: 'horizontal',
      });
      await assertActiveElement(getListbox());
      assertListboxButtonLinkedWithListbox();

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option) => assertListboxOption({}, option));
      assertActiveListboxOption(options[2]);

      // We should be able to go left once
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowLeft');
      assertActiveListboxOption(options[1]);

      // We should be able to go left again
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowLeft');
      assertActiveListboxOption(options[0]);

      // We should NOT be able to go left again (because first option). Current implementation won't go around.
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowLeft');
      assertActiveListboxOption(options[0]);
    });
  });

  module('Listbox `End` key', () => {
    test('should be possible to use the End key to go to the last listbox option', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      let options = getListboxOptions();

      // We should be on the first option
      assertActiveListboxOption(options[0]);

      // We should be able to go to the last option
      await triggerKeyEvent(document.activeElement, 'keyup', 'End');
      assertActiveListboxOption(options[2]);
    });

    test('should be possible to use the End key to go to the last non disabled listbox option', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @disabled={{true}} @value="c">
               Option C
             </options.Option>
             <options.Option @disabled={{true}} @value="d">
               Option D
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      let options = getListboxOptions();

      // We should be on the first option
      assertActiveListboxOption(options[0]);

      // We should be able to go to the last non-disabled option
      await triggerKeyEvent(document.activeElement, 'keyup', 'End');
      assertActiveListboxOption(options[1]);
    });

    test('should be possible to use the End key to go to the first listbox option if that is the only non-disabled listbox option', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @disabled={{true}} @value="c">
               Option C
             </options.Option>
             <options.Option @disabled={{true}} @value="d">
               Option D
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());

      // We opened via click, we don't have an active option
      assertNoActiveListboxOption();

      // We should not be able to go to the end
      await triggerKeyEvent(document.activeElement, 'keyup', 'End');

      let options = getListboxOptions();
      assertActiveListboxOption(options[0]);
    });

    test('should have no active listbox option upon End key press, when there are no non-disabled listbox options', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @disabled={{true}} @value="c">
               Option C
             </options.Option>
             <options.Option @disabled={{true}} @value="d">
               Option D
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());

      // We opened via click, we don't have an active option
      assertNoActiveListboxOption();

      // We should not be able to go to the end
      await triggerKeyEvent(document.activeElement, 'keyup', 'End');

      assertNoActiveListboxOption();
    });
  });

  module('Listbox `PageDown` key', () => {
    test('should be possible to use the PageDown key to go to the last listbox option', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      let options = getListboxOptions();

      // We should be on the first option
      assertActiveListboxOption(options[0]);

      // We should be able to go to the last option
      await triggerKeyEvent(document.activeElement, 'keyup', 'PageDown');
      assertActiveListboxOption(options[2]);
    });

    test('should be possible to use the PageDown key to go to the last non disabled listbox option', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @disabled={{true}} @value="c">
               Option C
             </options.Option>
             <options.Option @disabled={{true}} @value="d">
               Option D
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keypress', 'Enter');

      let options = getListboxOptions();

      // We should be on the first option
      assertActiveListboxOption(options[0]);

      // We should be able to go to the last non-disabled option
      await triggerKeyEvent(document.activeElement, 'keyup', 'PageDown');
      assertActiveListboxOption(options[1]);
    });

    test('should be possible to use the PageDown key to go to the first listbox option if that is the only non-disabled listbox option', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @disabled={{true}} @value="c">
               Option C
             </options.Option>
             <options.Option @disabled={{true}} @value="d">
               Option D
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());

      // We opened via click, we don't have an active option
      assertNoActiveListboxOption();

      // We should not be able to go to the end
      await triggerKeyEvent(document.activeElement, 'keyup', 'PageDown');

      let options = getListboxOptions();
      assertActiveListboxOption(options[0]);
    });

    test('should have no active listbox option upon PageDown key press, when there are no non-disabled listbox options', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @disabled={{true}} @value="c">
               Option C
             </options.Option>
             <options.Option @disabled={{true}} @value="d">
               Option D
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());

      // We opened via click, we don't have an active option
      assertNoActiveListboxOption();

      // We should not be able to go to the end
      await triggerKeyEvent(document.activeElement, 'keyup', 'PageDown');

      assertNoActiveListboxOption();
    });
  });

  module('Listbox `Home` key', () => {
    test('should be possible to use the Home key to go to the first listbox option', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');

      let options = getListboxOptions();

      // We should be on the last option
      assertActiveListboxOption(options[2]);

      // We should be able to go to the first option
      await triggerKeyEvent(document.activeElement, 'keyup', 'Home');
      assertActiveListboxOption(options[0]);
    });

    test('should be possible to use the Home key to go to the first non disabled listbox option', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
             <options.Option @value="d">
               Option D
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());

      // We opened via click, we don't have an active option
      assertNoActiveListboxOption();

      // We should not be able to go to the end
      await triggerKeyEvent(document.activeElement, 'keyup', 'Home');

      let options = getListboxOptions();

      // We should be on the first non-disabled option
      assertActiveListboxOption(options[2]);
    });

    test('should be possible to use the Home key to go to the last listbox option if that is the only non-disabled listbox option', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @disabled={{true}} @value="c">
               Option C
             </options.Option>
             <options.Option @value="d">
               Option D
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());

      // We opened via click, we don't have an active option
      assertNoActiveListboxOption();

      // We should not be able to go to the end
      await triggerKeyEvent(document.activeElement, 'keyup', 'Home');

      let options = getListboxOptions();
      assertActiveListboxOption(options[3]);
    });

    test('should have no active listbox option upon Home key press, when there are no non-disabled listbox options', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @disabled={{true}} @value="c">
               Option C
             </options.Option>
             <options.Option @disabled={{true}} @value="d">
               Option D
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());

      // We opened via click, we don't have an active option
      assertNoActiveListboxOption();

      // We should not be able to go to the end
      await triggerKeyEvent(document.activeElement, 'keyup', 'Home');

      assertNoActiveListboxOption();
    });
  });

  module('Listbox `PageUp` key', () => {
    test('should be possible to use the PageUp key to go to the first listbox option', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">
               Option A
             </options.Option>
             <options.Option @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');

      let options = getListboxOptions();

      // We should be on the last option
      assertActiveListboxOption(options[2]);

      // We should be able to go to the first option
      await triggerKeyEvent(document.activeElement, 'keyup', 'PageUp');
      assertActiveListboxOption(options[0]);
    });

    test('should be possible to use the PageUp key to go to the first non disabled listbox option', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @value="c">
               Option C
             </options.Option>
             <options.Option @value="d">
               Option D
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());

      // We opened via click, we don't have an active option
      assertNoActiveListboxOption();

      // We should not be able to go to the end
      await triggerKeyEvent(document.activeElement, 'keyup', 'PageUp');

      let options = getListboxOptions();

      // We should be on the first non-disabled option
      assertActiveListboxOption(options[2]);
    });

    test('should be possible to use the PageUp key to go to the last listbox option if that is the only non-disabled listbox option', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @disabled={{true}} @value="c">
               Option C
             </options.Option>
             <options.Option @value="d">
               Option D
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());

      // We opened via click, we don't have an active option
      assertNoActiveListboxOption();

      // We should not be able to go to the end
      await triggerKeyEvent(document.activeElement, 'keyup', 'PageUp');

      let options = getListboxOptions();
      assertActiveListboxOption(options[3]);
    });

    test('should have no active listbox option upon PageUp key press, when there are no non-disabled listbox options', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @disabled={{true}} @value="a">
               Option A
             </options.Option>
             <options.Option @disabled={{true}} @value="b">
               Option B
             </options.Option>
             <options.Option @disabled={{true}} @value="c">
               Option C
             </options.Option>
             <options.Option @disabled={{true}} @value="d">
               Option D
             </options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());

      // We opened via click, we don't have an active option
      assertNoActiveListboxOption();

      // We should not be able to go to the end
      await triggerKeyEvent(document.activeElement, 'keyup', 'PageUp');

      assertNoActiveListboxOption();
    });
  });

  module('Listbox `Any` key aka search', () => {
    test('should be possible to type a full word that has a perfect match', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="alice">alice</options.Option>
             <options.Option @value="bob">bob</options.Option>
             <options.Option @value="charlie">charlie</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());

      let options = getListboxOptions();

      // We should be able to go to the second option
      await typeWord('bob');
      assertActiveListboxOption(options[1]);

      // We should be able to go to the first option
      await typeWord('alice');
      assertActiveListboxOption(options[0]);

      // We should be able to go to the last option
      await typeWord('charlie');
      assertActiveListboxOption(options[2]);
    });

    test('should be possible to type a partial of a word', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="alice">alice</options.Option>
             <options.Option @value="bob">bob</options.Option>
             <options.Option @value="charlie">charlie</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');

      let options = getListboxOptions();

      // We should be on the last option
      assertActiveListboxOption(options[2]);

      // We should be able to go to the second option
      await typeWord('bo');
      assertActiveListboxOption(options[1]);

      // We should be able to go to the first option
      await typeWord('ali');
      assertActiveListboxOption(options[0]);

      // We should be able to go to the last option
      await typeWord('char');
      assertActiveListboxOption(options[2]);
    });

    test('should be possible to type words with spaces', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">value a</options.Option>
             <options.Option @value="b">value b</options.Option>
             <options.Option @value="c">value c</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');

      let options = getListboxOptions();

      // We should be on the last option
      assertActiveListboxOption(options[2]);

      // We should be able to go to the second option
      await typeWord('value b');
      assertActiveListboxOption(options[1]);

      // We should be able to go to the first option
      await typeWord('value a');
      assertActiveListboxOption(options[0]);

      // We should be able to go to the last option
      await typeWord('value c');
      assertActiveListboxOption(options[2]);
    });

    test('should not be possible to search for a disabled option', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="alice">alice</options.Option>
             <options.Option @disabled={{true}} @value="bob">bob</options.Option>
             <options.Option @value="charlie">charlie</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');

      let options = getListboxOptions();

      // We should be on the last option
      assertActiveListboxOption(options[2]);

      // We should not be able to go to the disabled option
      await typeWord('bo');

      // We should still be on the last option
      assertActiveListboxOption(options[2]);
    });

    test('should be possible to search for a word (case insensitive)', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="alice">alice</options.Option>
             <options.Option @value="bob">bob</options.Option>
             <options.Option @value="charlie">charlie</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Focus the button
      getListboxButton()?.focus();

      // Open listbox
      await triggerKeyEvent(document.activeElement, 'keyup', 'ArrowUp');

      let options = getListboxOptions();

      // We should be on the last option
      assertActiveListboxOption(options[2]);

      // Search for bob in a different casing
      await typeWord('BO');

      // We should be on `bob`
      assertActiveListboxOption(options[1]);
    });
  });

  module('listbox mouse interactions', () => {
    test('should focus the Listbox.Button when we click the Listbox.Label', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Label>Label</listbox.Label>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="alice">alice</options.Option>
             <options.Option @value="bob">bob</options.Option>
             <options.Option @value="charlie">charlie</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Ensure the button is not focused yet
      await assertActiveElement(document.body);

      // Focus the label
      await click(getListboxLabel());

      // Ensure that the actual button is focused instead
      await assertActiveElement(getListboxButton());
    });

    test('should not focus the Listbox.Button when we right click the Listbox.Label', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Label>Label</listbox.Label>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="alice">alice</options.Option>
             <options.Option @value="bob">bob</options.Option>
             <options.Option @value="charlie">charlie</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Ensure the button is not focused yet
      await assertActiveElement(document.body);

      // Focus the label
      await click(getListboxLabel(), { button: 2 });

      // Ensure that the body is still active
      await assertActiveElement(document.body);
    });

    test('should be possible to open the listbox on click', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="alice">alice</options.Option>
             <options.Option @value="bob">bob</options.Option>
             <options.Option @value="charlie">charlie</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Open listbox
      await click(getListboxButton());

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-options-1' },
      });
      await assertActiveElement(getListbox());
      assertListboxButtonLinkedWithListbox();

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option) => assertListboxOption({}, option));
    });

    test('should not be possible to open the listbox on right click', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="alice">alice</options.Option>
             <options.Option @value="bob">bob</options.Option>
             <options.Option @value="charlie">charlie</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Try to open the listbox
      await click(getListboxButton(), { button: 2 });

      // Verify it is still closed
      assertListboxButton({ state: ListboxState.InvisibleUnmounted });
    });

    test('should not be possible to open the listbox on click when the button is disabled', async function () {
      await render(hbs`
        <Listbox @disabled={{true}} as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="alice">alice</options.Option>
             <options.Option @value="bob">bob</options.Option>
             <options.Option @value="charlie">charlie</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Try to open the listbox
      try {
        await click(getListboxButton());
      } catch (e) {
        //
      }

      // Verify it is still closed
      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });
    });

    test('should be possible to open the listbox on click, and focus the selected option', async function (assert) {
      await render(hbs`
        <Listbox @value="b" as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">a</options.Option>
             <options.Option @value="b">b</options.Option>
             <options.Option @value="c">c</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      assertListboxButton({
        state: ListboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-listbox-button-1' },
      });
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Open listbox
      await click(getListboxButton());

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });
      assertListbox({
        state: ListboxState.Visible,
        attributes: { 'data-test': 'headlessui-listbox-options-1' },
      });
      await assertActiveElement(getListbox());
      assertListboxButtonLinkedWithListbox();

      // Verify we have listbox options
      let options = getListboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option, i) =>
        assertListboxOption({ selected: i === 1 }, option)
      );

      // Verify that the second listbox option is active (because it is already selected)
      assertActiveListboxOption(options[1]);
    });

    test('should be possible to close a listbox on click', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">a</options.Option>
             <options.Option @value="b">b</options.Option>
             <options.Option @value="c">c</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());

      // Verify it is visible
      assertListboxButton({ state: ListboxState.Visible });

      // Click to close
      await click(getListboxButton());

      // Verify it is closed
      assertListboxButton({ state: ListboxState.InvisibleUnmounted });
      assertListbox({ state: ListboxState.InvisibleUnmounted });
    });

    test('should be a no-op when we click outside of a closed listbox', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">a</options.Option>
             <options.Option @value="b">b</options.Option>
             <options.Option @value="c">c</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Verify that the window is closed
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Click something that is not related to the listbox
      await click(document.body);

      // Should still be closed
      assertListbox({ state: ListboxState.InvisibleUnmounted });
    });

    test('should be possible to click outside of the listbox which should close the listbox', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">a</options.Option>
             <options.Option @value="b">b</options.Option>
             <options.Option @value="c">c</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());
      assertListbox({ state: ListboxState.Visible });
      await assertActiveElement(getListbox());

      // Click something that is not related to the listbox
      await click(document.body);

      // Should be closed now
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Verify the button is focused again
      await assertActiveElement(getListboxButton());
    });

    test('should be possible to click outside of the listbox on another listbox button which should close the current listbox and open the new listbox', async function (assert) {
      await render(hbs`
        <div>
          <Listbox as |listbox|>
             <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
             <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
               <options.Option @value="a">a</options.Option>
               <options.Option @value="b">b</options.Option>
               <options.Option @value="c">c</options.Option>
             </listbox.Options>
           </Listbox>
           <Listbox as |listbox|>
             <listbox.Button data-test="headlessui-listbox-button-2">Trigger</listbox.Button>
             <listbox.Options data-test="headlessui-listbox-options-2" as |options|>
               <options.Option @value="a">a</options.Option>
               <options.Option @value="b">b</options.Option>
               <options.Option @value="c">c</options.Option>
             </listbox.Options>
           </Listbox>
         </div>
      `);

      let [button1, button2] = getListboxButtons();

      // Click the first listbox button
      await click(button1);
      assert.strictEqual(getListboxes().length, 1); // Only 1 listbox should be visible

      // Ensure the open listbox is linked to the first button
      assertListboxButtonLinkedWithListbox(button1, getListbox());

      // Click the second listbox button
      await click(button2);

      assert.strictEqual(getListboxes().length, 1); // Only 1 listbox should be visible

      // Ensure the open listbox is linked to the second button
      assertListboxButtonLinkedWithListbox(button2, getListbox());
    });

    test('should be possible to click outside of the listbox which should close the listbox (even if we press the listbox button)', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="a">a</options.Option>
             <options.Option @value="b">b</options.Option>
             <options.Option @value="c">c</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());
      assertListbox({ state: ListboxState.Visible });
      await assertActiveElement(getListbox());

      // Click the listbox button again
      await click(getListboxButton());

      // Should be closed now
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Verify the button is focused again
      await assertActiveElement(getListboxButton());
    });

    skip('should be possible to click outside of the listbox, on an element which is within a focusable element, which closes the listbox', async function (assert) {
      let callCount = 0;

      this.set('handleFocus', () => {
        callCount++;
      });

      await render(hbs`
        <div>
          <Listbox as |listbox|>
             <listbox.Button onFocus={{this.handleFocus}} data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
             <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
               <options.Option @value="a">a</options.Option>
               <options.Option @value="b">b</options.Option>
               <options.Option @value="c">c</options.Option>
             </listbox.Options>
           </Listbox>
           <button id="btn">
             <span>Next</span>
           </button>
         </div>
      `);

      // Click the listbox button
      await click(getListboxButton());

      // Ensure the listbox is open
      assertListbox({ state: ListboxState.Visible });

      // Click the span inside the button
      await click(document.querySelector('#btn span'));

      // Ensure the listbox is closed
      assertListbox({ state: ListboxState.InvisibleUnmounted });

      // Ensure the outside button is focused
      await assertActiveElement(document.getElementById('btn'));

      // Ensure that the focus button only got focus once (first click)
      assert.strictEqual(callCount, 1, 'handleFocus called once exactly');
    });

    test('should be possible to hover an option and make it active', async function () {
      await render(hbs`
        <div>
          <Listbox as |listbox|>
             <listbox.Button onFocus={{this.handleFocus}} data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
             <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
               <options.Option @value="a">a</options.Option>
               <options.Option @value="b">b</options.Option>
               <options.Option @value="c">c</options.Option>
             </listbox.Options>
           </Listbox>
           <button id="btn">
             <span>Next</span>
           </button>
         </div>
      `);

      // Open listbox
      await click(getListboxButton());

      let options = getListboxOptions();
      // We should be able to go to the second option
      await triggerEvent(options[1], 'mouseover');
      assertActiveListboxOption(options[1]);

      // We should be able to go to the first option
      await triggerEvent(options[0], 'mouseover');
      assertActiveListboxOption(options[0]);

      // We should be able to go to the last option
      await triggerEvent(options[2], 'mouseover');
      assertActiveListboxOption(options[2]);
    });

    test('should make a listbox option active when you move the mouse over it', async function () {
      await render(hbs`
        <div>
          <Listbox as |listbox|>
             <listbox.Button onFocus={{this.handleFocus}} data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
             <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
               <options.Option @value="a">a</options.Option>
               <options.Option @value="b">b</options.Option>
               <options.Option @value="c">c</options.Option>
             </listbox.Options>
           </Listbox>
           <button id="btn">
             <span>Next</span>
           </button>
         </div>
      `);

      // Open listbox
      await click(getListboxButton());

      let options = getListboxOptions();
      // We should be able to go to the second option
      await triggerEvent(options[1], 'mouseover');
      assertActiveListboxOption(options[1]);
    });

    test('should be a no-op when we move the mouse and the listbox option is already active', async function () {
      await render(hbs`
        <div>
          <Listbox as |listbox|>
             <listbox.Button onFocus={{this.handleFocus}} data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
             <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
               <options.Option @value="a">a</options.Option>
               <options.Option @value="b">b</options.Option>
               <options.Option @value="c">c</options.Option>
             </listbox.Options>
           </Listbox>
           <button id="btn">
             <span>Next</span>
           </button>
         </div>
      `);

      // Open listbox
      await click(getListboxButton());

      let options = getListboxOptions();

      // We should be able to go to the second option
      await triggerEvent(options[1], 'mouseover');
      assertActiveListboxOption(options[1]);

      await triggerEvent(options[1], 'mouseover');

      // Nothing should be changed
      assertActiveListboxOption(options[1]);
    });

    test('should be a no-op when we move the mouse and the listbox option is disabled', async function () {
      await render(hbs`
        <div>
          <Listbox as |listbox|>
             <listbox.Button onFocus={{this.handleFocus}} data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
             <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
               <options.Option @value="a">a</options.Option>
               <options.Option @disabled={{true}} @value="b">b</options.Option>
               <options.Option @value="c">c</options.Option>
             </listbox.Options>
           </Listbox>
           <button id="btn">
             <span>Next</span>
           </button>
         </div>
      `);

      // Open listbox
      await click(getListboxButton());

      let options = getListboxOptions();

      await triggerEvent(options[1], 'mouseover');
      assertNoActiveListboxOption();
    });

    test('should not be possible to hover an option that is disabled', async function () {
      await render(hbs`
        <div>
          <Listbox as |listbox|>
             <listbox.Button onFocus={{this.handleFocus}} data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
             <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
               <options.Option @value="a">a</options.Option>
               <options.Option @disabled={{true}} @value="b">b</options.Option>
               <options.Option @value="c">c</options.Option>
             </listbox.Options>
           </Listbox>
           <button id="btn">
             <span>Next</span>
           </button>
         </div>
      `);

      // Open listbox
      await click(getListboxButton());

      let options = getListboxOptions();

      // Try to hover over option 1, which is disabled
      await triggerEvent(options[1], 'mouseover');

      // We should not have an active option now
      assertNoActiveListboxOption();
    });

    test('should be possible to mouse leave an option and make it inactive', async function () {
      await render(hbs`
        <div>
          <Listbox as |listbox|>
             <listbox.Button onFocus={{this.handleFocus}} data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
             <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
               <options.Option @value="a">a</options.Option>
               <options.Option @value="b">b</options.Option>
               <options.Option @value="c">c</options.Option>
             </listbox.Options>
           </Listbox>
           <button id="btn">
             <span>Next</span>
           </button>
         </div>
      `);

      // Open listbox
      await click(getListboxButton());

      let options = getListboxOptions();

      // We should be able to go to the second option
      await triggerEvent(options[1], 'mouseover');
      assertActiveListboxOption(options[1]);

      await triggerEvent(options[1], 'mouseout');
      assertNoActiveListboxOption();

      // We should be able to go to the first option
      await triggerEvent(options[0], 'mouseover');
      assertActiveListboxOption(options[0]);

      await triggerEvent(options[0], 'mouseout');
      assertNoActiveListboxOption();

      // We should be able to go to the last option
      await triggerEvent(options[2], 'mouseover');
      assertActiveListboxOption(options[2]);

      await triggerEvent(options[2], 'mouseout');
      assertNoActiveListboxOption();
    });

    test('should be possible to mouse leave a disabled option and be a no-op', async function () {
      await render(hbs`
        <div>
          <Listbox as |listbox|>
             <listbox.Button onFocus={{this.handleFocus}} data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
             <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
               <options.Option @value="a">a</options.Option>
               <options.Option @disabled={{true}} @value="b">b</options.Option>
               <options.Option @value="c">c</options.Option>
             </listbox.Options>
           </Listbox>
           <button id="btn">
             <span>Next</span>
           </button>
         </div>
      `);

      // Open listbox
      await click(getListboxButton());

      let options = getListboxOptions();

      // Try to hover over option 1, which is disabled
      await triggerEvent(options[1], 'mouseover');
      assertNoActiveListboxOption();

      await triggerEvent(options[1], 'mouseout');
      assertNoActiveListboxOption();
    });

    test('should be possible to click a listbox option, which closes the listbox', async function (assert) {
      let callValue = '',
        callCount = 0;

      this.set('onChange', (value) => {
        this.set('selectedOption', value);
        callValue = value;
        callCount++;
      });

      await render(hbs`
        <Listbox @onChange={{this.onChange}} @value={{this.selectedOption}} as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="alice">alice</options.Option>
             <options.Option @value="bob">bob</options.Option>
             <options.Option @value="charlie">charlie</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());
      assertListbox({ state: ListboxState.Visible });
      await assertActiveElement(getListbox());

      let options = getListboxOptions();

      // We should be able to click the first option
      await click(options[1]);
      assertListbox({ state: ListboxState.InvisibleUnmounted });
      assert.strictEqual(callCount, 1, 'handleChange called once exactly');
      assert.strictEqual(callValue, 'bob', 'handleChange called with "bob"');

      // Verify the button is focused again
      await assertActiveElement(getListboxButton());

      // Open listbox again
      await click(getListboxButton());

      // Verify the active option is the previously selected one
      assertActiveListboxOption(getListboxOptions()[1]);
    });

    test('should be possible to click a disabled listbox option, which is a no-op', async function (assert) {
      let callCount = 0;

      this.set('onChange', (value) => {
        this.set('selectedOption', value);
        callCount++;
      });

      await render(hbs`
        <Listbox @onChange={{this.onChange}} @value={{this.selectedOption}} as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="alice">alice</options.Option>
             <options.Option @disabled={{true}} @value="bob">bob</options.Option>
             <options.Option @value="charlie">charlie</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());
      assertListbox({ state: ListboxState.Visible });
      await assertActiveElement(getListbox());

      let options = getListboxOptions();

      // We should be able to click the first option
      await click(options[1]);
      assertListbox({ state: ListboxState.Visible });
      await assertActiveElement(getListbox());
      assert.strictEqual(callCount, 0, 'handleChange not called');

      // Close the listbox
      await click(getListboxButton());

      // Open listbox again
      await click(getListboxButton());

      // Verify the active option is non existing
      assertNoActiveListboxOption();
    });

    test('should be possible focus a listbox option, so that it becomes active', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="alice">alice</options.Option>
             <options.Option @value="bob">bob</options.Option>
             <options.Option @value="charlie">charlie</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());
      assertListbox({ state: ListboxState.Visible });
      await assertActiveElement(getListbox());

      let options = getListboxOptions();

      // Verify that nothing is active yet
      assertNoActiveListboxOption();

      // We should be able to focus the first option
      await focus(options[1]);
      assertActiveListboxOption(options[1]);
    });

    test('should not be possible to focus a listbox option which is disabled', async function () {
      await render(hbs`
        <Listbox as |listbox|>
           <listbox.Button data-test="headlessui-listbox-button-1">Trigger</listbox.Button>
           <listbox.Options data-test="headlessui-listbox-options-1" as |options|>
             <options.Option @value="alice">alice</options.Option>
             <options.Option @disabled={{true}} @value="bob">bob</options.Option>
             <options.Option @value="charlie">charlie</options.Option>
           </listbox.Options>
         </Listbox>
      `);

      // Open listbox
      await click(getListboxButton());
      assertListbox({ state: ListboxState.Visible });
      await assertActiveElement(getListbox());

      let options = getListboxOptions();

      // We should not be able to focus the first option
      await focus(options[1]);
      assertNoActiveListboxOption();
    });
  });

  test('should be possible to open a listbox without submitting the form', async function (assert) {
    let callCount = 0;

    this.set('onSubmit', () => {
      callCount++;
    });

    await render(hbs`
      <form {{on 'submit' this.onSubmit}}>
        <Listbox as |listbox|>
          <listbox.Button>Trigger</listbox.Button>
          <listbox.Options as |options|>
            <options.Option>option</options.Option>
          </listbox.Options>
        </Listbox>
      </form>
    `);
    assertListboxButton({
      state: ListboxState.InvisibleUnmounted,
    });
    assertListbox({
      state: ListboxState.InvisibleUnmounted,
    });
    await click(getListboxButton());
    assertListbox({ state: ListboxState.Visible });

    assert.strictEqual(callCount, 0, 'onSubmit not called');
  });
});
