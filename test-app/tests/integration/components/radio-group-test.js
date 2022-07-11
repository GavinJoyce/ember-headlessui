import {
  click,
  focus,
  render,
  setupOnerror,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import userEvent from '@testing-library/user-event';
import { Keys } from 'ember-headlessui/utils/keyboard';

import {
  assertActiveElement,
  assertFocusable,
  assertNotFocusable,
  assertRadioGroupLabel,
  getByText,
  getRadioGroupOptions,
} from '../../accessibility-assertions';

module('Integration | Component | radio-group', function (hooks) {
  setupRenderingTest(hooks);

  module('Safe guards', function () {
    test('should error when we are using a <RadioGroup::-Option /> without a parent <RadioGroup />', async function (assert) {
      assert.expect(1);

      setupOnerror(function (err) {
        assert.strictEqual(
          err.message,
          '<RadioGroup::-Option /> is missing a parent <RadioGroup /> component.',
          'Throw initialization error'
        );
      });

      await render(hbs`<RadioGroup::-Option />`);
    });

    test('should be possible to render a RadioGroup without crashing', async function () {
      await render(hbs`
        <RadioGroup @value='pizza-delivery' @onChange={{console.log}} as |RadioGroup|>
          <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
          <RadioGroup.Option @value="pickup">Pickup</RadioGroup.Option>
          <RadioGroup.Option @value="home-delivery">Home delivery</RadioGroup.Option>
          <RadioGroup.Option @value="dine-in">Dine in</RadioGroup.Option>
        </RadioGroup>
      `);

      assertRadioGroupLabel({ textContent: 'Pizza Delivery' });
    });

    test('should be possible to render a RadioGroup without options and without crashing', async function (assert) {
      await render(
        hbs`<RadioGroup @value={{undefined}} @onChange={{console.log}} />`
      );

      assert.dom('[data-test-radio-group]').exists();
    });
  });

  module('Rendering', function () {
    test('should be possible to render a RadioGroup, where the first element is tabbable (value is undefined)', async function (assert) {
      await render(hbs`
          <RadioGroup @value={{undefined}} @onChange={{console.log}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value="pickup">Pickup</RadioGroup.Option>
            <RadioGroup.Option @value="home-delivery">Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value="dine-in">Dine in</RadioGroup.Option>
          </RadioGroup>
        `);

      assert.strictEqual(getRadioGroupOptions().length, 3);

      await assertFocusable(getByText('Pickup'));
      await assertNotFocusable(getByText('Home delivery'));
      await assertNotFocusable(getByText('Dine in'));
    });

    test('should be possible to render a RadioGroup, where the first element is tabbable (value is null)', async function (assert) {
      await render(hbs`
          <RadioGroup @value={{null}} @onChange={{console.log}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value="pickup">Pickup</RadioGroup.Option>
            <RadioGroup.Option @value="home-delivery">Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value="dine-in">Dine in</RadioGroup.Option>
          </RadioGroup>
        `);

      assert.strictEqual(getRadioGroupOptions().length, 3);

      await assertFocusable(getByText('Pickup'));
      await assertNotFocusable(getByText('Home delivery'));
      await assertNotFocusable(getByText('Dine in'));
    });

    test('should be possible to render a RadioGroup with an active value', async function (assert) {
      await render(hbs`
          <RadioGroup @value='home-delivery' @onChange={{console.log}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value="pickup">Pickup</RadioGroup.Option>
            <RadioGroup.Option @value="home-delivery">Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value="dine-in">Dine in</RadioGroup.Option>
          </RadioGroup>
        `);

      assert.strictEqual(getRadioGroupOptions().length, 3);

      await assertNotFocusable(getByText('Pickup'));
      await assertFocusable(getByText('Home delivery'));
      await assertNotFocusable(getByText('Dine in'));
    });

    test('should guarantee the radio option order after a few unmounts', async function () {
      await render(hbs`
        <button>Toggle</button>
        <RadioGroup @value={{undefined}} @onChange={{console.log}} as |RadioGroup|>
          <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
          <RadioGroup.Option @value="pickup">Pickup</RadioGroup.Option>
          <RadioGroup.Option @value="home-delivery">Home delivery</RadioGroup.Option>
          <RadioGroup.Option @value="dine-in">Dine in</RadioGroup.Option>
        </RadioGroup>
      `);

      await click(getByText('Toggle'));

      // Focus first element
      userEvent.tab();
      await assertActiveElement(
        getByText('Pickup'),
        'the first element is active'
      );

      // Loop around
      await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowUp);
      await assertActiveElement(getByText('Dine in'));

      // Up again
      await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowUp);
      await assertActiveElement(getByText('Home delivery'));
    });

    test('should be possible to disable a RadioGroup', async function (assert) {
      this.set('isDisabled', true);
      this.set('setDisabled', () => {
        let boolean = this.isDisabled === true ? false : true;
        this.set('isDisabled', boolean);
      });

      let callCount = 0;

      this.set('onChange', () => {
        callCount++;
      });

      await render(hbs`
          <button onClick={{setDisabled}}>Toggle</button>
          <RadioGroup @value={{undefined}} @onChange={{onChange}} @disabled={{isDisabled}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value="pickup">Pickup</RadioGroup.Option>
            <RadioGroup.Option @value="home-delivery">Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value="dine-in">Dine in</RadioGroup.Option>
          </RadioGroup>
        `);

      // Try to click one a few options
      await click(getByText('Pickup'));
      await click(getByText('Dine in'));

      assert.strictEqual(callCount, 0, 'the onChange handler never got called');

      let options = getRadioGroupOptions();
      assert.strictEqual(options.length, 3);

      for (let option of options)
        assert.dom(option).hasAttribute('aria-disabled');

      // Toggle the disabled state
      await click(getByText('Toggle'));

      // Try to click one a few options
      await click(getByText('Pickup'));

      assert.strictEqual(callCount, 1, 'the onChange handler was called once');
    });

    test('should be possible to disable a RadioGroup.Option', async function (assert) {
      this.set('isDisabled', true);
      this.set('setDisabled', () => {
        let boolean = this.isDisabled === true ? false : true;
        this.set('isDisabled', boolean);
      });

      let callCount = 0;

      this.set('onChange', () => {
        callCount++;
      });

      await render(hbs`
          <button onClick={{setDisabled}}>Toggle</button>
          <RadioGroup @value={{undefined}} @onChange={{onChange}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value="pickup">Pickup</RadioGroup.Option>
            <RadioGroup.Option @value="home-delivery">Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value="dine-in" @disabled={{isDisabled}}>Dine in</RadioGroup.Option>
          </RadioGroup>
        `);

      await click(getByText('Dine in'));

      assert.strictEqual(callCount, 0, 'the onChange handler never got called');

      let options = getRadioGroupOptions();
      assert.strictEqual(options.length, 3);

      for (let option of options) {
        if (option === getByText('Dine in')) {
          assert.dom(option).hasAttribute('aria-disabled');
        } else {
          assert.dom(option).doesNotHaveAttribute('aria-disabled');
        }
      }

      // Toggle the disabled state
      await click(getByText('Toggle'));

      // Try to click one a few options
      await click(getByText('Dine in'));

      assert.strictEqual(callCount, 1, 'the onChange handler was called once');
    });
  });

  module('Keyboard interactions', () => {
    module('`Tab` key', () => {
      test('should be possible to tab to the first item', async () => {
        await render(hbs`
         <button>Before</button>
         <RadioGroup as |RadioGroup|>
           <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
           <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
           <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
           <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
         </RadioGroup>
       `);
        await focus(getByText('Before'));

        userEvent.tab();

        await assertActiveElement(getByText('Pickup'));
      });

      test('should not change the selected element on focus', async function (assert) {
        let callCount = 0;

        this.set('onChange', () => {
          callCount++;
        });

        await render(hbs`
           <button>Before</button>
          <RadioGroup @onChange={{onChange}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
        `);

        await focus(getByText('Before'));

        userEvent.tab();

        await assertActiveElement(getByText('Pickup'));

        assert.strictEqual(
          callCount,
          0,
          'the onChange handler never got called'
        );
      });

      test('should not change the selected element on focus (when selecting the active item)', async function (assert) {
        let callCount = 0;

        this.set('onChange', () => {
          callCount++;
        });

        this.set('value', 'home-delivery');

        await render(hbs`
          <button>Before</button>
          <RadioGroup @value={{value}} @onChange={{onChange}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
        `);

        await focus(getByText('Before'));

        userEvent.tab();

        await assertActiveElement(getByText('Home delivery'));

        assert.strictEqual(
          callCount,
          0,
          'the onChange handler never got called'
        );
        assert.strictEqual(this.value, 'home-delivery');
      });

      test('should be possible to tab out of the radio group (no selected value)', async () => {
        await render(hbs`
          <button>Before</button>
          <RadioGroup as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
          <button>After</button>
        `);

        await focus(getByText('Before'));

        userEvent.tab();

        await assertActiveElement(getByText('Pickup'));

        userEvent.tab();
        await assertActiveElement(getByText('After'));
      });

      test('should be possible to tab out of the radio group (selected value)', async () => {
        await render(hbs`
          <button>Before</button>
          <RadioGroup @value="home-delivery" as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
          <button>After</button>
        `);

        await focus(getByText('Before'));

        userEvent.tab();

        await assertActiveElement(getByText('Home delivery'));

        userEvent.tab();
        await assertActiveElement(getByText('After'));
      });
    });

    module('`Shift+Tab` key', () => {
      test('should be possible to tab to the first item', async () => {
        await render(hbs`
          <RadioGroup @value={{undefined}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
          <button>After</button>
        `);

        await focus(getByText('After'));

        userEvent.tab({ shift: true });

        await assertActiveElement(getByText('Pickup'));
      });

      test('should not change the selected element on focus', async function (assert) {
        let callCount = 0;

        this.set('onChange', () => {
          callCount++;
        });

        await render(hbs`
          <RadioGroup @value={{undefined}} @onChange={{onChange}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
          <button>After</button>
        `);

        await focus(getByText('After'));

        userEvent.tab({ shift: true });

        await assertActiveElement(getByText('Pickup'));

        assert.strictEqual(
          callCount,
          0,
          'the onChange handler never got called'
        );
      });

      test('should be possible to tab to the active item', async () => {
        await render(hbs`
          <RadioGroup @value='home-delivery' @onChange={{console.log}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
          <button>After</button>
        `);

        await focus(getByText('After'));

        userEvent.tab({ shift: true });

        await assertActiveElement(getByText('Home delivery'));
      });

      test('should not change the selected element on focus (when selecting the active item)', async function (assert) {
        let callCount = 0;

        this.set('onChange', () => {
          callCount++;
        });

        await render(hbs`
            <RadioGroup @value='home-delivery' @onChange={{onChange}} as |RadioGroup|>
              <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
              <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
              <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
              <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
            </RadioGroup>
            <button>After</button>
          `);

        await focus(getByText('After'));

        userEvent.tab({ shift: true });

        await assertActiveElement(getByText('Home delivery'));

        assert.strictEqual(
          callCount,
          0,
          'the onChange handler never got called'
        );
      });

      test('should be possible to tab out of the radio group (no selected value)', async () => {
        await render(hbs`
            <button>Before</button>
            <RadioGroup @value={{undefined}} @onChange={{console.log}} as |RadioGroup|>
              <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
              <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
              <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
              <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
            </RadioGroup>
            <button>After</button>
          `);

        await focus(getByText('After'));

        userEvent.tab({ shift: true });
        await assertActiveElement(getByText('Pickup'));

        userEvent.tab({ shift: true });
        await assertActiveElement(getByText('Before'));
      });

      test('should be possible to tab out of the radio group (selected value)', async () => {
        await render(hbs`
          <button>Before</button>
          <RadioGroup @value='home-delivery' @onChange={{console.log}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
          <button>After</button>
        `);

        await focus(getByText('After'));

        userEvent.tab({ shift: true });
        await assertActiveElement(getByText('Home delivery'));

        userEvent.tab({ shift: true });
        await assertActiveElement(getByText('Before'));
      });
    });

    module('`ArrowLeft` key', function () {
      test('should go to the previous item when pressing the ArrowLeft key', async function (assert) {
        let callCount = 0;

        this.set('onChange', () => {
          callCount++;
        });

        await render(hbs`
          <button>Before</button>
          <RadioGroup @value={{undefined}} @onChange={{onChange}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
        `);

        // Focus the "Before" button
        await focus(getByText('Before'));

        // Focus the RadioGroup
        userEvent.tab();

        await assertActiveElement(getByText('Pickup'));

        // Loop around
        await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowLeft);
        await assertActiveElement(getByText('Dine in'));

        await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowLeft);
        await assertActiveElement(getByText('Home delivery'));

        assert.strictEqual(
          callCount,
          2,
          'the onChange handler got called twice'
        );
      });
    });

    module('`ArrowUp` key', function () {
      test('should go to the previous item when pressing the ArrowLeft key', async function (assert) {
        let callCount = 0;

        this.set('onChange', () => {
          callCount++;
        });

        await render(hbs`
          <button>Before</button>
          <RadioGroup @value={{undefined}} @onChange={{onChange}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
        `);

        // Focus the "Before" button
        await focus(getByText('Before'));

        // Focus the RadioGroup
        userEvent.tab();

        await assertActiveElement(getByText('Pickup'));

        // Loop around
        await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowUp);
        await assertActiveElement(getByText('Dine in'));

        await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowUp);
        await assertActiveElement(getByText('Home delivery'));

        assert.strictEqual(
          callCount,
          2,
          'the onChange handler got called twice'
        );
      });
    });

    module('`ArrowRight` key', function () {
      test('should go to the next item when pressing the ArrowRight key', async function (assert) {
        let callCount = 0;

        this.set('onChange', () => {
          callCount++;
        });

        await render(hbs`
          <button>Before</button>
          <RadioGroup @value={{undefined}} @onChange={{onChange}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
        `);

        // Focus the "Before" button
        await focus(getByText('Before'));

        // Focus the RadioGroup
        userEvent.tab();

        await assertActiveElement(getByText('Pickup'));

        await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowRight);
        await assertActiveElement(getByText('Home delivery'));

        await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowRight);
        await assertActiveElement(getByText('Dine in'));

        //Loop aruond
        await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowRight);
        await assertActiveElement(getByText('Pickup'));

        assert.strictEqual(
          callCount,
          3,
          'the onChange handler was called three times'
        );
      });
    });

    module('`ArrowDown` key', function () {
      test('should go to the next item when pressing the ArrowDown key', async function (assert) {
        let callCount = 0;

        this.set('onChange', () => {
          callCount++;
        });

        await render(hbs`
          <button>Before</button>
          <RadioGroup @value={{undefined}} @onChange={{this.onChange}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
        `);

        // Focus the "Before" button
        await focus(getByText('Before'));

        // Focus the RadioGroup
        userEvent.tab();

        await assertActiveElement(getByText('Pickup'));

        await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowDown);
        await assertActiveElement(getByText('Home delivery'));

        await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowDown);
        await assertActiveElement(getByText('Dine in'));

        // Loop around
        await triggerKeyEvent(document.activeElement, 'keyup', Keys.ArrowDown);
        await assertActiveElement(getByText('Pickup'));

        assert.strictEqual(
          callCount,
          3,
          'the onChange handler was called three times'
        );
      });
    });

    module('`Space` key', function () {
      test('should select the current option when pressing space', async function (assert) {
        let callCount = 0;

        this.set('onChange', () => {
          callCount++;
        });

        await render(hbs`
          <button>Before</button>
          <RadioGroup @value={{undefined}} @onChange={{this.onChange}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
        `);

        // Focus the "Before" button
        await focus(getByText('Before'));

        // Focus the RadioGroup
        userEvent.tab();

        await assertActiveElement(getByText('Pickup'));

        await triggerKeyEvent(document.activeElement, 'keyup', Keys.Space);
        await assertActiveElement(getByText('Pickup'));

        assert.strictEqual(
          callCount,
          1,
          'the onChange handler only got called once'
        );
      });

      test('should select the current option only once when pressing space', async function (assert) {
        let callCount = 0;

        this.set('onChange', () => {
          callCount++;
        });

        await render(hbs`
          <button>Before</button>
          <RadioGroup @value={{value}} @onChange={{onChange}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
        `);

        // Focus the "Before" button
        await focus(getByText('Before'));

        // Focus the RadioGroup
        userEvent.tab();

        await assertActiveElement(getByText('Pickup'));

        await triggerKeyEvent(document.activeElement, 'keyup', Keys.Space);
        await triggerKeyEvent(document.activeElement, 'keyup', Keys.Space);
        await triggerKeyEvent(document.activeElement, 'keyup', Keys.Space);
        await triggerKeyEvent(document.activeElement, 'keyup', Keys.Space);
        await triggerKeyEvent(document.activeElement, 'keyup', Keys.Space);

        await assertActiveElement(getByText('Pickup'));

        assert.strictEqual(
          callCount,
          1,
          'the onChange handler only got called once'
        );
      });
    });
  });

  module('Mouse interactions', function () {
    test('should be possible to change the current radio group value when clicking on a radio option', async () => {
      await render(hbs`
          <button>Before</button>
          <RadioGroup @value={{value}} @onChange={{console.log}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
        `);

      await click(getByText('Home delivery'));

      await assertActiveElement(getByText('Home delivery'));
    });

    test('should be a no-op when clicking on the same item', async function (assert) {
      let callCount = 0;

      this.set('onChange', () => {
        callCount++;
      });

      await render(hbs`
          <button>Before</button>
          <RadioGroup @value={{value}} @onChange={{onChange}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
        `);

      await click(getByText('Home delivery'));
      await click(getByText('Home delivery'));
      await click(getByText('Home delivery'));
      await click(getByText('Home delivery'));

      await assertActiveElement(getByText('Home delivery'));

      assert.strictEqual(
        callCount,
        1,
        'the onChange handler only got called once'
      );
    });
  });

  module('Form compatibility', function () {
    test('should be possible to submit a form with a value', async function (assert) {
      let callValue = '';

      this.set('onSubmit', (event) => {
        callValue = event.target[0].value;
        event.preventDefault();
      });

      await render(hbs`
        <form {{on 'submit' this.onSubmit}}>
          <RadioGroup @value={{null}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            <RadioGroup.Option @value='pickup'>Pickup</RadioGroup.Option>
            <RadioGroup.Option @value='home-delivery'>Home delivery</RadioGroup.Option>
            <RadioGroup.Option @value='dine-in'>Dine in</RadioGroup.Option>
          </RadioGroup>
          <button>Submit</button>
        </form>
      `);

      //Submit the form
      await click(getByText('Submit'));

      // Verify that the form has been submitted
      assert.strictEqual(callValue, ''); // no data

      // Choose home delivery
      await click(getByText('Home delivery'));

      // Submit the form again
      await click(getByText('Submit'));

      // Verify that the form has been submitted
      assert.strictEqual(callValue, 'home-delivery');

      // Choose pickup
      await click(getByText('Pickup'));

      // Submit the form again
      await click(getByText('Submit'));

      // Verify that the form has been submitted
      assert.strictEqual(callValue, 'pickup');
    });

    test('should be possible to submit a form with a complex value object', async function (assert) {
      let callValue = '';

      this.set('onSubmit', (event) => {
        callValue = event.target[0].value;
        event.preventDefault();
      });

      this.set('options', [
        {
          id: 1,
          value: 'pickup',
          label: 'Pickup',
          extra: { info: 'Some extra info' },
        },
        {
          id: 2,
          value: 'home-delivery',
          label: 'Home delivery',
          extra: { info: 'Some extra info' },
        },
        {
          id: 3,
          value: 'dine-in',
          label: 'Dine in',
          extra: { info: 'Some extra info' },
        },
      ]);

      await render(hbs`
        <form {{on 'submit' this.onSubmit}}>
          <RadioGroup @value={{null}} as |RadioGroup|>
            <RadioGroup.Label>Pizza Delivery</RadioGroup.Label>
            {{#each this.options as |option|}}
              <RadioGroup.Option @key={{option.id}} @value={{option.value}}>{{option.label}}</RadioGroup.Option>
            {{/each}}
          </RadioGroup>
          <button>Submit</button>
        </form>
      `);

      //Submit the form
      await click(getByText('Submit'));

      // Verify that the form has been submitted
      assert.strictEqual(callValue, ''); // no data

      // Choose home delivery
      await click(getByText('Home delivery'));

      // Submit the form again
      await click(getByText('Submit'));

      // Verify that the form has been submitted
      assert.strictEqual(callValue, 'home-delivery');

      // Choose pickup
      await click(getByText('Pickup'));

      // Submit the form again
      await click(getByText('Submit'));

      // Verify that the form has been submitted
      assert.strictEqual(callValue, 'pickup');
    });
  });
});
