import { click, render, triggerKeyEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import QUnit, { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

function assertSwitchIsOn(selector = '[data-test-headlessui-switch]') {
  QUnit.assert.dom(selector).hasAttribute('data-test-headlessui-switch-is-on');
  QUnit.assert
    .dom(`${selector} [data-test-headlessui-switch-button]`)
    .hasAttribute('aria-checked', 'true');
}

function assertSwitchIsOff(selector = '[data-test-headlessui-switch]') {
  QUnit.assert
    .dom(selector)
    .doesNotHaveAttribute('data-test-headlessui-switch-is-on');
  QUnit.assert
    .dom(`${selector} [data-test-headlessui-switch-button]`)
    .hasAttribute('aria-checked', 'false');
}

const SwitchState = {
  Off: 0,
  On: 1,
};

function assertSwitchState(
  options,
  selector = '[data-test-headlessui-switch]'
) {
  let assert = QUnit.assert;
  let buttonSelector = `${selector} [data-test-headlessui-switch-button]`;
  let labelSelector = `${selector} [data-test-headlessui-switch-label]`;

  assert.dom(selector).exists(selector);

  assert.dom(buttonSelector).exists(selector);
  assert.dom(buttonSelector).hasAttribute('role', 'switch');
  assert.dom(buttonSelector).hasAttribute('tabindex', '0');

  if (options.buttonTagName) {
    assert.dom(buttonSelector).hasTagName(options.buttonTagName);
  }

  if (options.text) {
    assert.dom(selector).hasText(options.text);
  }

  if (options.labelText) {
    assert.dom(labelSelector).hasText(options.labelText);
  }

  if (options.type) {
    assert.dom(buttonSelector).hasAttribute('type', options.type);
  }

  switch (options.state) {
    case SwitchState.On:
      assertSwitchIsOn(selector);
      break;
    case SwitchState.Off:
      assertSwitchIsOff(selector);
      break;
  }
}

module('Integration | Component | <Switch>', function (hooks) {
  setupRenderingTest(hooks);

  test('it should be possible to render a Switch without crashing', async function () {
    await render(hbs`
      <Switch @isOn={{false}} data-test-switch as |switch|>
        <switch.Button />
      </Switch>
    `);

    assertSwitchState({ state: SwitchState.Off });
  });

  module('Rendering', function () {
    test('it should be possible to render a Switch when @isOn={{true}}', async function (assert) {
      await render(hbs`
        <Switch @isOn={{true}} data-test-switch as |switch|>
          <switch.Label>{{if switch.isOn "On" "Off"}}</switch.Label>
          <switch.Button />
        </Switch>
      `);

      assertSwitchState({
        state: SwitchState.On,
        text: 'On',
        buttonTagName: 'button',
      });
      assert.dom('[data-test-switch]').hasTagName('div');
    });

    test('it should be possible to render a Switch when @isOn={{false}}', async function () {
      await render(hbs`
        <Switch @isOn={{false}} data-test-switch as |switch|>
          <switch.Label>{{if switch.isOn "On" "Off"}}</switch.Label>
          <switch.Button />
        </Switch>
      `);

      assertSwitchState({
        state: SwitchState.Off,
        text: 'Off',
        buttonTagName: 'button',
      });
    });

    test('the button tag name can be customised', async function () {
      await render(hbs`
        <Switch @isOn={{false}} data-test-switch as |switch|>
          <switch.Label>{{if switch.isOn "On" "Off"}}</switch.Label>
          <switch.Button @tagName="span" />
        </Switch>
      `);

      assertSwitchState({
        state: SwitchState.Off,
        text: 'Off',
        buttonTagName: 'span',
      });
    });

    module('`type` attribute', function () {
      test('should set the `type` to "button" by default', async function () {
        await render(hbs`
          <Switch @isOn={{false}} data-test-switch as |switch|>
            <switch.Button />
          </Switch>
        `);

        assertSwitchState({ type: 'button' });
      });

      test('should not set the `type` to "button" if it already contains a `type`', async function () {
        await render(hbs`
          <Switch @isOn={{false}} data-test-switch as |switch|>
            <switch.Button type="submit" />
          </Switch>
        `);

        assertSwitchState({ type: 'submit' });
      });
    });
  });

  module('Render composition', function () {
    test('it should be possible to render a Switch, switch.Label and switch.Button', async function () {
      await render(hbs`
        <Switch @isOn={{false}} data-test-switch as |switch|>
          <switch.Label>Enable notifications</switch.Label>
          <switch.Button />
        </Switch>
      `);

      assertSwitchState({
        state: SwitchState.Off,
        labelText: 'Enable notifications',
      });
    });
  });

  module('Keyboard interactions', function () {
    module('`Space` key', function () {
      test('it should be possible to toggle the Switch with Space', async function () {
        this.set('isEnabled', false);

        this.set('onUpdate', (value) => {
          this.set('isEnabled', value);
        });

        await render(hbs`
          <Switch @isOn={{this.isEnabled}} @onUpdate={{this.onUpdate}} data-test-switch as |switch|>
            <switch.Label>Enable notifications</switch.Label>
            <switch.Button data-test-button />
          </Switch>
        `);

        assertSwitchState({ state: SwitchState.Off });

        await triggerKeyEvent('[data-test-button]', 'keyup', ' ');

        assertSwitchState({ state: SwitchState.On });

        await triggerKeyEvent('[data-test-button]', 'keyup', ' ');

        assertSwitchState({ state: SwitchState.Off });
      });
    });

    test('it should be possible to toggle the Switch with a click', async function () {
      this.set('isEnabled', false);

      this.set('onUpdate', (value) => {
        this.set('isEnabled', value);
      });

      await render(hbs`
        <Switch @isOn={{this.isEnabled}} @onUpdate={{this.onUpdate}} data-test-switch as |switch|>
          <switch.Label>Enable notifications</switch.Label>
          <switch.Button data-test-button />
        </Switch>
      `);

      assertSwitchState({ state: SwitchState.Off });

      await click('[data-test-button]');

      assertSwitchState({ state: SwitchState.On });

      await click('[data-test-button]');

      assertSwitchState({ state: SwitchState.Off });
    });

    test('it should be possible to toggle the Switch with a click on the Label', async function () {
      this.set('isEnabled', false);

      this.set('onUpdate', (value) => {
        this.set('isEnabled', value);
      });

      await render(hbs`
        <Switch @isOn={{this.isEnabled}} @onUpdate={{this.onUpdate}} data-test-switch as |switch|>
          <switch.Label data-test-label>Enable notifications</switch.Label>
          <switch.Button />
        </Switch>
      `);

      assertSwitchState({ state: SwitchState.Off });

      await click('[data-test-label]');

      assertSwitchState({ state: SwitchState.On });

      await click('[data-test-label]');

      assertSwitchState({ state: SwitchState.Off });
    });
  });
});
