import Component from '@glimmer/component';
import {
  click,
  focus,
  render,
  triggerEvent,
  triggerKeyEvent,
  typeIn,
} from '@ember/test-helpers';
// import typeIn from '@ember/test-helpers/dom/type-in';
import { hbs } from 'ember-cli-htmlbars';
import { module, skip, test, todo } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { Keys } from 'ember-headlessui/utils/keyboard';

import {
  assertActiveComboboxOption,
  assertActiveElement,
  assertCombobox,
  assertComboboxButton,
  assertComboboxButtonLinkedWithCombobox,
  assertComboboxButtonLinkedWithComboboxLabel,
  assertComboboxLabel,
  assertComboboxLabelLinkedWithCombobox,
  assertComboboxList,
  assertComboboxOption,
  assertNoActiveComboboxOption,
  assertNoSelectedComboboxOption,
  assertNotActiveComboboxOption,
  ComboboxMode,
  ComboboxState,
  getComboboxButton,
  getComboboxButtons,
  getComboboxes,
  getComboboxInput,
  getComboboxInputs,
  getComboboxLabel,
  getComboboxOptions,
} from '../../accessibility-assertions';

module('Integration | Component | <Combobox>', function (hooks) {
  setupRenderingTest(hooks);

  let renderWithPeople = async function (test, people, customHbs) {
    test.set('query', '');
    test.set('displayValue', (value) => {
      return value?.name;
    });
    test.set('setQuery', (event) => {
      test.set('query', event.target.value);
      test.set(
        'filteredPeople',
        test.get('query') === ''
          ? people
          : people.filter((person) =>
              person.name
                .toLowerCase()
                .includes(test.get('query').toLowerCase())
            )
      );
    });
    test.get('setQuery')({ target: { value: '' } });
    test.set('value', people.filter((person) => person.selected)[0]);

    if (customHbs) {
      await render(customHbs);
    } else {
      await render(hbs`
        <Combobox 
          @value={{this.value}}
          as |combobox|
        >
          <combobox.Input @onChange={{this.setQuery}} @displayValue={{this.displayValue}}/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            {{#each this.filteredPeople as |person|}}
              <options.Option 
                @value={{person.value}} 
                @disabled={{person.disabled}}
              >
                {{person.name}}
              </options.Option>
            {{/each}}
          </combobox.Options>
        </Combobox>
      `);
    }
  };

  module('safeguards', () => {
    todo(
      'should error when we are using a <%s /> without a parent <Combobox />',
      () => {}
    );

    test('should be possible to render a Combobox without crashing', async function () {
      await render(hbs`
        <Combobox @value="test" as |combobox|>
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options as |options|>
            <options.Option @value="a">Option A</options.Option>
            <options.Option @value="b">Option B</options.Option>
            <options.Option @value="c">Option C</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      assertComboboxButton({
        state: ComboboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-combobox-button-2' },
      });
      assertComboboxList({ state: ComboboxState.InvisibleUnmounted });
    });
  });

  module('rendering', () => {
    module('Combobox', () => {
      test('should be possible to render a Combobox using a "isOpen" property', async function () {
        await render(hbs`
          <Combobox as |combobox|>
            <combobox.Input/>
            <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
            {{#if combobox.isOpen}}
              <combobox.Options as |options|>
                <options.Option>option</options.Option>
              </combobox.Options>
            {{/if}}
          </Combobox>
        `);
        assertComboboxButton({
          state: ComboboxState.InvisibleUnmounted,
          attributes: { 'data-test': 'headlessui-combobox-button-2' },
        });
        assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

        console.log('click');
        await click(getComboboxButton());

        assertComboboxButton({
          state: ComboboxState.Visible,
          attributes: { 'data-test': 'headlessui-combobox-button-2' },
        });
        assertComboboxList({ state: ComboboxState.Visible });
      });

      test('should be possible to disable a Combobox', async function () {
        await render(hbs`
          <Combobox @disabled={{true}} as |combobox|>
            <combobox.Input/>
            <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
            <combobox.Options as |options|>
              <options.Option>option</options.Option>
            </combobox.Options>
          </Combobox>
        `);

        assertComboboxButton({
          state: ComboboxState.InvisibleUnmounted,
          attributes: { 'data-test': 'headlessui-combobox-button-2' },
        });
        assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

        await triggerKeyEvent(document.activeElement, 'keypress', Keys.Enter);

        assertComboboxButton({
          state: ComboboxState.InvisibleUnmounted,
          attributes: { 'data-test': 'headlessui-combobox-button-2' },
        });
        assertComboboxList({ state: ComboboxState.InvisibleUnmounted });
      });
    });

    module('Combobox.Input', () => {
      test('selecting an option puts the value into Combobox.Input when displayValue is not provided', async function (assert) {
        this.set('onChange', (value) => {
          this.set('value', value);
        });

        await render(hbs`
          <Combobox 
            @value={{this.value}} 
            @onChange={{this.setValue}} 
            as |combobox|
          >
            <combobox.Input/>
            <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
            <combobox.Options as |options|>
              <options.Option @value="a">Option A</options.Option>
              <options.Option @value="b">Option B</options.Option>
              <options.Option @value="c">Option C</options.Option>
            </combobox.Options>
          </Combobox>
        `);

        await click(getComboboxButton());

        assertComboboxList({ state: ComboboxState.Visible });

        await click(getComboboxOptions()[1]);

        assert.dom(getComboboxInput()).hasValue('b');
      });

      test('selecting an option puts the display value into Combobox.Input when displayValue is provided', async function (assert) {
        this.set('onChange', (value) => {
          this.set('value', value);
        });

        this.set('displayValue', (value) => {
          return value?.toUpperCase();
        });

        await render(hbs`
          <Combobox 
            @value={{this.value}} 
            @onChange={{this.setValue}} 
            as |combobox|
          >
            <combobox.Input @displayValue={{this.displayValue}}/>
            <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
            <combobox.Options as |options|>
              <options.Option @value="a">Option A</options.Option>
              <options.Option @value="b">Option B</options.Option>
              <options.Option @value="c">Option C</options.Option>
            </combobox.Options>
          </Combobox>
        `);

        await click(getComboboxButton());

        assertComboboxList({ state: ComboboxState.Visible });

        await click(getComboboxOptions()[1]);

        assert.dom(getComboboxInput()).hasValue('B');
      });
    });

    module('Combobox.Label', () => {
      test('should be possible to render a Combobox.Label using a yielded prop', async () => {
        await render(hbs`
          <Combobox 
            as |combobox|
          >
            <combobox.Label data-test="headlessui-combobox-label-2">{{combobox.isOpen}} {{combobox.isDisabled}}</combobox.Label/>
            <combobox.Input/>
            <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
            <combobox.Options as |options|>
              <options.Option @value="a">Option A</options.Option>
              <options.Option @value="b">Option B</options.Option>
              <options.Option @value="c">Option C</options.Option>
            </combobox.Options>
          </Combobox>
        `);

        assertComboboxButton({
          state: ComboboxState.InvisibleUnmounted,
          attributes: { 'data-test': 'headlessui-combobox-button-2' },
        });
        assertComboboxLabel({
          attributes: { 'data-test': 'headlessui-combobox-label-2' },
          textContent: 'false false',
        });
        assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

        await click(getComboboxButton());

        assertComboboxLabel({
          attributes: { 'data-test': 'headlessui-combobox-label-2' },
          textContent: 'true false',
        });
        assertComboboxList({ state: ComboboxState.Visible });
        assertComboboxLabelLinkedWithCombobox();
        assertComboboxButtonLinkedWithComboboxLabel();
      });

      test('should be possible to render a Combobox.Label using yielded props and an `as` prop', async () => {
        await render(hbs`
          <Combobox 
            as |combobox|
          >
            <combobox.Label @as="p" data-test="headlessui-combobox-label-2">{{combobox.isOpen}} {{combobox.isDisabled}}</combobox.Label/>
            <combobox.Input/>
            <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
            <combobox.Options as |options|>
              <options.Option @value="a">Option A</options.Option>
              <options.Option @value="b">Option B</options.Option>
              <options.Option @value="c">Option C</options.Option>
            </combobox.Options>
          </Combobox>
        `);

        assertComboboxButton({
          state: ComboboxState.InvisibleUnmounted,
          attributes: { 'data-test': 'headlessui-combobox-button-2' },
        });
        assertComboboxLabel({
          attributes: { 'data-test': 'headlessui-combobox-label-2' },
          textContent: 'false false',
          tag: 'p',
        });
        assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

        await click(getComboboxButton());

        assertComboboxLabel({
          attributes: { 'data-test': 'headlessui-combobox-label-2' },
          textContent: 'true false',
          tag: 'p',
        });
        assertComboboxList({ state: ComboboxState.Visible });
        assertComboboxLabelLinkedWithCombobox();
        assertComboboxButtonLinkedWithComboboxLabel();
      });
    });

    module('Combobox.Button', () => {
      test('should be possible to render a Combobox.Button using yielded props', async () => {
        await render(hbs`
          <Combobox 
            as |combobox|
          >
            <combobox.Input/>
            <combobox.Button data-test="headlessui-combobox-button-2">{{combobox.isOpen}} {{combobox.isDisabled}}</combobox.Button>
            <combobox.Options as |options|>
              <options.Option @value="a">Option A</options.Option>
              <options.Option @value="b">Option B</options.Option>
              <options.Option @value="c">Option C</options.Option>
            </combobox.Options>
          </Combobox>
        `);

        assertComboboxButton({
          state: ComboboxState.InvisibleUnmounted,
          attributes: { 'data-test': 'headlessui-combobox-button-2' },
          textContent: 'false false',
        });
        assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

        await click(getComboboxButton());

        assertComboboxList({ state: ComboboxState.Visible });
      });

      test('should be possible to render a Combobox.Button using yielded prop and an `as` prop', async () => {
        await render(hbs`
          <Combobox 
            as |combobox|
          >
            <combobox.Input/>
            <combobox.Button @as="div" role="button" data-test="headlessui-combobox-button-2">{{combobox.isOpen}} {{combobox.isDisabled}}</combobox.Button>
            <combobox.Options as |options|>
              <options.Option @value="a">Option A</options.Option>
              <options.Option @value="b">Option B</options.Option>
              <options.Option @value="c">Option C</options.Option>
            </combobox.Options>
          </Combobox>
        `);

        assertComboboxButton({
          state: ComboboxState.InvisibleUnmounted,
          attributes: { 'data-test': 'headlessui-combobox-button-2' },
          textContent: 'false false',
        });
        assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

        await click(getComboboxButton());

        assertComboboxButton({
          state: ComboboxState.Visible,
          attributes: { 'data-test': 'headlessui-combobox-button-2' },
          textContent: 'true false',
        });
        assertComboboxList({ state: ComboboxState.Visible });
      });

      test('should be possible to render a Combobox.Button and a Combobox.Label and see them linked together', async () => {
        await render(hbs`
          <Combobox 
            as |combobox|
          >
            <combobox.Label>Label</combobox.Label>
            <combobox.Input/>
            <combobox.Button data-test="headlessui-combobox-button-3">Trigger</combobox.Button>
            <combobox.Options as |options|>
              <options.Option @value="a">Option A</options.Option>
              <options.Option @value="b">Option B</options.Option>
              <options.Option @value="c">Option C</options.Option>
            </combobox.Options>
          </Combobox>
        `);

        assertComboboxButton({
          state: ComboboxState.InvisibleUnmounted,
          attributes: { 'data-test': 'headlessui-combobox-button-3' },
        });
        assertComboboxList({ state: ComboboxState.InvisibleUnmounted });
        assertComboboxButtonLinkedWithComboboxLabel();
      });

      module('type attribute', () => {
        test('should set the `type` to "button" by default', async function (assert) {
          await render(hbs`
            <Combobox 
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button>Trigger</combobox.Button>
            </Combobox>
          `);
          assert.dom(getComboboxButton()).hasAttribute('type', 'button');
        });

        test('should not set the `type` to "button" if it already contains a `type`', async function (assert) {
          await render(hbs`
            <Combobox 
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button type="submit">Trigger</combobox.Button>
            </Combobox>
          `);
          assert.dom(getComboboxButton()).hasAttribute('type', 'submit');
        });

        todo(
          'should set the `type` to "button" when using the `as` prop which resolves to a "button"',
          async () => {}
        );

        test('should not set the type if the "as" prop is not a "button"', async function (assert) {
          await render(hbs`
            <Combobox 
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button @as="div">Trigger</combobox.Button>
            </Combobox>
          `);
          assert.dom(getComboboxButton()).doesNotHaveAttribute('type');
        });

        todo(
          'should not set the `type` to "button" when using the `as` prop which resolves to a "div"',
          async () => {}
        );
      });
    });

    module('Combobox.Options', () => {
      test('should be possible to render Combobox.Options using yielded prop', async () => {
        await render(hbs`
          <Combobox 
            @value="test"
            as |combobox|
          >
            <combobox.Input/>
            <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
            <combobox.Options as |options|>
              <options.Option @value="a">{{combobox.isOpen}}</options.Option>
            </combobox.Options>
          </Combobox>
        `);

        assertComboboxButton({
          state: ComboboxState.InvisibleUnmounted,
          attributes: { 'data-test': 'headlessui-combobox-button-2' },
        });
        assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

        await click(getComboboxButton());

        assertComboboxButton({
          state: ComboboxState.Visible,
          attributes: { 'data-test': 'headlessui-combobox-button-2' },
        });
        assertComboboxList({
          state: ComboboxState.Visible,
          textContent: 'true',
        });
        await assertActiveElement(getComboboxInput());
      });

      test('should be possible to always render the Combobox.Options if we provide it a `static` prop', async function (assert) {
        await render(hbs`
          <Combobox 
            @value="test"
            as |combobox|
          >
            <combobox.Input/>
            <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
            <combobox.Options @static={{true}} as |options|>
              <options.Option @value="a">Option A</options.Option>
              <options.Option @value="b">Option B</options.Option>
              <options.Option @value="c">Option C</options.Option>
            </combobox.Options>
          </Combobox>
        `);

        assert.dom(getComboboxInput()).exists();
      });

      todo(
        'should be possible to use a different render strategy for the Combobox.Options',
        async () => {}
      );
    });

    module('Combobox.Option', () => {
      test('should be possible to render a <Combobox.Option> using yielded props', async function () {
        await render(hbs`
          <Combobox 
            @value="test"
            as |combobox|
          >
            <combobox.Input/>
            <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
            <combobox.Options as |options|>
              <options.Option @value="a" as |option|>{{option.active}} {{option.selected}} {{option.disabled}}</options.Option>
            </combobox.Options>
          </Combobox>
        `);

        assertComboboxButton({
          state: ComboboxState.InvisibleUnmounted,
          attributes: { 'data-test': 'headlessui-combobox-button-2' },
        });
        assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

        await click(getComboboxButton());

        assertComboboxButton({
          state: ComboboxState.Visible,
          attributes: { 'data-test': 'headlessui-combobox-button-2' },
        });
        assertComboboxList({
          state: ComboboxState.Visible,
          textContent: 'true false false',
        });
      });
    });

    test('should guarantee the order of DOM nodes when performing actions', async function () {
      this.set('hide', false);

      await render(hbs`
        <Combobox 
          @value="test"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options as |options|>
            <options.Option @value="a" as |option|>Option 1</options.Option>
            {{#if (not this.hide)}}
              <options.Option @value="b" as |option|>Option 2</options.Option>
            {{/if}}
            <options.Option @value="c" as |option|>Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      await click(getComboboxButton());

      this.set('hide', true);
      this.set('hide', false);

      assertComboboxList({ state: ComboboxState.Visible });

      let options = getComboboxOptions();

      // Verify that the first combobox option is active
      assertActiveComboboxOption(options[0]);

      await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowDown);

      // Verify that the second combobox option is active
      assertActiveComboboxOption(options[1]);

      await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowDown);

      // Verify that the third combobox option is active
      assertActiveComboboxOption(options[2]);
    });
  });

  module('rendering composition', () => {
    todo(
      'should be possible to conditionally render classNames (aka className can be a function?!)',
      () => {}
    );

    test('should be possible to swap the Combobox option with a button for example', async () => {
      await render(hbs`
        <Combobox 
          @value="test"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options as |options|>
            <options.Option @value="a" @as="button">Option 1</options.Option>
            <options.Option @value="b" @as="button">Option 2</options.Option>
            <options.Option @value="c" @as="button">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      assertComboboxButton({
        state: ComboboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-combobox-button-2' },
      });
      assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

      // Open Combobox
      await click(getComboboxButton());

      // Verify options are buttons now
      getComboboxOptions().forEach((option) =>
        assertComboboxOption({ tag: 'button' }, option)
      );
    });

    test('should mark all the elements between Combobox.Options and Combobox.Option with role none', async function (assert) {
      assert.expect(5);

      await render(hbs`
        <Combobox 
          @value="test"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <div class="outer">
            <combobox.Options as |options|>
              <div class="inner py-1">
                <options.Option @value="a" @as="button">Option 1</options.Option>
                <options.Option @value="b" @as="button">Option 2</options.Option>
              </div>
              <div class="inner py-1">
                <options.Option @value="c" @as="button">Option 3</options.Option>
                <options.Option @value="d" @as="button">
                  <div>
                    <div class="outer">Option D</div>
                  </div>
                </options.Option>
              </div>
              <div class="inner py-1">
                <options.Option @value="e" @as="button">Option 5</options.Option>
              </div>
            </combobox.Options>
          </div>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());

      document.querySelectorAll('.outer').forEach((element) => {
        assert.dom(element).doesNotHaveAttribute('role', 'none');
      });

      document.querySelectorAll('.inner').forEach((element) => {
        assert.dom(element).hasAttribute('role', 'none');
      });
    });
  });

  module('composition', () => {
    test('should be possible to wrap the Combobox.Options with a Transition component', async function (assert) {
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
        <Combobox as |combobox|>
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <Debug @name="Combobox" @fn={{this.orderFn}} />
          <Transition @show={{combobox.isOpen}}>
            <Debug @name="Transition" @fn={{this.orderFn}} />
            <combobox.Options @isOpen={{true}} as |options|>
              <options.Option @value="a" as |option|>
                {{option.active}} {{option.selected}} {{option.disabled}}
                <Debug @name="Combobox.Option" @fn={{this.orderFn}} />
              </options.Option>
            </combobox.Options>
          </Transition>
        </Combobox>
      `);

      assertComboboxButton({
        state: ComboboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-combobox-button-2' },
      });
      assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

      await click(getComboboxButton());

      assertComboboxButton({
        state: ComboboxState.Visible,
        attributes: { 'data-test': 'headlessui-combobox-button-2' },
      });
      assertComboboxList({
        state: ComboboxState.Visible,
        textContent: 'true false false',
      });

      await click(getComboboxButton());

      // Verify that we tracked the `mounts` and `unmounts` in the correct order
      assert.deepEqual(order, [
        'Mounting - Combobox',
        'Mounting - Transition',
        'Mounting - Combobox.Option',
        'Unmounting - Transition',
        'Unmounting - Combobox.Option',
      ]);
    });
  });

  module('Keyboard interactions', () => {
    module('Button', () => {
      module('`Enter` key', () => {
        test('should be possible to open the combobox with Enter', async function (assert) {
          await render(hbs`
            <Combobox 
              @value="test"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b">Option 2</options.Option>
                <options.Option @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the button
          getComboboxButton()?.focus();

          // Open combobox
          await triggerKeyEvent(document.activeElement, 'keypress', Keys.Enter);

          // Verify we moved focus to the input field
          assertActiveElement(getComboboxInput());

          // Verify it is visible
          assertComboboxButton({ state: ComboboxState.Visible });
          assertComboboxList({
            state: ComboboxState.Visible,
            attributes: { 'data-test': 'headlessui-combobox-options-3' },
          });
          await assertActiveElement(getComboboxInput());
          assertComboboxButtonLinkedWithCombobox();

          // Verify we have combobox options
          let options = getComboboxOptions();
          assert.strictEqual(options.length, 3);
          options.forEach((option) =>
            assertComboboxOption({ selected: false }, option)
          );

          assertActiveComboboxOption(options[0]);
          assertNoSelectedComboboxOption();
        });

        test('should not be possible to open the combobox with Enter when the button is disabled', async () => {
          await render(hbs`
            <Combobox 
              @value="test"
              @disabled={{true}}
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b">Option 2</options.Option>
                <options.Option @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Try to focus the button
          getComboboxButton()?.focus();

          // Try to open the combobox
          await triggerKeyEvent(document.activeElement, 'keypress', Keys.Enter);

          // Verify it is still closed
          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });
        });

        test('should be possible to open the combobox with Enter, and focus the selected option', async function (assert) {
          await render(hbs`
            <Combobox 
              @value="b"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b">Option 2</options.Option>
                <options.Option @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the button
          getComboboxButton()?.focus();

          // Open combobox
          await triggerKeyEvent(document.activeElement, 'keypress', Keys.Enter);

          // Verify we moved focus to the input field
          await assertActiveElement(getComboboxInput());

          // Verify it is visible
          assertComboboxButton({ state: ComboboxState.Visible });
          assertComboboxList({
            state: ComboboxState.Visible,
            attributes: { 'data-test': 'headlessui-combobox-options-3' },
          });

          await assertActiveElement(getComboboxInput());
          assertComboboxButtonLinkedWithCombobox();

          // Verify we have combobox options
          let options = getComboboxOptions();
          assert.strictEqual(options.length, 3);
          options.forEach((option, i) =>
            assertComboboxOption({ selected: i === 1 }, option)
          );

          // Verify that the second combobox option is active (because it is already selected)
          assertActiveComboboxOption(options[1]);
        });

        todo(
          'should be possible to open the combobox with Enter, and focus the selected option (when using the `hidden` render strategy)',
          async () => {}
        );

        test('should be possible to open the combobox with Enter, and focus the selected option (with a list of objects)', async function (assert) {
          this.set('myOptions', [
            { id: 'a', name: 'Option A' },
            { id: 'b', name: 'Option B' },
            { id: 'c', name: 'Option C' },
          ]);
          this.set('selectedOption', this.myOptions[1]);

          await render(hbs`
            <Combobox 
              @value={{this.selectedOption}}
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
              {{#each this.myOptions as |myOption|}}
                <options.Option @value={{myOption}}>
                  {{myOption.name}}
                </options.Option>
              {{/each}}
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the button
          getComboboxButton()?.focus();

          // Open combobox
          await triggerKeyEvent(document.activeElement, 'keypress', Keys.Enter);

          // Verify we moved focus to the input field
          await assertActiveElement(getComboboxInput());

          // Verify it is visible
          assertComboboxButton({ state: ComboboxState.Visible });
          assertComboboxList({
            state: ComboboxState.Visible,
            attributes: { 'data-test': 'headlessui-combobox-options-3' },
          });
          await assertActiveElement(getComboboxInput());
          assertComboboxButtonLinkedWithCombobox();

          // Verify we have combobox options
          let options = getComboboxOptions();
          assert.strictEqual(options.length, 3);
          options.forEach((option, i) =>
            assertComboboxOption({ selected: i === 1 }, option)
          );

          // Verify that the second combobox option is active (because it is already selected)
          assertActiveComboboxOption(options[1]);
        });

        test('should have no active combobox option when there are no combobox options at all', async () => {
          await render(hbs`
            <Combobox 
              @value={{this.selectedOption}}
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" />
            </Combobox>
          `);

          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the button
          getComboboxButton()?.focus();

          // Open combobox
          await triggerKeyEvent(document.activeElement, 'keypress', Keys.Enter);

          // Verify we moved focus to the input field
          await assertActiveElement(getComboboxInput());

          assertComboboxList({ state: ComboboxState.Visible });
          await assertActiveElement(getComboboxInput());

          assertNoActiveComboboxOption();
        });
      });

      module('`Space` key', () => {
        test('should be possible to open the combobox with Space', async function (assert) {
          await render(hbs`
            <Combobox 
              @value="test"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b">Option 2</options.Option>
                <options.Option @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the button
          getComboboxButton()?.focus();

          // Open combobox
          await triggerKeyEvent(document.activeElement, 'keypress', 'Space');

          // Verify we moved focus to the input field
          await assertActiveElement(getComboboxInput());

          // Verify it is visible
          assertComboboxButton({ state: ComboboxState.Visible });
          assertComboboxList({
            state: ComboboxState.Visible,
            attributes: { 'data-test': 'headlessui-combobox-options-3' },
          });
          await assertActiveElement(getComboboxInput());
          assertComboboxButtonLinkedWithCombobox();

          // Verify we have combobox options
          let options = getComboboxOptions();
          assert.strictEqual(options.length, 3);
          options.forEach((option) => assertComboboxOption({}, option));
          assertActiveComboboxOption(options[0]);
        });

        test('should not be possible to open the combobox with Space when the button is disabled', async () => {
          await render(hbs`
            <Combobox 
              @value="test"
              @disabled={{true}}
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b">Option 2</options.Option>
                <options.Option @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the button
          getComboboxButton()?.focus();

          // Try to open the combobox
          await triggerKeyEvent(document.activeElement, 'keypress', 'Space');

          // Verify it is still closed
          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });
        });

        test('should be possible to open the combobox with Space, and focus the selected option', async function (assert) {
          await render(hbs`
            <Combobox 
              @value="b"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b">Option 2</options.Option>
                <options.Option @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({
            state: ComboboxState.InvisibleUnmounted,
          });

          // Focus the button
          getComboboxButton()?.focus();

          // Open combobox
          await triggerKeyEvent(document.activeElement, 'keypress', 'Space');

          // Verify it is visible
          assertComboboxButton({ state: ComboboxState.Visible });
          assertComboboxList({
            state: ComboboxState.Visible,
            attributes: { 'data-test': 'headlessui-combobox-options-3' },
          });
          await assertActiveElement(getComboboxInput());
          assertComboboxButtonLinkedWithCombobox();

          // Verify we have combobox options
          let options = getComboboxOptions();
          assert.strictEqual(options.length, 3);
          options.forEach((option, i) =>
            assertComboboxOption({ selected: i === 1 }, option)
          );

          // Verify that the second combobox option is active (because it is already selected)
          assertActiveComboboxOption(options[1]);
        });

        test('should have no active combobox option when there are no combobox options at all', async () => {
          await render(hbs`
            <Combobox 
              @value="test"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" />
            </Combobox>
          `);

          assertComboboxList({
            state: ComboboxState.InvisibleUnmounted,
          });

          // Focus the button
          getComboboxButton()?.focus();

          // Open combobox
          await triggerKeyEvent(document.activeElement, 'keypress', 'Space');
          assertComboboxList({ state: ComboboxState.Visible });
          assertActiveElement(getComboboxInput());

          assertNoActiveComboboxOption();
        });

        test('should have no active combobox option upon Space key press, when there are no non-disabled combobox options', async () => {
          await render(hbs`
            <Combobox 
              @value="test"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @disabled={{true}} @value="a">Option 1</options.Option>
                <options.Option @disabled={{true}} @value="b">Option 2</options.Option>
                <options.Option @disabled={{true}} @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({
            state: ComboboxState.InvisibleUnmounted,
          });

          // Focus the button
          getComboboxButton()?.focus();

          // Open combobox
          await triggerKeyEvent(document.activeElement, 'keypress', 'Space');

          assertNoActiveComboboxOption();
        });
      });

      module('`Escape` key', () => {
        test('should be possible to close an open combobox with Escape', async () => {
          await render(hbs`
            <Combobox 
              @value="test"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b">Option 2</options.Option>
                <options.Option @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          // Open combobox
          await click(getComboboxButton());

          // Verify it is visible
          assertComboboxButton({ state: ComboboxState.Visible });
          assertComboboxList({
            state: ComboboxState.Visible,
            attributes: { 'data-test': 'headlessui-combobox-options-3' },
          });
          await assertActiveElement(getComboboxInput());
          assertComboboxButtonLinkedWithCombobox();

          await focus(getComboboxButton());
          // TODO: Not sure why this is not focused
          // await assertActiveElement(getComboboxButton());

          // Close combobox
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.Escape);

          // Verify it is closed
          assertComboboxButton({ state: ComboboxState.InvisibleUnmounted });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Verify the input is focused again
          await assertActiveElement(getComboboxInput());
        });
      });

      module('`ArrowDown` key', () => {
        test('should be possible to open the combobox with ArrowDown', async function (assert) {
          await render(hbs`
            <Combobox 
              @value="test"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b">Option 2</options.Option>
                <options.Option @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the button
          getComboboxButton()?.focus();

          // Open combobox
          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.ArrowDown
          );

          // Verify it is visible
          assertComboboxButton({ state: ComboboxState.Visible });
          assertComboboxList({
            state: ComboboxState.Visible,
            attributes: { 'data-test': 'headlessui-combobox-options-3' },
          });
          await assertActiveElement(getComboboxInput());
          assertComboboxButtonLinkedWithCombobox();

          // Verify we have combobox options
          let options = getComboboxOptions();
          assert.strictEqual(options.length, 3);
          options.forEach((option) => assertComboboxOption({}, option));

          // Verify that the first combobox option is active
          assertActiveComboboxOption(options[0]);
        });

        test('should not be possible to open the combobox with ArrowDown when the button is disabled', async () => {
          await render(hbs`
            <Combobox 
              @value="test"
              @disabled={{true}}
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b">Option 2</options.Option>
                <options.Option @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the button
          getComboboxButton()?.focus();

          // Try to open the combobox
          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.ArrowDown
          );

          // Verify it is still closed
          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });
        });

        test('should be possible to open the combobox with ArrowDown, and focus the selected option', async function (assert) {
          await render(hbs`
            <Combobox 
              @value="b"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b">Option 2</options.Option>
                <options.Option @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the button
          getComboboxButton()?.focus();

          // Open combobox
          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.ArrowDown
          );

          // Verify it is visible
          assertComboboxButton({ state: ComboboxState.Visible });
          assertComboboxList({
            state: ComboboxState.Visible,
            attributes: { 'data-test': 'headlessui-combobox-options-3' },
          });
          await assertActiveElement(getComboboxInput());
          assertComboboxButtonLinkedWithCombobox();

          // Verify we have combobox options
          let options = getComboboxOptions();
          assert.strictEqual(options.length, 3);
          options.forEach((option, i) =>
            assertComboboxOption({ selected: i === 1 }, option)
          );

          // Verify that the second combobox option is active (because it is already selected)
          assertActiveComboboxOption(options[1]);
        });

        test('should have no active combobox option when there are no combobox options at all', async () => {
          await render(hbs`
            <Combobox 
              @value="test"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" />
            </Combobox>
          `);

          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the button
          getComboboxButton()?.focus();

          // Open combobox
          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.ArrowDown
          );
          assertComboboxList({ state: ComboboxState.Visible });
          await assertActiveElement(getComboboxInput());

          assertNoActiveComboboxOption();
        });
      });

      module('`ArrowUp` key', () => {
        test('should be possible to open the combobox with ArrowUp and the last option should be active', async function (assert) {
          await render(hbs`
            <Combobox 
              @value="test"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b">Option 2</options.Option>
                <options.Option @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the button
          getComboboxButton()?.focus();

          // Open combobox
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowUp);

          // Verify it is visible
          assertComboboxButton({ state: ComboboxState.Visible });
          assertComboboxList({
            state: ComboboxState.Visible,
            attributes: { 'data-test': 'headlessui-combobox-options-3' },
          });
          await assertActiveElement(getComboboxInput());
          assertComboboxButtonLinkedWithCombobox();

          // Verify we have combobox options
          let options = getComboboxOptions();
          assert.strictEqual(options.length, 3);
          options.forEach((option) => assertComboboxOption({}, option));

          // ! ALERT: The LAST option should now be active
          assertActiveComboboxOption(options[2]);
        });

        test('should not be possible to open the combobox with ArrowUp and the last option should be active when the button is disabled', async () => {
          await render(hbs`
            <Combobox 
              @value="test"
              @disabled={{true}}
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b">Option 2</options.Option>
                <options.Option @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the button
          getComboboxButton()?.focus();

          // Try to open the combobox
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowUp);

          // Verify it is still closed
          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });
        });

        test('should be possible to open the combobox with ArrowUp, and focus the selected option', async function (assert) {
          await render(hbs`
            <Combobox 
              @value="b"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b">Option 2</options.Option>
                <options.Option @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the button
          getComboboxButton()?.focus();

          // Open combobox
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowUp);

          // Verify it is visible
          assertComboboxButton({ state: ComboboxState.Visible });
          assertComboboxList({
            state: ComboboxState.Visible,
            attributes: { 'data-test': 'headlessui-combobox-options-3' },
          });
          await assertActiveElement(getComboboxInput());
          assertComboboxButtonLinkedWithCombobox();

          // Verify we have combobox options
          let options = getComboboxOptions();
          assert.strictEqual(options.length, 3);
          options.forEach((option, i) =>
            assertComboboxOption({ selected: i === 1 }, option)
          );

          // Verify that the second combobox option is active (because it is already selected)
          assertActiveComboboxOption(options[1]);
        });

        test('should have no active combobox option when there are no combobox options at all', async () => {
          await render(hbs`
            <Combobox 
              @value="test"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" />
            </Combobox>
          `);

          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the button
          getComboboxButton()?.focus();

          // Open combobox
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowUp);
          assertComboboxList({ state: ComboboxState.Visible });
          await assertActiveElement(getComboboxInput());

          assertNoActiveComboboxOption();
        });

        test('should be possible to use ArrowUp to navigate the combobox options and jump to the first non-disabled one', async function (assert) {
          await render(hbs`
            <Combobox 
              @value={{undefined}}
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b" @disabled={{true}}>Option 2</options.Option>
                <options.Option @value="c" @disabled={{true}}>Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the button
          getComboboxButton()?.focus();

          // Open combobox
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowUp);

          // Verify we have combobox options
          let options = getComboboxOptions();
          assert.strictEqual(options.length, 3);
          options.forEach((option) => assertComboboxOption({}, option));
          assertActiveComboboxOption(options[0]);
        });
      });

      module('`Backspace` key', () => {
        // TODO skipping because chrome blocks backspace to inputs
        // https://github.com/emberjs/ember-test-helpers/issues/626
        skip('should reset the value when the last character is removed, when in `nullable` mode', async function (assert) {
          this.set('value', 'bob');

          let callValue = '',
            callCount = 0;

          this.set('onChange', (value) => {
            this.set('value', value);
            callValue = value;
            callCount++;
          });

          this.set('setQuery', (event) => {
            this.set('query', event.target.value);
          });

          await render(hbs`
            <Combobox 
              @value={{this.value}}
              @onChange={{this.onChange}}
              @nullable={{true}}
              as |combobox|
            >
              <combobox.Input @onChange={{this.setQuery}}/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="alice">Alice</options.Option>
                <options.Option @value="bob">Bob</options.Option>
                <options.Option @value="charlie">Charlie</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          // Open combobox
          await click(getComboboxButton());

          // Bob should be active
          let options = getComboboxOptions();
          assert.dom(getComboboxInput()).hasValue('bob');
          assertActiveComboboxOption(options[1]);

          await assertActiveElement(getComboboxInput());

          // Delete a character
          // TODO use Keyboard.ts
          await triggerKeyEvent(getComboboxInput(), 'keydown', Keys.Backspace);
          assert.dom(getComboboxInput()).hasValue('bo');
          assertActiveComboboxOption(options[1]);

          // Delete a character
          await triggerKeyEvent(
            document.activeElement,
            'keydown',
            Keys.Backspace
          );
          assert.dom(getComboboxInput()).hasValue('b');
          assertActiveComboboxOption(options[1]);

          // Delete a character
          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.Backspace
          );
          assert.dom(getComboboxInput()).hasValue('');

          // Verify that we don't have an active option anymore since we are in `nullable` mode
          assertNotActiveComboboxOption(options[1]);
          assertNoActiveComboboxOption();

          // Verify that we saw the `null` change coming in
          assert.strictEqual(callCount, 1, 'handleChange called once');
          assert.strictEqual(callValue, null, 'handleChange called with null');
        });
      });
    });

    module('Input', () => {
      module('`Enter` key', () => {
        test('should be possible to close the combobox with Enter and choose the active combobox option', async function (assert) {
          let callValue = '',
            callCount = 0;

          this.set('onChange', (value) => {
            this.set('selectedOption', value);
            callValue = value;
            callCount++;
          });

          await render(hbs`
            <Combobox 
              @value={{this.selectedOption}}
              @onChange={{this.onChange}}
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b">Option 2</options.Option>
                <options.Option @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Open combobox
          await click(getComboboxButton());

          // Verify it is visible
          assertComboboxButton({ state: ComboboxState.Visible });

          // Activate the first combobox option
          let options = getComboboxOptions();
          await triggerEvent(options[0], 'mouseover');

          // Choose option, and close combobox
          await triggerKeyEvent(document.activeElement, 'keypress', Keys.Enter);

          // Verify it is closed
          assertComboboxButton({ state: ComboboxState.InvisibleUnmounted });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Verify we got the change event
          assert.strictEqual(callCount, 1, 'handleChange called once exactly');
          assert.strictEqual(callValue, 'a', 'handleChange called with "a"');

          // Verify the button is focused again
          await assertActiveElement(getComboboxInput());

          // Open combobox again
          await click(getComboboxButton());

          // Verify the active option is the previously selected one
          assertActiveComboboxOption(getComboboxOptions()[0]);
        });

        test('should submit the form on `Enter`', async function (assert) {
          let callCount = 0,
            callValue = '';

          this.set('onSubmit', (event) => {
            event.preventDefault();
            callValue = [
              ...new FormData(
                document.querySelector('[data-test-combobox-form]')
              ).entries(),
            ];
            callCount++;
          });

          this.set('onkeyUp', async (event) => {
            // JSDom doesn't automatically submit the form but if we can
            // catch an `Enter` event, we can assume it was a submit.
            if (event.key === Keys.Enter) {
              await click(document.querySelector('[type="submit"]'));
            }
          });

          await render(hbs`
            <form 
              data-test-combobox-form
              {{on "submit" this.onSubmit}} 
              {{on "keyup" this.onkeyUp}}
            >
              <Combobox 
                @value="b"
                as |combobox|
              >
                <combobox.Input/>
                <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
                <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                  <options.Option @value="a">Option 1</options.Option>
                  <options.Option @value="b">Option 2</options.Option>
                  <options.Option @value="c">Option 3</options.Option>
                </combobox.Options>
              </Combobox>
              <button type="submit">Submit</button>
            </form>
          `);

          // Focus the input field
          getComboboxInput()?.focus();
          await assertActiveElement(getComboboxInput());

          // Press enter (which should submit the form)
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.Enter);

          // Verify the form was submitted
          assert.strictEqual(callCount, 1, 'onSubmit called once');
          assert.deepEqual(
            callValue,
            [['option', 'b']],
            'onSubmit called with formdata'
          );
        });
      });

      module('`Tab` key', () => {
        // TODO skipping this because chrome not tabbing to next element in tab order
        skip('pressing Tab should select the active item and move to the next DOM node', async function (assert) {
          await render(hbs`
            <input id="before-combobox" />
            <Combobox 
              @value="b"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b">Option 2</options.Option>
                <options.Option @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
            <input id="after-combobox" />
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Open combobox
          await click(getComboboxButton());

          // Select the 2nd option
          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.ArrowDown
          );

          // Tab to the next DOM node
          await triggerKeyEvent(document.activeElement, 'keydown', Keys.Tab);

          // Verify it is closed
          assertComboboxButton({ state: ComboboxState.InvisibleUnmounted });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // That the selected value was the highlighted one
          assert.dom(getComboboxInput()).hasValue('b');

          // And focus has moved to the next element
          await assertActiveElement(document.querySelector('#after-combobox'));
        });

        todo(
          'pressing Shift+Tab should select the active item and move to the previous DOM node',
          () => {}
        );
      });

      module('`Escape` key', () => {
        test('should be possible to close an open combobox with Escape', async () => {
          await render(hbs`
            <Combobox 
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="a">Option 1</options.Option>
                <options.Option @value="b">Option 2</options.Option>
                <options.Option @value="c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          // Open combobox
          await click(getComboboxButton());

          // Verify it is visible
          assertComboboxButton({ state: ComboboxState.Visible });
          assertComboboxList({
            state: ComboboxState.Visible,
            attributes: { 'data-test': 'headlessui-combobox-options-3' },
          });
          await assertActiveElement(getComboboxInput());
          assertComboboxButtonLinkedWithCombobox();

          // Close combobox
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.Escape);

          // Verify it is closed
          assertComboboxButton({ state: ComboboxState.InvisibleUnmounted });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Verify the button is focused again
          await assertActiveElement(getComboboxInput());
        });

        todo(
          'should bubble escape when using `static` on Combobox.Options',
          () => {}
        );

        test('should bubble escape when not using Combobox.Options at all', async function (assert) {
          let spy = 0;

          await render(hbs`
            <Combobox 
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
            </Combobox>
          `);

          window.addEventListener(
            'keydown',
            (evt) => {
              if (evt.key === Keys.Escape) {
                spy++;
              }
            },
            { capture: true }
          );

          window.addEventListener('keydown', (evt) => {
            if (evt.key === Keys.Escape) {
              spy++;
            }
          });

          // Open combobox
          await click(getComboboxButton());

          // Verify the input is focused
          await assertActiveElement(getComboboxInput());

          // Close combobox
          await triggerKeyEvent(document.activeElement, 'keydown', Keys.Escape);

          // Verify the input is still focused
          await assertActiveElement(getComboboxInput());

          // The external event handler should've been called twice
          // Once in the capture phase and once in the bubble phase
          assert.strictEqual(spy, 2, 'spy called twice');
        });

        test('should sync the input field correctly and reset it when pressing Escape', async function (assert) {
          await render(hbs`
            <Combobox 
              @value="option-b"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="option-a">Option 1</options.Option>
                <options.Option @value="option-b">Option 2</options.Option>
                <options.Option @value="option-c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          // Open combobox
          await click(getComboboxButton());

          // Verify the input has the selected value
          assert.dom(getComboboxInput()).hasValue('option-b');

          // Override the input by typing something
          getComboboxInput().value = '';
          await typeIn(getComboboxInput(), 'test');

          assert.dom(getComboboxInput()).hasValue('test');

          // Close combobox
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.Escape);

          // Verify the input is reset correctly
          assert.dom(getComboboxInput()).hasValue('option-b');
        });
      });

      module('`ArrowDown` key', () => {
        test('should be possible to open the combobox with ArrowDown', async function (assert) {
          await render(hbs`
            <Combobox 
              @value="test"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="option-a">Option 1</options.Option>
                <options.Option @value="option-b">Option 2</options.Option>
                <options.Option @value="option-c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the input
          getComboboxInput()?.focus();

          // Open combobox
          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.ArrowDown
          );

          // Verify it is visible
          assertComboboxButton({ state: ComboboxState.Visible });
          assertComboboxList({
            state: ComboboxState.Visible,
            attributes: { 'data-test': 'headlessui-combobox-options-3' },
          });
          await assertActiveElement(getComboboxInput());
          assertComboboxButtonLinkedWithCombobox();
          // Verify we have combobox options
          let options = getComboboxOptions();
          assert.strictEqual(options.length, 3);
          options.forEach((option) => assertComboboxOption({}, option));

          // Verify that the first combobox option is active
          assertActiveComboboxOption(options[0]);
        });

        test('should not be possible to open the combobox with ArrowDown when the button is disabled', async () => {
          await render(hbs`
            <Combobox 
              @value="test"
              @disabled={{true}}
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="option-a">Option 1</options.Option>
                <options.Option @value="option-b">Option 2</options.Option>
                <options.Option @value="option-c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the input
          getComboboxInput()?.focus();

          // Try to open the combobox
          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.ArrowDown
          );

          // Verify it is still closed
          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });
        });

        test('should be possible to open the combobox with ArrowDown, and focus the selected option', async function (assert) {
          await render(hbs`
            <Combobox 
              @value="option-b"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="option-a">Option 1</options.Option>
                <options.Option @value="option-b">Option 2</options.Option>
                <options.Option @value="option-c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the input
          getComboboxInput()?.focus();

          // Open combobox
          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.ArrowDown
          );

          // Verify it is visible
          assertComboboxButton({ state: ComboboxState.Visible });
          assertComboboxList({
            state: ComboboxState.Visible,
            attributes: { 'data-test': 'headlessui-combobox-options-3' },
          });
          await assertActiveElement(getComboboxInput());
          assertComboboxButtonLinkedWithCombobox();

          // Verify we have combobox options
          let options = getComboboxOptions();
          assert.strictEqual(options.length, 3);
          options.forEach((option, i) =>
            assertComboboxOption({ selected: i === 1 }, option)
          );

          // Verify that the second combobox option is active (because it is already selected)
          assertActiveComboboxOption(options[1]);
        });

        test('should have no active combobox option when there are no combobox options at all', async () => {
          await render(hbs`
            <Combobox 
              @value="option-b"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options />
            </Combobox>
          `);

          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Focus the input
          getComboboxInput()?.focus();

          // Open combobox
          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.ArrowDown
          );
          assertComboboxList({ state: ComboboxState.Visible });
          await assertActiveElement(getComboboxInput());

          assertNoActiveComboboxOption();
        });

        test('should be possible to use ArrowDown to navigate the combobox options', async function (assert) {
          await render(hbs`
            <Combobox 
              @value="test"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="option-a">Option 1</options.Option>
                <options.Option @value="option-b">Option 2</options.Option>
                <options.Option @value="option-c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Open combobox
          await click(getComboboxButton());

          // Verify we have combobox options
          let options = getComboboxOptions();
          assert.strictEqual(options.length, 3);
          options.forEach((option) => assertComboboxOption({}, option));
          assertActiveComboboxOption(options[0]);

          // We should be able to go down once
          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.ArrowDown
          );
          assertActiveComboboxOption(options[1]);

          // We should be able to go down again
          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.ArrowDown
          );
          assertActiveComboboxOption(options[2]);

          // We should NOT be able to go down again (because last option).
          // Current implementation won't go around.
          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.ArrowDown
          );
          assertActiveComboboxOption(options[2]);
        });

        test('should be possible to use ArrowDown to navigate the combobox options and skip the first disabled one', async function (assert) {
          await render(hbs`
            <Combobox 
              @value="test"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="option-a" @disabled={{true}}>Option 1</options.Option>
                <options.Option @value="option-b">Option 2</options.Option>
                <options.Option @value="option-c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Open combobox
          await click(getComboboxButton());

          // Verify we have combobox options
          let options = getComboboxOptions();
          assert.strictEqual(options.length, 3);
          options.forEach((option) => assertComboboxOption({}, option));
          assertActiveComboboxOption(options[1]);

          // We should be able to go down once
          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.ArrowDown
          );
          assertActiveComboboxOption(options[2]);
        });

        test('should be possible to use ArrowDown to navigate the combobox options and jump to the first non-disabled one', async function (assert) {
          await render(hbs`
            <Combobox 
              @value="test"
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="option-a" @disabled={{true}}>Option 1</options.Option>
                <options.Option @value="option-b" @disabled={{true}}>Option 2</options.Option>
                <options.Option @value="option-c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Open combobox
          await click(getComboboxButton());

          // Verify we have combobox options
          let options = getComboboxOptions();
          assert.strictEqual(options.length, 3);
          options.forEach((option) => assertComboboxOption({}, option));
          assertActiveComboboxOption(options[2]);

          // Open combobox
          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.ArrowDown
          );
          assertActiveComboboxOption(options[2]);
        });

        test('should be possible to go to the next item if no value is set', async () => {
          await render(hbs`
            <Combobox 
              @value={{null}}
              as |combobox|
            >
              <combobox.Input/>
              <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
              <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
                <options.Option @value="option-a">Option 1</options.Option>
                <options.Option @value="option-b">Option 2</options.Option>
                <options.Option @value="option-c">Option 3</options.Option>
              </combobox.Options>
            </Combobox>
          `);

          assertComboboxButton({
            state: ComboboxState.InvisibleUnmounted,
            attributes: { 'data-test': 'headlessui-combobox-button-2' },
          });
          assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

          // Open combobox
          await click(getComboboxButton());

          let options = getComboboxOptions();

          // Verify that we are on the first option
          assertActiveComboboxOption(options[0]);

          // Go down once
          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.ArrowDown
          );

          // We should be on the next item
          assertActiveComboboxOption(options[1]);
        });
      });

      module('`ArrowUp` key', () => {
        // TODO these tests are duplicating <Listbox> functionality

        todo(
          'should be possible to open the combobox with ArrowUp and the last option should be active',
          () => {}
        );
        todo(
          'should not be possible to open the combobox with ArrowUp and the last option should be active when the button is disabled',
          () => {}
        );
        todo(
          'should be possible to open the combobox with ArrowUp, and focus the selected option',
          () => {}
        );
        todo(
          'should have no active combobox option when there are no combobox options at all',
          () => {}
        );
        todo(
          'should be possible to use ArrowUp to navigate the combobox options and jump to the first non-disabled one',
          () => {}
        );
      });

      module('`End` key', () => {
        // TODO these tests are duplicating <Listbox> functionality

        todo(
          'should be possible to use the End key to go to the last combobox option',
          () => {}
        );
        todo(
          'should be possible to use the End key to go to the last non disabled combobox option',
          () => {}
        );
        todo(
          'should be possible to use the End key to go to the first combobox option if that is the only non-disabled combobox option',
          () => {}
        );
        todo(
          'should have no active combobox option upon End key press, when there are no non-disabled combobox options',
          () => {}
        );
      });

      module('`PageDown` key', () => {
        // TODO these tests are duplicating <Listbox> functionality

        todo(
          'should be possible to use the PageDown key to go to the last combobox option',
          () => {}
        );
        todo(
          'should be possible to use the PageDown key to go to the last non disabled combobox option',
          () => {}
        );
        todo(
          'should be possible to use the PageDown key to go to the first combobox option if that is the only non-disabled combobox option',
          () => {}
        );
        todo(
          'should have no active combobox option upon PageDown key press, when there are no non-disabled combobox options',
          () => {}
        );
      });

      module('`Home` key', () => {
        // TODO these tests are duplicating <Listbox> functionality

        todo(
          'should be possible to use the Home key to go to the first combobox option',
          () => {}
        );
        todo(
          'should be possible to use the Home key to go to the first non disabled combobox option',
          () => {}
        );
        todo(
          'should be possible to use the Home key to go to the last combobox option if that is the only non-disabled combobox option',
          () => {}
        );
        todo(
          'should have no active combobox option upon Home key press, when there are no non-disabled combobox options',
          () => {}
        );
      });

      module('`PageUp` key', () => {
        // TODO these tests are duplicating <Listbox> functionality

        todo(
          'should be possible to use the PageUp key to go to the first combobox option',
          () => {}
        );
        todo(
          'should be possible to use the PageUp key to go to the first non disabled combobox option',
          () => {}
        );
        todo(
          'should be possible to use the PageUp key to go to the last combobox option if that is the only non-disabled combobox option',
          () => {}
        );
        todo(
          'should have no active combobox option upon PageUp key press, when there are no non-disabled combobox options',
          () => {}
        );
      });

      module('`Any` key aka search', () => {
        test('should be possible to type a full word that has a perfect match', async function (assert) {
          await renderWithPeople(this, [
            { value: 'alice', name: 'alice', disabled: false },
            { value: 'bob', name: 'bob', disabled: false },
            { value: 'charlie', name: 'charlie', disabled: false },
          ]);

          // Open combobox
          await click(getComboboxButton());

          // Verify we moved focus to the input field
          await assertActiveElement(getComboboxInput());

          // We should be able to go to the second option
          getComboboxInput().value = '';
          await typeIn(getComboboxInput(), 'bob');

          await triggerKeyEvent(document.activeElement, 'keyup', Keys.Home);

          let options = getComboboxOptions();
          assert.strictEqual(options.length, 1);
          assert.dom(options[0]).hasText('bob');
          assertActiveComboboxOption(options[0]);

          // We should be able to go to the first option
          getComboboxInput().value = '';
          await typeIn(getComboboxInput(), 'alice');
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.Home);

          options = getComboboxOptions();
          assert.strictEqual(options.length, 1);
          assert.dom(options[0]).hasText('alice');
          assertActiveComboboxOption(options[0]);

          // We should be able to go to the last option
          getComboboxInput().value = '';
          await typeIn(getComboboxInput(), 'charlie');
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.Home);

          options = getComboboxOptions();
          assert.strictEqual(options.length, 1);
          assert.dom(options[0]).hasText('charlie');
          assertActiveComboboxOption(options[0]);
        });

        test('should be possible to type a partial of a word', async function (assert) {
          await renderWithPeople(this, [
            { value: 'alice', name: 'alice', disabled: false },
            { value: 'bob', name: 'bob', disabled: false },
            { value: 'charlie', name: 'charlie', disabled: false },
          ]);

          // Open combobox
          await click(getComboboxButton());
          let options;

          // We should be able to go to the second option
          getComboboxInput().value = '';
          await typeIn(getComboboxInput(), 'bo');
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.Home);
          options = getComboboxOptions();
          assert.strictEqual(options.length, 1);
          assert.dom(options[0]).hasText('bob');
          assertActiveComboboxOption(options[0]);

          // We should be able to go to the first option
          getComboboxInput().value = '';
          await typeIn(getComboboxInput(), 'ali');
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.Home);
          options = getComboboxOptions();
          assert.strictEqual(options.length, 1);
          assert.dom(options[0]).hasText('alice');
          assertActiveComboboxOption(options[0]);

          // We should be able to go to the last option
          getComboboxInput().value = '';
          await typeIn(getComboboxInput(), 'char');
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.Home);
          options = getComboboxOptions();
          assert.strictEqual(options.length, 1);
          assert.dom(options[0]).hasText('charlie');
          assertActiveComboboxOption(options[0]);
        });

        test('should be possible to type words with spaces', async function (assert) {
          await renderWithPeople(this, [
            { value: 'alice', name: 'alice jones', disabled: false },
            { value: 'bob', name: 'bob the builder', disabled: false },
            { value: 'charlie', name: 'charlie bit me', disabled: false },
          ]);

          // Open combobox
          await click(getComboboxButton());

          let options;

          // We should be able to go to the second option
          getComboboxInput().value = '';
          await typeIn(getComboboxInput(), 'bob t');
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.Home);
          options = getComboboxOptions();

          assert.strictEqual(options.length, 1);
          assert.dom(options[0]).hasText('bob the builder');
          assertActiveComboboxOption(options[0]);

          // We should be able to go to the first option
          getComboboxInput().value = '';
          await typeIn(getComboboxInput(), 'alice j');
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.Home);
          options = getComboboxOptions();
          assert.strictEqual(options.length, 1);
          assert.dom(options[0]).hasText('alice jones');
          assertActiveComboboxOption(options[0]);

          // We should be able to go to the last option
          getComboboxInput().value = '';
          await typeIn(getComboboxInput(), 'charlie b');
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.Home);
          options = getComboboxOptions();
          assert.strictEqual(options.length, 1);
          assert.dom(options[0]).hasText('charlie bit me');
          assertActiveComboboxOption(options[0]);
        });

        test('should not be possible to search and activate a disabled option', async function () {
          await renderWithPeople(this, [
            { value: 'alice', name: 'alice', disabled: false },
            { value: 'bob', name: 'bob', disabled: true },
            { value: 'charlie', name: 'charlie', disabled: false },
          ]);

          // Open combobox
          await click(getComboboxButton());

          // We should not be able to go to the disabled option
          getComboboxInput().value = '';
          await typeIn(getComboboxInput(), 'bo');
          await triggerKeyEvent(document.activeElement, 'keyup', Keys.Home);

          assertNoActiveComboboxOption();
          assertNoSelectedComboboxOption();
        });

        test('should maintain activeIndex and activeOption when filtering', async function (assert) {
          await renderWithPeople(this, [
            { value: 'alice', name: 'person a', disabled: false },
            { value: 'bob', name: 'person b', disabled: false },
            { value: 'charlie', name: 'person c', disabled: false },
          ]);

          // Open combobox
          await click(getComboboxButton());

          let options;

          await triggerKeyEvent(
            document.activeElement,
            'keyup',
            Keys.ArrowDown
          );

          // Person B should be active
          options = getComboboxOptions();
          assert.dom(options[1]).hasText('person b');
          assertActiveComboboxOption(options[1]);

          // Filter more, remove `person a`
          getComboboxInput().value = '';
          await typeIn(getComboboxInput(), 'person b');
          options = getComboboxOptions();
          assert.dom(options[0]).hasText('person b');
          assertActiveComboboxOption(options[0]);

          // Filter less, insert `person a` before `person b`
          getComboboxInput().value = '';
          await typeIn(getComboboxInput(), 'person');
          options = getComboboxOptions();
          assert.dom(options[1]).hasText('person b');
          assertActiveComboboxOption(options[1]);
        });
      });
    });
  });

  module('Mouse interactions', () => {
    test('should focus the Combobox.Input when we click the Combobox.Label', async () => {
      await render(hbs`
        <Combobox 
          @value={{null}}
          as |combobox|
        >
          <combobox.Label>Label</combobox.Label>
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="option-a">Option 1</options.Option>
            <options.Option @value="option-b">Option 2</options.Option>
            <options.Option @value="option-c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Ensure the button is not focused yet
      assertActiveElement(document.body);

      // Focus the label
      await click(getComboboxLabel());

      // Ensure that the actual button is focused instead
      await assertActiveElement(getComboboxInput());
    });

    test('should not focus the Combobox.Input when we right click the Combobox.Label', async () => {
      await render(hbs`
        <Combobox 
          @value={{null}}
          as |combobox|
        >
          <combobox.Label>Label</combobox.Label>
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="option-a">Option 1</options.Option>
            <options.Option @value="option-b">Option 2</options.Option>
            <options.Option @value="option-c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Ensure the button is not focused yet
      assertActiveElement(document.body);

      // Focus the label
      await click(getComboboxLabel(), { button: 2 });

      // Ensure that the body is still active
      await assertActiveElement(document.body);
    });

    test('should be possible to open the combobox on click', async function (assert) {
      await render(hbs`
        <Combobox 
          @value={{null}}
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="option-a">Option 1</options.Option>
            <options.Option @value="option-b">Option 2</options.Option>
            <options.Option @value="option-c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      assertComboboxButton({
        state: ComboboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-combobox-button-2' },
      });
      assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

      // Open combobox
      await click(getComboboxButton());

      // Verify it is visible
      assertComboboxButton({ state: ComboboxState.Visible });
      assertComboboxList({
        state: ComboboxState.Visible,
        attributes: { 'data-test': 'headlessui-combobox-options-3' },
      });
      await assertActiveElement(getComboboxInput());
      assertComboboxButtonLinkedWithCombobox();

      // Verify we have combobox options
      let options = getComboboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option) => assertComboboxOption({}, option));
    });

    test('should not be possible to open the combobox on right click', async () => {
      await render(hbs`
        <Combobox 
          @value={{null}}
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="option-a">Option 1</options.Option>
            <options.Option @value="option-b">Option 2</options.Option>
            <options.Option @value="option-c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      assertComboboxButton({
        state: ComboboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-combobox-button-2' },
      });
      assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

      // Try to open the combobox
      await click(getComboboxButton(), { button: 2 });

      // Verify it is still closed
      assertComboboxButton({ state: ComboboxState.InvisibleUnmounted });
    });

    test('should not be possible to open the combobox on click when the button is disabled', async () => {
      await render(hbs`
        <Combobox 
          @value={{null}}
          @disabled={{true}}
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="option-a">Option 1</options.Option>
            <options.Option @value="option-b">Option 2</options.Option>
            <options.Option @value="option-c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      assertComboboxButton({
        state: ComboboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-combobox-button-2' },
      });
      assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

      // Try to open the combobox
      try {
        await click(getComboboxButton());
      } catch (e) {
        // expected
      }

      // Verify it is still closed
      assertComboboxButton({
        state: ComboboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-combobox-button-2' },
      });
      assertComboboxList({ state: ComboboxState.InvisibleUnmounted });
    });

    test('should be possible to open the combobox on click, and focus the selected option', async function (assert) {
      await render(hbs`
        <Combobox 
          @value="b"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="a">Option 1</options.Option>
            <options.Option @value="b">Option 2</options.Option>
            <options.Option @value="c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      assertComboboxButton({
        state: ComboboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-combobox-button-2' },
      });
      assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

      // Open combobox
      await click(getComboboxButton());

      // Verify it is visible
      assertComboboxButton({ state: ComboboxState.Visible });
      assertComboboxList({
        state: ComboboxState.Visible,
        attributes: { 'data-test': 'headlessui-combobox-options-3' },
      });
      await assertActiveElement(getComboboxInput());
      assertComboboxButtonLinkedWithCombobox();

      // Verify we have combobox options
      let options = getComboboxOptions();
      assert.strictEqual(options.length, 3);
      options.forEach((option, i) =>
        assertComboboxOption({ selected: i === 1 }, option)
      );

      // Verify that the second combobox option is active (because it is already selected)
      assertActiveComboboxOption(options[1]);
    });

    test('should be possible to close a combobox on click', async () => {
      await render(hbs`
        <Combobox 
          @value="b"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="a">Option 1</options.Option>
            <options.Option @value="b">Option 2</options.Option>
            <options.Option @value="c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());

      // Verify it is visible
      assertComboboxButton({ state: ComboboxState.Visible });

      // Click to close
      await click(getComboboxButton());

      // Verify it is closed
      assertComboboxButton({ state: ComboboxState.InvisibleUnmounted });
      assertComboboxList({ state: ComboboxState.InvisibleUnmounted });
    });

    test('should be a no-op when we click outside of a closed combobox', async () => {
      await render(hbs`
        <Combobox 
          @value="b"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="a">Option 1</options.Option>
            <options.Option @value="b">Option 2</options.Option>
            <options.Option @value="c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Verify that the window is closed
      assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

      // Click something that is not related to the combobox
      await click(document.body);

      // Should still be closed
      assertComboboxList({ state: ComboboxState.InvisibleUnmounted });
    });

    test('should be possible to click outside of the combobox which should close the combobox', async () => {
      await render(hbs`
        <Combobox 
          @value="b"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="a">Option 1</options.Option>
            <options.Option @value="b">Option 2</options.Option>
            <options.Option @value="c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
        <div id="after" tabIndex="-1" data-test-focusable>
          after
        </div>
      `);

      // Open combobox
      await click(getComboboxButton());
      assertComboboxList({ state: ComboboxState.Visible });
      await assertActiveElement(getComboboxInput());

      // Click something that is not related to the combobox
      await click(document.querySelector('#after'));

      // Should be closed now
      assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

      // Verify the button is focused
      await assertActiveElement(document.querySelector('#after'));
    });

    test('should be possible to click outside of the combobox on another combobox button which should close the current combobox and open the new combobox', async function (assert) {
      await render(hbs`
        <Combobox 
          @value="b"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="a">Option 1</options.Option>
            <options.Option @value="b">Option 2</options.Option>
            <options.Option @value="c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>

        <Combobox 
          @value="b"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="a">Option 1</options.Option>
            <options.Option @value="b">Option 2</options.Option>
            <options.Option @value="c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      let [button1, button2] = getComboboxButtons();

      // Click the first combobox button
      await click(button1);
      assert.strictEqual(getComboboxes().length, 1);

      // Verify that the first input is focused
      await assertActiveElement(getComboboxInputs()[0]);

      // Click the second combobox button
      await click(button2);

      assert.strictEqual(getComboboxes().length, 1); // Only 1 combobox should be visible

      // Verify that the first input is focused
      await assertActiveElement(getComboboxInputs()[1]);
    });

    test('should be possible to click outside of the combobox which should close the combobox (even if we press the combobox button)', async () => {
      await render(hbs`
        <Combobox 
          @value="b"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="a">Option 1</options.Option>
            <options.Option @value="b">Option 2</options.Option>
            <options.Option @value="c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());
      assertComboboxList({ state: ComboboxState.Visible });
      await assertActiveElement(getComboboxInput());

      // Click the combobox button again
      await click(getComboboxButton());

      // Should be closed now
      assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

      // Verify the input is focused again
      await assertActiveElement(getComboboxInput());
    });

    test('should be possible to click outside of the combobox, on an element which is within a focusable element, which closes the combobox', async function (assert) {
      let callCount = 0;

      this.set('focusFn', () => {
        callCount++;
      });

      await render(hbs`
        <div>
          <Combobox 
            @value="b"
            as |combobox|
          >
            <combobox.Input onFocus={{this.focusFn}} />
            <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
            <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
              <options.Option @value="a">Option 1</options.Option>
              <options.Option @value="b">Option 2</options.Option>
              <options.Option @value="c">Option 3</options.Option>
            </combobox.Options>
          </Combobox>

          <button id="btn">
            <span>Next</span>
          </button>
        </div>
      `);

      // Click the combobox button
      await click(getComboboxButton());

      // Ensure the combobox is open
      assertComboboxList({ state: ComboboxState.Visible });

      // Click the span inside the button
      await click(document.getElementById('btn'));

      // Ensure the combobox is closed
      assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

      // Ensure the outside button is focused
      await assertActiveElement(document.getElementById('btn'));

      // Ensure that the focus button only got focus once (first click)
      assert.strictEqual(callCount, 1, 'focusFn called once exactly');
    });

    test('should be possible to hover an option and make it active', async () => {
      await render(hbs`
        <Combobox 
          @value="test"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="a">Option 1</options.Option>
            <options.Option @value="b">Option 2</options.Option>
            <options.Option @value="c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());

      let options = getComboboxOptions();
      // We should be able to go to the second option
      await triggerEvent(options[1], 'mouseover');
      assertActiveComboboxOption(options[1]);

      // We should be able to go to the first option
      await triggerEvent(options[0], 'mouseover');
      assertActiveComboboxOption(options[0]);

      // We should be able to go to the last option
      await triggerEvent(options[2], 'mouseover');
      assertActiveComboboxOption(options[2]);
    });

    todo(
      'should be possible to hover an option and make it active when using `static`',
      () => {}
    );

    test('should make a combobox option active when you move the mouse over it', async () => {
      await render(hbs`
        <Combobox 
          @value="test"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="a">Option 1</options.Option>
            <options.Option @value="b">Option 2</options.Option>
            <options.Option @value="c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());

      let options = getComboboxOptions();

      // We should be able to go to the second option
      await triggerEvent(options[1], 'mouseover');
      assertActiveComboboxOption(options[1]);
    });

    test('should be a no-op when we move the mouse and the combobox option is already active', async () => {
      await render(hbs`
        <Combobox 
          @value="test"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="a">Option 1</options.Option>
            <options.Option @value="b">Option 2</options.Option>
            <options.Option @value="c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());

      let options = getComboboxOptions();

      // We should be able to go to the second option
      await triggerEvent(options[1], 'mouseover');
      assertActiveComboboxOption(options[1]);

      await triggerEvent(options[1], 'mouseover');

      // Nothing should be changed
      assertActiveComboboxOption(options[1]);
    });

    test('should be a no-op when we move the mouse and the combobox option is disabled', async () => {
      await render(hbs`
        <Combobox 
          @value="test"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="a">Option 1</options.Option>
            <options.Option @value="b" @disabled={{true}}>Option 2</options.Option>
            <options.Option @value="c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());

      let options = getComboboxOptions();

      await triggerEvent(options[1], 'mouseover');
      assertNotActiveComboboxOption(options[1]);
    });

    test('should not be possible to hover an option that is disabled', async () => {
      await render(hbs`
        <Combobox 
          @value="test"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="a">Option 1</options.Option>
            <options.Option @value="b" @disabled={{true}}>Option 2</options.Option>
            <options.Option @value="c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());

      let options = getComboboxOptions();

      // Try to hover over option 1, which is disabled
      await triggerEvent(options[1], 'mouseover');

      // We should not have option 1 as the active option now
      assertNotActiveComboboxOption(options[1]);
    });

    test('should be possible to mouse leave an option and make it inactive', async () => {
      await render(hbs`
        <Combobox 
          @value="test"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="a">Option 1</options.Option>
            <options.Option @value="b">Option 2</options.Option>
            <options.Option @value="c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());

      let options = getComboboxOptions();

      // We should be able to go to the second option
      await triggerEvent(options[1], 'mouseover');
      assertActiveComboboxOption(options[1]);

      await triggerEvent(options[1], 'mouseout');
      assertNoActiveComboboxOption();

      // We should be able to go to the first option
      await triggerEvent(options[0], 'mouseover');
      assertActiveComboboxOption(options[0]);

      await triggerEvent(options[0], 'mouseout');
      assertNoActiveComboboxOption();

      // We should be able to go to the last option
      await triggerEvent(options[2], 'mouseover');
      assertActiveComboboxOption(options[2]);

      await triggerEvent(options[2], 'mouseout');
      assertNoActiveComboboxOption();
    });

    test('should be possible to mouse leave a disabled option and be a no-op', async () => {
      await render(hbs`
        <Combobox 
          @value="test"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="a">Option 1</options.Option>
            <options.Option @value="b" @disabled={{true}}>Option 2</options.Option>
            <options.Option @value="c">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());

      let options = getComboboxOptions();

      // Try to hover over option 1, which is disabled
      await triggerEvent(options[1], 'mouseover');
      assertNotActiveComboboxOption(options[1]);

      await triggerEvent(options[1], 'mouseout');
      assertNotActiveComboboxOption(options[1]);
    });

    test('should be possible to click a combobox option, which closes the combobox', async function (assert) {
      let callValue = '',
        callCount = 0;

      this.set('onChange', (value) => {
        this.set('selectedOption', value);
        callValue = value;
        callCount++;
      });

      await render(hbs`
        <Combobox 
          @value={{this.selectedOption}}
          @onChange={{this.onChange}}
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="alice">Option 1</options.Option>
            <options.Option @value="bob">Option 2</options.Option>
            <options.Option @value="charlie">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());
      assertComboboxList({ state: ComboboxState.Visible });
      await assertActiveElement(getComboboxInput());

      let options = getComboboxOptions();

      // We should be able to click the first option
      await click(options[1]);
      assertComboboxList({ state: ComboboxState.InvisibleUnmounted });
      assert.strictEqual(callCount, 1, 'handleChange called once exactly');
      assert.strictEqual(callValue, 'bob', 'handleChange called with "bob"');

      // Verify the input is focused again
      await assertActiveElement(getComboboxInput());

      // Open combobox again
      await click(getComboboxButton());

      // Verify the active option is the previously selected one
      assertActiveComboboxOption(getComboboxOptions()[1]);
    });

    test('should be possible to click a disabled combobox option, which is a no-op', async function (assert) {
      let callCount = 0;

      this.set('onChange', (value) => {
        this.set('selectedOption', value);
        callCount++;
      });

      await render(hbs`
        <Combobox 
          @value={{this.selectedOption}}
          @onChange={{this.onChange}}
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="alice">Option 1</options.Option>
            <options.Option @value="bob" @disabled={{true}}>Option 2</options.Option>
            <options.Option @value="charlie">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());
      assertComboboxList({ state: ComboboxState.Visible });
      await assertActiveElement(getComboboxInput());

      let options = getComboboxOptions();

      // We should not be able to click the disabled option
      await click(options[1]);
      assertComboboxList({ state: ComboboxState.Visible });
      assertNotActiveComboboxOption(options[1]);
      await assertActiveElement(getComboboxInput());
      assert.strictEqual(callCount, 0, 'onChange not called');

      // Close the combobox
      await click(getComboboxButton());

      // Open combobox again
      await click(getComboboxButton());

      options = getComboboxOptions();

      // Verify the active option is not the disabled one
      assertNotActiveComboboxOption(options[1]);
    });

    test('should be possible focus a combobox option, so that it becomes active', async () => {
      await render(hbs`
        <Combobox 
          @value={{this.selectedOption}}
          @onChange={{this.onChange}}
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="alice">Option 1</options.Option>
            <options.Option @value="bob">Option 2</options.Option>
            <options.Option @value="charlie">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());
      assertComboboxList({ state: ComboboxState.Visible });
      await assertActiveElement(getComboboxInput());

      let options = getComboboxOptions();

      // Verify that the first item is active
      assertActiveComboboxOption(options[0]);

      // We should be able to focus the second option
      await focus(options[1]);
      assertActiveComboboxOption(options[1]);
    });

    test('should not be possible to focus a combobox option which is disabled', async () => {
      await render(hbs`
        <Combobox 
          @value={{this.selectedOption}}
          @onChange={{this.onChange}}
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
            <options.Option @value="alice">Option 1</options.Option>
            <options.Option @value="bob" @disabled={{true}}>Option 2</options.Option>
            <options.Option @value="charlie">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());
      assertComboboxList({ state: ComboboxState.Visible });
      await assertActiveElement(getComboboxInput());

      let options = getComboboxOptions();

      try {
        // We should not be able to focus the first option
        await focus(options[1]);
      } catch {
        // `focus` test helper errors because this element is not focusable
        // we ignore the error
      }
      assertNotActiveComboboxOption(options[1]);
    });

    test('should be possible to hold the last active option', async () => {
      await render(hbs`
        <Combobox 
          @value="test"
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options 
            @hold={{true}}
            data-test="headlessui-combobox-options-3" 
            as |options|
          >
            <options.Option @value="alice">Option 1</options.Option>
            <options.Option @value="bob">Option 2</options.Option>
            <options.Option @value="charlie">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      assertComboboxButton({
        state: ComboboxState.InvisibleUnmounted,
        attributes: { 'data-test': 'headlessui-combobox-button-2' },
      });
      assertComboboxList({ state: ComboboxState.InvisibleUnmounted });

      await click(getComboboxButton());

      assertComboboxButton({
        state: ComboboxState.Visible,
        attributes: { 'data-test': 'headlessui-combobox-button-2' },
      });
      assertComboboxList({ state: ComboboxState.Visible });

      let options = getComboboxOptions();

      // Hover the first item
      await triggerEvent(options[0], 'mouseover');

      // Verify that the first combobox option is active
      assertActiveComboboxOption(options[0]);

      // Focus the second item
      await triggerEvent(options[1], 'mouseover');

      // Verify that the second combobox option is active
      assertActiveComboboxOption(options[1]);

      // Move the mouse off of the second combobox option
      await triggerEvent(options[1], 'mouseout');
      await triggerEvent(document.body, 'mouseover');

      // Verify that the second combobox option is still active
      assertActiveComboboxOption(options[1]);
    });

    test('should sync the input field correctly and reset it when resetting the value from outside', async function (assert) {
      this.set('selectedOption', 'bob');

      this.set('reset', () => {
        this.set('selectedOption', '');
      });

      await render(hbs`
        <Combobox 
          @value={{this.selectedOption}}
          as |combobox|
        >
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options 
            data-test="headlessui-combobox-options-3" 
            as |options|
          >
            <options.Option @value="alice">Option 1</options.Option>
            <options.Option @value="bob">Option 2</options.Option>
            <options.Option @value="charlie">Option 3</options.Option>
          </combobox.Options>
        </Combobox>
        <button id="btn" onClick={{this.reset}}>reset</button>
      `);

      // Open combobox
      await click(getComboboxButton());

      // Verify the input has the selected value
      assert.dom(getComboboxInput()).hasValue('bob');

      // Override the input by typing something
      getComboboxInput().value = '';
      await typeIn(getComboboxInput(), 'test');
      assert.dom(getComboboxInput()).hasValue('test');

      // Reset from outside
      await click(document.getElementById('btn'));

      // Verify the input is reset correctly
      assert.dom(getComboboxInput()).hasValue('');
    });

    test('should sync the input field correctly and reset it when resetting the value from outside (when using displayValue)', async function (assert) {
      this.set('reset', () => {
        this.set('value', null);
      });

      await renderWithPeople(
        this,
        [
          { value: 'alice', name: 'Alice', disabled: false },
          { value: 'bob', name: 'Bob', disabled: false, selected: true },
          { value: 'charlie', name: 'Charlie', disabled: false },
        ],
        hbs`
          <Combobox 
            @value={{this.value}}
            as |combobox|
          >
            <combobox.Input @onChange={{this.setQuery}} @displayValue={{this.displayValue}}/>
            <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
            <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
              {{#each this.filteredPeople as |person|}}
                <options.Option 
                  @value={{person.value}} 
                  @disabled={{person.disabled}}
                >
                  {{person.name}}
                </options.Option>
              {{/each}}
            </combobox.Options>
          </Combobox>
          <button id="btn" onClick={{this.reset}}>reset</button>
        `
      );

      // Open combobox
      await click(getComboboxButton());

      // Verify the input has the selected value
      assert.dom(getComboboxInput()).hasValue('Bob');

      // Override the input by typing something
      getComboboxInput().value = '';
      await typeIn(getComboboxInput(), 'test');
      assert.dom(getComboboxInput()).hasValue('test');

      // Reset from outside
      await click(document.getElementById('btn'));

      // Verify the input is reset correctly
      assert.dom(getComboboxInput()).hasValue('');
    });
  });

  module('Multi-select', () => {
    test('should be possible to pass multiple values to the Combobox component', async () => {
      await render(hbs`
        <Combobox 
          @value={{array "bob" "charlie"}}
          as |combobox|
        >
          <combobox.Label>Label</combobox.Label/>
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options as |options|>
            <options.Option @value="alice">Alice</options.Option>
            <options.Option @value="bob">Bob</options.Option>
            <options.Option @value="charlie">Charlie</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());

      // Verify that we have an open combobox with multiple mode
      assertCombobox({
        state: ComboboxState.Visible,
        mode: ComboboxMode.Multiple,
      });

      // Verify that we have multiple selected combobox options
      let options = getComboboxOptions();

      assertComboboxOption({ selected: false }, options[0]);
      assertComboboxOption({ selected: true }, options[1]);
      assertComboboxOption({ selected: true }, options[2]);
    });

    test('should make the first selected option the active item', async () => {
      await render(hbs`
        <Combobox 
          @value={{array "bob" "charlie"}}
          as |combobox|
        >
          <combobox.Label>Label</combobox.Label/>
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options as |options|>
            <options.Option @value="alice">Alice</options.Option>
            <options.Option @value="bob">Bob</options.Option>
            <options.Option @value="charlie">Charlie</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());

      // Verify that bob is the active option
      assertActiveComboboxOption(getComboboxOptions()[1]);
    });

    test('should keep the combobox open when selecting an item via the keyboard', async () => {
      await render(hbs`
        <Combobox 
          @value={{array "bob" "charlie"}}
          as |combobox|
        >
          <combobox.Label>Label</combobox.Label/>
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options as |options|>
            <options.Option @value="alice">Alice</options.Option>
            <options.Option @value="bob">Bob</options.Option>
            <options.Option @value="charlie">Charlie</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());
      assertCombobox({ state: ComboboxState.Visible });

      // Verify that bob is the active option
      await click(getComboboxOptions()[0]);

      // Verify that the combobox is still open
      assertCombobox({ state: ComboboxState.Visible });
    });

    test('should toggle the selected state of an option when clicking on it', async () => {
      await render(hbs`
        <Combobox 
          @value={{array "bob" "charlie"}}
          as |combobox|
        >
          <combobox.Label>Label</combobox.Label/>
          <combobox.Input/>
          <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
          <combobox.Options as |options|>
            <options.Option @value="alice">Alice</options.Option>
            <options.Option @value="bob">Bob</options.Option>
            <options.Option @value="charlie">Charlie</options.Option>
          </combobox.Options>
        </Combobox>
      `);

      // Open combobox
      await click(getComboboxButton());
      assertCombobox({ state: ComboboxState.Visible });

      let options = getComboboxOptions();

      assertComboboxOption({ selected: false }, options[0]);
      assertComboboxOption({ selected: true }, options[1]);
      assertComboboxOption({ selected: true }, options[2]);

      // Click on bob
      await click(getComboboxOptions()[1]);

      assertComboboxOption({ selected: false }, options[0]);
      assertComboboxOption({ selected: false }, options[1]);
      assertComboboxOption({ selected: true }, options[2]);

      // Click on bob again
      await click(getComboboxOptions()[1]);

      assertComboboxOption({ selected: false }, options[0]);
      assertComboboxOption({ selected: true }, options[1]);
      assertComboboxOption({ selected: true }, options[2]);
    });
  });

  module('Form compatibility', () => {
    test('should be possible to submit a form with a value', async function (assert) {
      let callValue = '';

      this.set('selectedOption', null);

      this.set('onChange', (value) => {
        this.set('selectedOption', value);
      });

      this.set('onSubmit', (event) => {
        event.preventDefault();
        callValue = [
          ...new FormData(
            document.querySelector('[data-test-combobox-form]')
          ).entries(),
        ];
      });

      await render(hbs`
        <form 
          data-test-combobox-form
          {{on "submit" this.onSubmit}} 
        >
          <Combobox 
            @value={{this.selectedOption}}
            @onChange={{this.onChange}}
            @name="delivery"
            as |combobox|
          >
            <combobox.Input/>
            <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
            <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
              <options.Option data-test-pickup @value="pickup">Pickup</options.Option>
              <options.Option data-test-home-delivery @value="home-delivery">Home delivery</options.Option>
              <options.Option @value="dine-in">Dine in</options.Option>
            </combobox.Options>
          </Combobox>
          <button type="submit">Submit</button>
        </form>
      `);

      // Open combobox
      await click(getComboboxButton());

      // Submit the form
      await click(
        document.querySelector('[data-test-combobox-form] [type="submit"]')
      );

      // Verify that the form has been submitted
      assert.deepEqual(
        callValue,
        [['delivery', '']],
        'onSubmit called with no data'
      ); // no data
      // TODO this doesn't match the react test result

      // Open combobox again
      await click(getComboboxButton());

      // Choose home delivery
      await click(document.querySelector('[data-test-home-delivery]'));

      // Submit the form again
      await click(
        document.querySelector('[data-test-combobox-form] [type="submit"]')
      );

      // Verify that the form has been submitted
      assert.deepEqual(
        callValue,
        [['delivery', 'home-delivery']],
        'onSubmit called with form data'
      );

      // Open combobox again
      await click(getComboboxButton());

      // Choose pickup
      await click(document.querySelector('[data-test-pickup]'));

      // Submit the form again
      await click(
        document.querySelector('[data-test-combobox-form] [type="submit"]')
      );

      // Verify that the form has been submitted
      assert.deepEqual(
        callValue,
        [['delivery', 'pickup']],
        'onSubmit called with form data'
      );
    });

    skip('should be possible to submit a form with a complex value object', async function (assert) {
      let callValue = '';

      this.set('onSubmit', (event) => {
        event.preventDefault();
        callValue = [
          ...new FormData(
            document.querySelector('[data-test-combobox-form]')
          ).entries(),
        ];
      });

      // TODO rename renderWithPeople - the function name makes no sense with this data

      await renderWithPeople(
        this,
        [
          {
            id: 1,
            value: 'pickup',
            name: 'Pickup',
            extra: { info: 'Some extra info' },
            selected: true,
          },
          {
            id: 2,
            value: 'home-delivery',
            name: 'Home delivery',
            extra: { info: 'Some extra info' },
          },
          {
            id: 3,
            value: 'dine-in',
            name: 'Dine in',
            extra: { info: 'Some extra info' },
          },
        ],
        hbs`
        <form 
          data-test-combobox-form
          {{on "submit" this.onSubmit}} 
        >
          <Combobox 
            @name="delivery"
            @value={{this.value}}
            as |combobox|
          >
            <combobox.Input @onChange={{this.setQuery}}/>
            <combobox.Button data-test="headlessui-combobox-button-2">Trigger</combobox.Button>
            <combobox.Options data-test="headlessui-combobox-options-3" as |options|>
              {{#each this.filteredPeople as |person|}}
                <options.Option 
                  @value={{person}} 
                  @disabled={{person.disabled}}
                >
                  {{person.name}}
                </options.Option>
              {{/each}}
            </combobox.Options>
          </Combobox>
          <button type="submit" data-test-submit>reset</button>
        </form>
      `
      );

      // Open combobox
      await click(getComboboxButton());

      // Submit the form
      await click(document.querySelector('[data-test-submit]'));

      // Verify that the form has been submitted
      assert.deepEqual(callValue, [
        ['delivery[id]', '1'],
        ['delivery[value]', 'pickup'],
        ['delivery[label]', 'Pickup'],
        ['delivery[extra][info]', 'Some extra info'],
      ]);

      // Open combobox
      await click(getComboboxButton());

      // Choose home delivery
      await click(getComboboxOptions()[0]);

      // Submit the form again
      await click(document.querySelector('[data-test-submit]'));

      // Verify that the form has been submitted
      assert.deepEqual(callValue, [
        ['delivery[id]', '2'],
        ['delivery[value]', 'home-delivery'],
        ['delivery[label]', 'Home delivery'],
        ['delivery[extra][info]', 'Some extra info'],
      ]);

      // Open combobox
      await click(getComboboxButton());

      // Choose pickup
      await click(getComboboxOptions()[1]);

      // Submit the form again
      await click(document.querySelector('[data-test-submit]'));

      // Verify that the form has been submitted
      assert.deepEqual(callValue, [
        ['delivery[id]', '1'],
        ['delivery[value]', 'pickup'],
        ['delivery[label]', 'Pickup'],
        ['delivery[extra][info]', 'Some extra info'],
      ]);
    });
  });
});
