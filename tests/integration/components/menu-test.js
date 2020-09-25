import QUnit, { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { click, render, pauseTest } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

function assertClosedMenuButton(selector) {
  QUnit.assert.dom(selector).hasAttribute("id");
  QUnit.assert.dom(selector).hasAttribute("aria-haspopup");
  QUnit.assert.dom(selector).doesNotHaveAttribute("aria-controls");
  QUnit.assert.dom(selector).doesNotHaveAttribute("aria-expanded");
}

function assertOpenMenuButton(selector) {
  QUnit.assert.dom(selector).hasAttribute("id");
  QUnit.assert.dom(selector).hasAttribute("aria-haspopup");
  QUnit.assert.dom(selector).hasAttribute("aria-controls");
  QUnit.assert.dom(selector).hasAttribute("aria-expanded");
}

function assertMenuItemsAreCollaped(selector) {
  QUnit.assert.dom(selector).isNotVisible();
}

module("Integration | Component | menu", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    await render(hbs`
      <Menu data-test-menu as |menu|>
        <menu.Button data-test-menu-button>Trigger</menu.Button>
        <menu.Items data-test-menu-items as |items|>
          <items.Item>Item A</items.Item>
          <items.Item>Item B</items.Item>
          <items.Item>Item C</items.Item>
        </menu.Items>
      </Menu>
    `);

    assert.dom("[data-test-menu]").isVisible();

    assert.dom("[data-test-menu-button]").hasText("Trigger");

    assertClosedMenuButton("[data-test-menu-button]");

    assertMenuItemsAreCollaped("[data-test-menu-items]");
  });

  module("Rendering", function () {
    module("Menu", function () {
      test("Menu yields an object", async function (assert) {
        await render(hbs`
        <Menu data-test-menu as |menu|>
          <menu.Button data-test-menu-button>Trigger {{if menu.isOpen "visible" "hidden" }}</menu.Button>
          <menu.Items data-test-menu-items as |items|>
            <items.Item>Item A</items.Item>
            <items.Item>Item B</items.Item>
            <items.Item>Item C</items.Item>
          </menu.Items>
        </Menu>
      `);

        assert.dom("[data-test-menu-button]").hasText("Trigger hidden");

        assertClosedMenuButton("[data-test-menu-button]");

        await click("[data-test-menu-button]");

        assertOpenMenuButton("[data-test-menu-button]");

        assert.dom("[data-test-menu-button]").hasText("Trigger visible");
        assert.dom("[data-test-menu-items]").isVisible();
      });

      test("Item yields an object", async function (assert) {
        await render(hbs`
        <Menu data-test-menu as |menu|>
          <menu.Button data-test-menu-button>Trigger {{if menu.isOpen "visible" "hidden" }}</menu.Button>
          <menu.Items data-test-menu-items as |items|>
            <items.Item as |item|>
              <item.Element data-test-menu-item>
                Item A [isActive:{{item.isActive}}] [isDisabled:{{item.isDisabled}}]
              </item.Element>
            </items.Item>
            <items.Item>Item B</items.Item>
            <items.Item>Item C</items.Item>
          </menu.Items>
        </Menu>
      `);

        await click("[data-test-menu-button]");

        assert
          .dom("[data-test-menu-item")
          .hasText("Item A [isActive:false] [isDisabled:false]");
      });
    });
  });
});
