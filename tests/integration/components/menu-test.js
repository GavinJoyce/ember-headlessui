import QUnit, { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import {
  click,
  render,
  pauseTest,
  focus,
  find,
  triggerEvent,
  triggerKeyEvent,
} from "@ember/test-helpers";
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

  module("Keyboard", function () {
    test("Enter open and closes the menu", async function (assert) {
      await render(hbs`
        <Menu data-test-menu as |menu|>
          <menu.Button data-test-menu-button>Trigger</menu.Button>
          <menu.Items data-test-menu-items as |items|>
            <items.Item as |item|>
              <item.Element data-test-is-selected={{item.isActive}}>
                Item A
              </item.Element>
            </items.Item>
            <items.Item as |item|>
              <item.Element data-test-is-selected={{item.isActive}}>
                Item B
              </item.Element>
            </items.Item>
            <items.Item as |item|>
              <item.Element data-test-is-selected={{item.isActive}}>
                Item C
              </item.Element>
            </items.Item>
          </menu.Items>
        </Menu>
      `);

      assertClosedMenuButton("[data-test-menu-button]");

      await triggerKeyEvent("[data-test-menu-button]", "keydown", "Enter");

      assertOpenMenuButton("[data-test-menu-button]");

      assert
        .dom("[data-test-is-selected]")
        .hasText("Item A", "The first item is selected");
    });

    test("it should have no active item when no items are provided", async function (assert) {
      await render(hbs`
        <Menu data-test-menu as |menu|>
          <menu.Button data-test-menu-button>Trigger</menu.Button>
          <menu.Items />
        </Menu>
      `);

      await triggerKeyEvent("[data-test-menu-button]", "keydown", "Enter");

      assertOpenMenuButton("[data-test-menu-button]");

      assert.dom("[data-test-is-selected]").doesNotExist();
    });

    test("it should focus the first non disabled menu item when opening with Enter", async function (assert) {
      await render(hbs`
        <Menu data-test-menu as |menu|>
          <menu.Button data-test-menu-button>Trigger</menu.Button>
          <menu.Items data-test-menu-items as |items|>
            <items.Item @isDisabled={{true}} as |item|>
              <item.Element data-test-is-selected={{item.isActive}}>
                Item A
              </item.Element>
            </items.Item>
            <items.Item @isDisabled={{true}} as |item|>
              <item.Element data-test-is-selected={{item.isActive}}>
                Item B
              </item.Element>
            </items.Item>
            <items.Item as |item|>
              <item.Element data-test-is-selected={{item.isActive}}>
                Item C
              </item.Element>
            </items.Item>
          </menu.Items>
        </Menu>
      `);

      await triggerKeyEvent("[data-test-menu-button]", "keydown", "Enter");

      assertOpenMenuButton("[data-test-menu-button]");

      assert
        .dom("[data-test-is-selected]")
        .hasText("Item C", "The first non-disabled item is selected");
    });

    test("it should have no active menu item upon Enter key press, when there are no non-disabled menu items", async function (assert) {
      await render(hbs`
        <Menu data-test-menu as |menu|>
          <menu.Button data-test-menu-button>Trigger</menu.Button>
          <menu.Items data-test-menu-items as |items|>
            <items.Item @isDisabled={{true}} as |item|>
              <item.Element data-test-is-selected={{item.isActive}}>
                Item A
              </item.Element>
            </items.Item>
            <items.Item @isDisabled={{true}} as |item|>
              <item.Element data-test-is-selected={{item.isActive}}>
                Item B
              </item.Element>
            </items.Item>
          </menu.Items>
        </Menu>
      `);

      await triggerKeyEvent("[data-test-menu-button]", "keydown", "Enter");

      assertOpenMenuButton("[data-test-menu-button]");

      assert.dom("[data-test-is-selected]").doesNotExist();
    });

    test("it should be possible to close the menu with Enter when there is no active menuitem", async function (assert) {
      await render(hbs`
        <Menu data-test-menu as |menu|>
          <menu.Button data-test-menu-button>Trigger</menu.Button>
          <menu.Items data-test-menu-items as |items|>
            <items.Item @isDisabled={{true}} as |item|>
              <item.Element data-test-is-selected={{item.isActive}}>
                Item A
              </item.Element>
            </items.Item>
            <items.Item @isDisabled={{true}} as |item|>
              <item.Element data-test-is-selected={{item.isActive}}>
                Item B
              </item.Element>
            </items.Item>
          </menu.Items>
        </Menu>
      `);

      await triggerKeyEvent("[data-test-menu-button]", "keydown", "Enter");

      assertOpenMenuButton("[data-test-menu-button]");

      await triggerKeyEvent("[data-test-menu-button]", "keydown", "Enter");

      assertClosedMenuButton("[data-test-menu-button]");
    });

    test("it should be possible to close the menu with Enter and invoke the active menu item", async function (assert) {
      let itemClicked = 0;
      this.set("onClick", (item) => (itemClicked = item.target));

      await render(hbs`
        <Menu data-test-menu as |menu|>
          <menu.Button data-test-menu-button>Trigger</menu.Button>
          <menu.Items data-test-menu-items as |items|>
            <items.Item as |item|>
              <item.Element  {{on "click" this.onClick}}>
                Item A
              </item.Element>
            </items.Item>
            <items.Item as |item|>
              <item.Element data-test-item-b {{on "click" this.onClick}}>
                Item B
              </item.Element>
            </items.Item>
          </menu.Items>
        </Menu>
      `);

      await triggerKeyEvent("[data-test-menu-button]", "keydown", "Enter");

      assertOpenMenuButton("[data-test-menu-button]");

      await triggerEvent("[data-test-item-b]", "mouseover");

      await triggerKeyEvent("[data-test-item-b]", "keydown", "Enter");

      assert.dom(itemClicked).hasText("Item B");

      assertClosedMenuButton("[data-test-menu-button]");
    });
  });
});
