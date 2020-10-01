//NOTE: The @headlessui Vue test suite is the canonical representation of how this component should behave.
//      We should endevour to have a similar test suite to it:
//      https://github.com/tailwindlabs/headlessui/blob/412cc950aa7545c1d78ac0791ae136fa9c15294a/packages/%40headlessui-vue/src/components/menu/menu.test.tsx

import QUnit, { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import {
  click,
  render,
  find,
  findAll,
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

function assertMenuButtonLinkedWithMenuItems(
  menuButtonSelector,
  menuItemsSelector
) {
  let menuButtonElement = find(menuButtonSelector);
  let menuItemsElement = find(menuItemsSelector);

  QUnit.assert.dom(menuButtonElement).hasAria("controls", menuItemsElement.id);

  QUnit.assert
    .dom(menuItemsElement)
    .hasAria("labelledby", menuButtonElement.id);
}

function assertMenuItems(menuSelector, expectedCount) {
  let itemsSelector = `${menuSelector} [role="menuitem"]`;
  QUnit.assert.dom(itemsSelector).exists({ count: expectedCount });

  let itemElements = findAll(itemsSelector);

  itemElements.forEach((itemElement) => {
    QUnit.assert.dom(itemElement).hasAttribute("id");
    QUnit.assert.dom(itemElement).hasAttribute("role", "menuitem");
    QUnit.assert.dom(itemElement).hasAttribute("tabindex", "-1");
  });
}

function assertMenuItemsAreCollaped(selector) {
  QUnit.assert.dom(selector).isNotVisible();
}

function assertNoActiveMenuItem(menuSelector) {
  QUnit.assert.dom(menuSelector).doesNotHaveAria("activedescendant");
}

module("Integration | Component | menu", (hooks) => {
  setupRenderingTest(hooks);

  test("it renders", async (assert) => {
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

  module("Rendering", () => {
    module("Menu", () => {
      test("Menu yields an object", async (assert) => {
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

  module("Keyboard interactions", function () {
    module("`Enter` key", function () {
      test("it should be possible to open the menu with Enter", async (assert) => {
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

        assertMenuButtonLinkedWithMenuItems(
          "[data-test-menu-button]",
          "[data-test-menu-items]"
        );

        assertMenuItems("[data-test-menu]", 3);

        assert
          .dom("[data-test-is-selected]")
          .hasText("Item A", "The first item is selected");
      });

      test("it should have no active menu item when there are no menu items at all", async (assert) => {
        await render(hbs`
        <Menu data-test-menu as |menu|>
          <menu.Button data-test-menu-button>Trigger</menu.Button>
          <menu.Items />
        </Menu>
      `);

        assertClosedMenuButton("[data-test-menu-button]");

        await triggerKeyEvent("[data-test-menu-button]", "keydown", "Enter");

        assertOpenMenuButton("[data-test-menu-button]");

        assertNoActiveMenuItem("[data-test-menu]");
      });

      test("it should focus the first non disabled menu item when opening with Enter", async (assert) => {
        await render(hbs`
          <Menu data-test-menu as |menu|>
            <menu.Button data-test-menu-button>Trigger</menu.Button>
            <menu.Items data-test-menu-items as |items|>
              <items.Item @isDisabled={{true}} as |item|>
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

        await triggerKeyEvent("[data-test-menu-button]", "keydown", "Enter");

        assertOpenMenuButton("[data-test-menu-button]");

        assert
          .dom("[data-test-is-selected]")
          .hasText("Item B", "The first non-disabled item is selected");
      });

      test("it should focus the first non disabled menu item when opening with Enter (jump over multiple disabled ones)", async (assert) => {
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

        await click("[data-test-menu-button");

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
              <item.Element {{on "click" this.onClick}}>
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

        await click("[data-test-menu-button]");

        assertOpenMenuButton("[data-test-menu-button]");

        await triggerEvent("[data-test-item-b]", "mouseover");

        await triggerKeyEvent("[data-test-item-b]", "keydown", "Enter");

        assert.dom(itemClicked).hasText("Item B");

        assertClosedMenuButton("[data-test-menu-button]");
      });

      test("it should be possible to use a button as a menu item and invoke it upon Enter", async function (assert) {
        let itemClicked = 0;
        this.set("onClick", (item) => (itemClicked = item.target));

        await render(hbs`
        <Menu data-test-menu as |menu|>
          <menu.Button data-test-menu-button>Trigger</menu.Button>
          <menu.Items data-test-menu-items as |items|>
            <items.Item as |item|>
              <item.Element  data-test-item-a {{on "click" this.onClick}}>
                Item A
              </item.Element>
            </items.Item>
            <items.Item as |item|>
              <item.Element @tagName="button" data-test-item-b {{on "click" this.onClick}}>
                Item B
              </item.Element>
            </items.Item>
          </menu.Items>
        </Menu>
      `);

        await triggerKeyEvent("[data-test-menu-button]", "keydown", "Enter");

        assertOpenMenuButton("[data-test-menu-button]");

        assert.dom("[data-test-item-a]").hasTagName("a");
        assert.dom("[data-test-item-b]").hasTagName("button");

        await triggerEvent("[data-test-item-b]", "mouseover");

        await triggerKeyEvent("[data-test-item-b]", "keydown", "Enter");

        assert.dom(itemClicked).hasText("Item B");

        assertClosedMenuButton("[data-test-menu-button]");
      });
    });

    // TODO: '`Space` key'
    // - it should be possible to open the menu with Space
    // - it should have no active menu item when there are no menu items at all
    // - it should focus the first non disabled menu item when opening with Space
    // - it should focus the first non disabled menu item when opening with Space (jump over multiple disabled ones)
    // - it should have no active menu item upon Space key press, when there are no non-disabled menu items
    // - it should be possible to close the menu with Space when there is no active menuitem
    // - it should be possible to close the menu with Space and invoke the active menu item

    // TODO: '`Escape` key'
    // - it should be possible to open the menu with Escape

    // TODO: '`Tab` key'
    // - it should focus trap when we use Tab
    // - it should focus trap when we use Shift+Tab

    // TODO: '`ArrowDown` key'
    // - it should be possible to open the menu with ArrowDown
    // - it should have no active menu item when there are no menu items at all
    // - it should be possible to use ArrowDown to navigate the menu items
    // - it should be possible to use ArrowDown to navigate the menu items and skip the first disabled one
    // - it should be possible to use ArrowDown to navigate the menu items and jump to the first non-disabled one

    // TODO: '`ArrowUp` key'
    // - it should be possible to open the menu with ArrowUp and the last item should be active
    // - it should have no active menu item when there are no menu items at all
    // - it should be possible to use ArrowUp to navigate the menu items and jump to the first non-disabled one
    // - it should not be possible to navigate up or down if there is only a single non-disabled item
    // - it should be possible to use ArrowUp to navigate the menu items

    // TODO: '`End` key'
    // - it should be possible to use the End key to go to the last menu item
    // - it should be possible to use the End key to go to the last non disabled menu item
    // - it should be possible to use the End key to go to the first menu item if that is the only non-disabled menu item
    // - it should have no active menu item upon End key press, when there are no non-disabled menu items

    // TODO: '`PageDown` key'
    // - it should be possible to use the PageDown key to go to the last menu item
    // - it should be possible to use the PageDown key to go to the last non disabled menu item
    // - it should be possible to use the PageDown key to go to the first menu item if that is the only non-disabled menu item
    // - it should have no active menu item upon PageDown key press, when there are no non-disabled menu items

    // TODO: '`Home` key'
    // - it should be possible to use the Home key to go to the first menu item
    // - it should be possible to use the Home key to go to the first non disabled menu item
    // - it should be possible to use the Home key to go to the last menu item if that is the only non-disabled menu item
    // - it should have no active menu item upon Home key press, when there are no non-disabled menu items

    // TODO: '`PageUp` key'
    // - it should be possible to use the PageUp key to go to the first menu item
    // - it should be possible to use the PageUp key to go to the first non disabled menu item
    // - it should be possible to use the PageUp key to go to the last menu item if that is the only non-disabled menu item
    // - it should have no active menu item upon PageUp key press, when there are no non-disabled menu items

    // TODO: 'Any` key aka search'
    // - it should be possible to type a full word that has a perfect match
    // - it should be possible to type a partial of a word
    // - it should be possible to type words with spaces
    // - it should not be possible to search for a disabled item

    // TODO: Mouse interactions
    // - it should be possible to open a menu on click
    // - it should be possible to close a menu on click
    // - it should focus the menu when you try to focus the button again (when the menu is already open)
    // - it should be a no-op when we click outside of a closed menu
    // - it should be possible to click outside of the menu which should close the menu
    // - it should be possible to click outside of the menu which should close the menu (even if we press the menu button)
    // - it should be possible to click outside of the menu on another menu button which should close the current menu and open the new menu
    // - it should be possible to hover an item and make it active
    // - it should make a menu item active when you move the mouse over it
    // - it should be a no-op when we move the mouse and the menu item is already active
    // - it should be a no-op when we move the mouse and the menu item is disabled
    // - it should not be possible to hover an item that is disabled
    // - it should be possible to mouse leave an item and make it inactive
    // - it should be possible to mouse leave a disabled item and be a no-op
    // - it should be possible to click a menu item, which closes the menu
    // - it should be possible to click a menu item, which closes the menu and invokes the @click handler
    // - it should be possible to click a disabled menu item, which is a no-op
    // - it should be possible focus a menu item, so that it becomes active
    // - it should not be possible to focus a menu item which is disabled
    // - it should not be possible to activate a disabled item
  });
});
