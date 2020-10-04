import QUnit, { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { click, render, triggerKeyEvent } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

function assertSwitchIsOn(selector = "[data-test-headlessui-switch]") {
  QUnit.assert.dom(selector).hasAttribute("data-test-headlessui-switch-is-on");
  QUnit.assert
    .dom(`${selector} [data-test-headlessui-switch-button]`)
    .hasAttribute("aria-checked", "true");
}

function assertSwitchIsOff(selector = "[data-test-headlessui-switch]") {
  QUnit.assert
    .dom(selector)
    .doesNotHaveAttribute("data-test-headlessui-switch-is-on");
  QUnit.assert
    .dom(`${selector} [data-test-headlessui-switch-button]`)
    .hasAttribute("aria-checked", "false");
}

const SwitchState = {
  Off: 0,
  On: 1,
};

function assertSwitchState(
  options,
  selector = "[data-test-headlessui-switch]"
) {
  let assert = QUnit.assert;
  let buttonSelector = `${selector} [data-test-headlessui-switch-button]`;
  let labelSelector = `${selector} [data-test-headlessui-switch-label]`;

  assert.dom(selector).exists(selector);

  assert.dom(buttonSelector).exists(selector);
  assert.dom(buttonSelector).hasAttribute("role", "switch");
  assert.dom(buttonSelector).hasAttribute("tabindex", "0");

  if (options.buttonTagName) {
    assert.dom(buttonSelector).hasTagName(options.buttonTagName);
  }

  if (options.text) {
    assert.dom(selector).hasText(options.text);
  }

  if (options.labelText) {
    assert.dom(labelSelector).hasText(options.labelText);
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

module("Integration | Component | <Switch>", function (hooks) {
  setupRenderingTest(hooks);

  test("it should be possible to render a Switch without crashing", async function (assert) {
    await render(hbs`
      <Switch @isOn={{false}} data-test-switch as |switch|>
        <switch.Button />
      </Switch>
    `);

    assertSwitchState({ state: SwitchState.Off });
  });

  module("Rendering", function (hooks) {
    test("it should be possible to render a Switch when @isOn={{true}}", async function (assert) {
      await render(hbs`
        <Switch @isOn={{true}} data-test-switch as |switch|>
          <switch.Label>{{if switch.isOn "On" "Off"}}</switch.Label>
          <switch.Button />
        </Switch>
      `);

      assertSwitchState({
        state: SwitchState.On,
        text: "On",
        buttonTagName: "div",
      });
      assert.dom("[data-test-switch]").hasTagName("div");
    });

    test("it should be possible to render a Switch when @isOn={{false}}", async function (assert) {
      await render(hbs`
        <Switch @isOn={{false}} data-test-switch as |switch|>
          <switch.Label>{{if switch.isOn "On" "Off"}}</switch.Label>
          <switch.Button />
        </Switch>
      `);

      assertSwitchState({
        state: SwitchState.Off,
        text: "Off",
        buttonTagName: "div",
      });
    });

    test("the button tag name can be customised", async function (assert) {
      await render(hbs`
        <Switch @isOn={{false}} data-test-switch as |switch|>
          <switch.Label>{{if switch.isOn "On" "Off"}}</switch.Label>
          <switch.Button @tagName="span" />
        </Switch>
      `);

      assertSwitchState({
        state: SwitchState.Off,
        text: "Off",
        buttonTagName: "span",
      });
    });
  });

  module("Render composition", function (hooks) {
    test("it should be possible to render a Switch, switch.Label and switch.Button", async function (assert) {
      await render(hbs`
        <Switch @isOn={{false}} data-test-switch as |switch|>
          <switch.Label>Enable notifications</switch.Label>
          <switch.Button />
        </Switch>
      `);

      assertSwitchState({
        state: SwitchState.Off,
        labelText: "Enable notifications",
      });
    });
  });

  module("Keyboard interactions", function (hooks) {
    module("`Space` key", function (hooks) {
      test("it should be possible to toggle the Switch with Space", async function (assert) {
        this.set("isEnabled", false);

        this.set("onUpdate", (value) => {
          this.set("isEnabled", value);
        });

        await render(hbs`
          <Switch @isOn={{this.isEnabled}} @onUpdate={{this.onUpdate}} data-test-switch as |switch|>
            <switch.Label>Enable notifications</switch.Label>
            <switch.Button data-test-button />
          </Switch>
        `);

        assertSwitchState({ state: SwitchState.Off });

        await triggerKeyEvent("[data-test-button]", "keyup", " ");

        assertSwitchState({ state: SwitchState.On });

        await triggerKeyEvent("[data-test-button]", "keyup", " ");

        assertSwitchState({ state: SwitchState.Off });
      });
    });
  });

  module("Keyboard interactions", function (hooks) {
    test("it should be possible to toggle the Switch with a click", async function (assert) {
      this.set("isEnabled", false);

      this.set("onUpdate", (value) => {
        this.set("isEnabled", value);
      });

      await render(hbs`
        <Switch @isOn={{this.isEnabled}} @onUpdate={{this.onUpdate}} data-test-switch as |switch|>
          <switch.Label>Enable notifications</switch.Label>
          <switch.Button data-test-button />
        </Switch>
      `);

      assertSwitchState({ state: SwitchState.Off });

      await click("[data-test-button]");

      assertSwitchState({ state: SwitchState.On });

      await click("[data-test-button]");

      assertSwitchState({ state: SwitchState.Off });
    });

    test("it should be possible to toggle the Switch with a click on the Label", async function (assert) {
      this.set("isEnabled", false);

      this.set("onUpdate", (value) => {
        this.set("isEnabled", value);
      });

      await render(hbs`
        <Switch @isOn={{this.isEnabled}} @onUpdate={{this.onUpdate}} data-test-switch as |switch|>
          <switch.Label data-test-label>Enable notifications</switch.Label>
          <switch.Button />
        </Switch>
      `);

      assertSwitchState({ state: SwitchState.Off });

      await click("[data-test-label]");

      assertSwitchState({ state: SwitchState.On });

      await click("[data-test-label]");

      assertSwitchState({ state: SwitchState.Off });
    });
  });
});
