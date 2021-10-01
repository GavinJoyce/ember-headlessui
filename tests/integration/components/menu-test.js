//NOTE: The @headlessui Vue test suite is the canonical representation of how this component should behave.
//      We should endevour to have a similar test suite to it:
//      https://github.com/tailwindlabs/headlessui/blob/412cc950aa7545c1d78ac0791ae136fa9c15294a/packages/%40headlessui-vue/src/components/menu/menu.test.tsx

import {
  click,
  find,
  findAll,
  render,
  triggerEvent,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import QUnit, { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { Keys } from 'ember-headlessui/utils/keyboard';

function getMenu() {
  return find('[role="menu"]');
}

function getMenuItems() {
  return Array.from(findAll('[role="menuitem"]'));
}

function assertClosedMenuButton(selector) {
  QUnit.assert.dom(selector).hasAttribute('id');
  QUnit.assert.dom(selector).hasAttribute('aria-haspopup');
  QUnit.assert.dom(selector).doesNotHaveAttribute('aria-controls');
  QUnit.assert.dom(selector).doesNotHaveAttribute('aria-expanded');
}

function assertOpenMenuButton(selector) {
  QUnit.assert.dom(selector).hasAttribute('id');
  QUnit.assert.dom(selector).hasAttribute('aria-haspopup');
  QUnit.assert.dom(selector).hasAttribute('aria-controls');
  QUnit.assert.dom(selector).hasAttribute('aria-expanded');
}

function assertMenuButtonLinkedWithMenuItems(
  menuButtonSelector,
  menuItemsSelector
) {
  let menuButtonElement = find(menuButtonSelector);
  let menuItemsElement = find(menuItemsSelector);

  QUnit.assert.dom(menuButtonElement).hasAria('controls', menuItemsElement.id);

  QUnit.assert
    .dom(menuItemsElement)
    .hasAria('labelledby', menuButtonElement.id);
}

function assertMenuLinkedWithMenuItem(item, menu = getMenu()) {
  const itemElement = find(item);

  // Ensure link between menu & menu item is correct
  QUnit.assert
    .dom(menu)
    .hasAria('activedescendant', itemElement.getAttribute('id'));
}

function assertMenuItemsAreCollaped(selector) {
  QUnit.assert.dom(selector).isNotVisible();
}

function assertNoActiveMenuItem(menuSelector = getMenu()) {
  QUnit.assert.dom(menuSelector).doesNotHaveAria('activedescendant');
}

async function type(selector, value) {
  let finalKeyEventProcessing;

  for (const char of value) {
    finalKeyEventProcessing = triggerKeyEvent(
      selector,
      'keydown',
      char.toUpperCase()
    );
  }

  await finalKeyEventProcessing;
}

module('Integration | Component | <Menu>', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`
      <Menu as |menu|>
        <menu.Button data-test-menu-button>Trigger</menu.Button>
        <menu.Items data-test-menu-items as |items|>
          <items.Item>Item A</items.Item>
          <items.Item>Item B</items.Item>
          <items.Item>Item C</items.Item>
        </menu.Items>
      </Menu>
    `);

    assert.dom('[data-test-menu-button]').hasText('Trigger');

    assertClosedMenuButton('[data-test-menu-button]');

    assertMenuItemsAreCollaped('[data-test-menu-items]');
  });

  test('controlling open/close programmatically', async function (assert) {
    await render(hbs`
      <Menu as |menu|>
        <button data-test-open {{on 'click' menu.open}}>Open</button>
        <button data-test-close {{on 'click' menu.close}}>Close</button>

        <menu.Items data-test-menu-items as |items|>
          <items.Item>Item A</items.Item>
          <items.Item>Item B</items.Item>
          <items.Item>Item C</items.Item>
        </menu.Items>
      </Menu>
    `);

    await click('[data-test-open]');

    assert.dom('[data-test-menu-items]').exists();

    await click('[data-test-close]');

    assert.dom('[data-test-menu-items]').doesNotExist();
  });

  module('Rendering', () => {
    module('Menu', () => {
      test('Menu yields an object', async function (assert) {
        await render(hbs`
          <Menu as |menu|>
            <menu.Button data-test-menu-button>Trigger {{if menu.isOpen "visible" "hidden" }}</menu.Button>
            <menu.Items data-test-menu-items as |items|>
              <items.Item>Item A</items.Item>
              <items.Item>Item B</items.Item>
              <items.Item>Item C</items.Item>
            </menu.Items>
          </Menu>
        `);

        assert.dom('[data-test-menu-button]').hasText('Trigger hidden');

        assertClosedMenuButton('[data-test-menu-button]');

        await click('[data-test-menu-button]');

        assertOpenMenuButton('[data-test-menu-button]');

        assert.dom('[data-test-menu-button]').hasText('Trigger visible');
        assert.dom('[data-test-menu-items]').isVisible();
      });

      test('Item yields an object', async function (assert) {
        await render(hbs`
          <Menu as |menu|>
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

        await click('[data-test-menu-button]');

        assert
          .dom('[data-test-menu-item]')
          .hasText('Item A [isActive:false] [isDisabled:false]');
      });
    });

    test('it should be possible to use a custom component as a menu item', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-menu-button>Trigger</menu.Button>
          <menu.Items data-test-menu-items as |items|>
            {{#let (component 'link-to' route="menu") as |Link|}}
              <items.Item as |item|>
                <item.Element @tagName={{Link}} data-test-item-a>
                  Item A
                </item.Element>
              </items.Item>
            {{/let}}
          </menu.Items>
        </Menu>
      `);

      await triggerKeyEvent('[data-test-menu-button]', 'keydown', Keys.Enter);

      assert.dom('[data-test-item-a]').hasTagName('a');
      assert.dom('[data-test-item-a]').hasAttribute('href', '/menu');
    });
  });

  module('Keyboard interactions', function () {
    module('`Enter` key', function () {
      test('it should be possible to open the menu with Enter', async function (assert) {
        await render(hbs`
          <Menu as |menu|>
            <menu.Button data-test-menu-button>Trigger</menu.Button>
            <menu.Items data-test-menu-items as |items|>
              <items.Item as |item|>
                <item.Element>
                  Item A
                </item.Element>
              </items.Item>
              <items.Item as |item|>
                <item.Element>
                  Item B
                </item.Element>
              </items.Item>
              <items.Item as |item|>
                <item.Element>
                  Item C
                </item.Element>
              </items.Item>
            </menu.Items>
          </Menu>
        `);

        assertClosedMenuButton('[data-test-menu-button]');

        await triggerKeyEvent('[data-test-menu-button]', 'keydown', Keys.Enter);

        assertOpenMenuButton('[data-test-menu-button]');

        assertMenuButtonLinkedWithMenuItems(
          '[data-test-menu-button]',
          '[data-test-menu-items]'
        );

        const items = getMenuItems();

        assert.equal(items.length, 3, 'There are three visible menu items');

        assertMenuLinkedWithMenuItem(items[0]);
      });

      test('it should have no active menu item when there are no menu items at all', async function () {
        await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-menu-button>Trigger</menu.Button>
          <menu.Items />
        </Menu>
      `);

        assertClosedMenuButton('[data-test-menu-button]');

        await triggerKeyEvent('[data-test-menu-button]', 'keydown', Keys.Enter);

        assertOpenMenuButton('[data-test-menu-button]');

        assertNoActiveMenuItem();
      });

      test('it should focus the first non disabled menu item when opening with Enter', async function () {
        await render(hbs`
          <Menu as |menu|>
            <menu.Button data-test-menu-button>Trigger</menu.Button>
            <menu.Items data-test-menu-items as |items|>
              <items.Item @isDisabled={{true}} as |item|>
                <item.Element>
                  Item A
                </item.Element>
              </items.Item>
              <items.Item as |item|>
                <item.Element>
                  Item B
                </item.Element>
              </items.Item>
              <items.Item as |item|>
                <item.Element>
                  Item C
                </item.Element>
              </items.Item>
            </menu.Items>
          </Menu>
        `);

        await triggerKeyEvent('[data-test-menu-button]', 'keydown', Keys.Enter);

        assertOpenMenuButton('[data-test-menu-button]');

        const items = getMenuItems();

        assertMenuLinkedWithMenuItem(items[1]);
      });

      test('it should focus the first non disabled menu item when opening with Enter (jump over multiple disabled ones)', async function () {
        await render(hbs`
          <Menu as |menu|>
            <menu.Button data-test-menu-button>Trigger</menu.Button>
            <menu.Items data-test-menu-items as |items|>
              <items.Item @isDisabled={{true}} as |item|>
                <item.Element>
                  Item A
                </item.Element>
              </items.Item>
              <items.Item @isDisabled={{true}} as |item|>
                <item.Element>
                  Item B
                </item.Element>
              </items.Item>
              <items.Item as |item|>
                <item.Element>
                  Item C
                </item.Element>
              </items.Item>
            </menu.Items>
          </Menu>
        `);

        await triggerKeyEvent('[data-test-menu-button]', 'keydown', Keys.Enter);

        assertOpenMenuButton('[data-test-menu-button]');

        const items = getMenuItems();

        assertMenuLinkedWithMenuItem(items[2]);
      });

      test('it should have no active menu item upon Enter key press, when there are no non-disabled menu items', async function () {
        await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-menu-button>Trigger</menu.Button>
          <menu.Items data-test-menu-items as |items|>
            <items.Item @isDisabled={{true}} as |item|>
              <item.Element>
                Item A
              </item.Element>
            </items.Item>
            <items.Item @isDisabled={{true}} as |item|>
              <item.Element>
                Item B
              </item.Element>
            </items.Item>
          </menu.Items>
        </Menu>
      `);

        await triggerKeyEvent('[data-test-menu-button]', 'keydown', Keys.Enter);

        assertOpenMenuButton('[data-test-menu-button]');

        assertNoActiveMenuItem();
      });

      test('it should be possible to close the menu with Enter when there is no active menuitem', async function () {
        await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-menu-button>Trigger</menu.Button>
          <menu.Items data-test-menu-items as |items|>
            <items.Item @isDisabled={{true}} as |item|>
              <item.Element>
                Item A
              </item.Element>
            </items.Item>
            <items.Item @isDisabled={{true}} as |item|>
              <item.Element>
                Item B
              </item.Element>
            </items.Item>
          </menu.Items>
        </Menu>
      `);

        await click('[data-test-menu-button]');

        assertOpenMenuButton('[data-test-menu-button]');

        await triggerKeyEvent('[data-test-menu-button]', 'keydown', Keys.Enter);

        assertClosedMenuButton('[data-test-menu-button]');
      });

      test('it should be possible to close the menu with Enter and invoke the active menu item', async function (assert) {
        let itemClicked = 0;
        this.set('onClick', (item) => (itemClicked = item.target));

        await render(hbs`
        <Menu as |menu|>
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

        await click('[data-test-menu-button]');

        assertOpenMenuButton('[data-test-menu-button]');

        await triggerEvent('[data-test-item-b]', 'mouseover');

        await triggerKeyEvent('[data-test-item-b]', 'keydown', Keys.Enter);

        assert.dom(itemClicked).hasText('Item B');

        assertClosedMenuButton('[data-test-menu-button]');
      });

      test('it should be possible to use a button as a menu item and invoke it upon Enter', async function (assert) {
        let itemClicked = 0;
        this.set('onClick', (item) => (itemClicked = item.target));

        await render(hbs`
        <Menu as |menu|>
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

        await triggerKeyEvent('[data-test-menu-button]', 'keydown', Keys.Enter);

        assertOpenMenuButton('[data-test-menu-button]');

        assert.dom('[data-test-item-a]').hasTagName('a');
        assert.dom('[data-test-item-b]').hasTagName('button');

        await triggerEvent('[data-test-item-b]', 'mouseover');

        await triggerKeyEvent('[data-test-item-b]', 'keydown', Keys.Enter);

        assert.dom(itemClicked).hasText('Item B');

        assertClosedMenuButton('[data-test-menu-button]');
      });
    });

    module('`Space` key', function () {
      test('it should be possible to open the menu with Space', async function (assert) {
        await render(hbs`
          <Menu as |menu|>
            <menu.Button data-test-menu-button>Trigger</menu.Button>
            <menu.Items data-test-menu-items as |items|>
              <items.Item as |item|>
                <item.Element>
                  Item A
                </item.Element>
              </items.Item>
              <items.Item as |item|>
                <item.Element>
                  Item B
                </item.Element>
              </items.Item>
              <items.Item as |item|>
                <item.Element>
                  Item C
                </item.Element>
              </items.Item>
            </menu.Items>
          </Menu>
        `);

        assertClosedMenuButton('[data-test-menu-button]');

        await triggerKeyEvent('[data-test-menu-button]', 'keydown', Keys.Space);

        assertOpenMenuButton('[data-test-menu-button]');

        assertMenuButtonLinkedWithMenuItems(
          '[data-test-menu-button]',
          '[data-test-menu-items]'
        );

        const items = getMenuItems();

        assert.equal(items.length, 3, 'There are three visible menu items');
        assertMenuLinkedWithMenuItem(items[0]);
      });

      // - it should be possible to open the menu with Space
      // - it should have no active menu item when there are no menu items at all
      // - it should focus the first non disabled menu item when opening with Space
      // - it should focus the first non disabled menu item when opening with Space (jump over multiple disabled ones)
      // - it should have no active menu item upon Space key press, when there are no non-disabled menu items
      // - it should be possible to close the menu with Space when there is no active menuitem
      // - it should be possible to close the menu with Space and invoke the active menu item
    });

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

    module('`Any` key aka search', function () {
      test('it should be possible to type a full word that has a perfect match', async function () {
        await render(hbs`
          <Menu as |menu|>
            <menu.Button data-test-menu-button>Trigger</menu.Button>
            <menu.Items data-test-menu-items as |items|>
              <items.Item as |item|>
                <item.Element>
                  alice
                </item.Element>
              </items.Item>
              <items.Item as |item|>
                <item.Element>
                  bob
                </item.Element>
              </items.Item>
            </menu.Items>
          </Menu>
        `);

        await click('[data-test-menu-button]');
        await type('[data-test-menu-items]', 'bob');

        const items = getMenuItems();

        assertMenuLinkedWithMenuItem(items[1]);
      });

      test('it should be possible to type a partial of a word', async function () {
        await render(hbs`
          <Menu as |menu|>
            <menu.Button data-test-menu-button>Trigger</menu.Button>
            <menu.Items data-test-menu-items as |items|>
              <items.Item as |item|>
                <item.Element>
                  alice
                </item.Element>
              </items.Item>
              <items.Item as |item|>
                <item.Element>
                  bob
                </item.Element>
              </items.Item>
            </menu.Items>
          </Menu>
        `);

        await click('[data-test-menu-button]');
        await type('[data-test-menu-items]', 'bo');

        const items = getMenuItems();

        assertMenuLinkedWithMenuItem(items[1]);

        await type('[data-test-menu-items]', 'ali');

        assertMenuLinkedWithMenuItem(items[0]);
      });

      test('it should be possible to type words with spaces', async function () {
        await render(hbs`
          <Menu as |menu|>
            <menu.Button data-test-menu-button>Trigger</menu.Button>
            <menu.Items data-test-menu-items as |items|>
              <items.Item as |item|>
                <item.Element>
                  value a
                </item.Element>
              </items.Item>
              <items.Item as |item|>
                <item.Element>
                  value b
                </item.Element>
              </items.Item>
            </menu.Items>
          </Menu>
        `);

        await click('[data-test-menu-button]');
        await type('[data-test-menu-items]', 'value b');

        const items = getMenuItems();

        assertMenuLinkedWithMenuItem(items[1]);

        await type('[data-test-menu-items]', 'value a');

        assertMenuLinkedWithMenuItem(items[0]);
      });

      test('it should not be possible to search for a disabled item', async function () {
        await render(hbs`
          <Menu as |menu|>
            <menu.Button data-test-menu-button>Trigger</menu.Button>
            <menu.Items data-test-menu-items as |items|>
              <items.Item as |item|>
                <item.Element>
                  alice
                </item.Element>
              </items.Item>
              <items.Item @isDisabled={{true}} as |item|>
                <item.Element>
                  bob
                </item.Element>
              </items.Item>
            </menu.Items>
          </Menu>
        `);

        await click('[data-test-menu-button]');
        await type('[data-test-menu-items]', 'bob');

        assertNoActiveMenuItem('[data-test-menu-items]');
      });
    });

    module('Mouse interactions', function () {
      test('it should be possible to open and close a menu on click', async function (assert) {
        await render(hbs`
          <Menu as |menu|>
            <menu.Button data-test-menu-button>Trigger</menu.Button>
            <menu.Items data-test-menu-items as |items|>
              <items.Item as |item|>
                <item.Element>Item A</item.Element>
              </items.Item>
              <items.Item as |item|>
                <item.Element>Item B</item.Element>
              </items.Item>
              <items.Item as |item|>
                <item.Element>Item C</item.Element>
              </items.Item>
            </menu.Items>
          </Menu>
        `);

        assertClosedMenuButton('[data-test-menu-button]');

        await click('[data-test-menu-button]');

        assertOpenMenuButton('[data-test-menu-button]');

        assertMenuButtonLinkedWithMenuItems(
          '[data-test-menu-button]',
          '[data-test-menu-items]'
        );

        const items = getMenuItems();

        assert.equal(items.length, 3, 'There are three visible menu items');

        await click('[data-test-menu-button]');

        assertClosedMenuButton('[data-test-menu-button]');
      });

      // - it should focus the menu when you try to focus the button again (when the menu is already open)
      // - it should be a no-op when we click outside of a closed menu
      test('it should be possible to click outside of the menu which should close the menu', async function (assert) {
        await render(hbs`
          <Menu as |menu|>
            <menu.Button data-test-menu-button>Trigger</menu.Button>
            <menu.Items data-test-menu-items as |items|>
              <items.Item as |item|>
                <item.Element>Item A</item.Element>
              </items.Item>
              <items.Item as |item|>
                <item.Element>Item B</item.Element>
              </items.Item>
              <items.Item as |item|>
                <item.Element>Item C</item.Element>
              </items.Item>
            </menu.Items>
          </Menu>
        `);

        await click('[data-test-menu-button]');

        assertOpenMenuButton('[data-test-menu-button]');

        await click(document.body);

        assertClosedMenuButton('[data-test-menu-button]');

        assert.dom('[data-test-menu-button]').isFocused();
      });

      test('it should not focus button when does not exist', async function (assert) {
        this.set('isShowButton', true);
        await render(hbs`
          <Menu as |menu|>
            {{#if this.isShowButton}}
              <menu.Button data-test-menu-button>Trigger</menu.Button>
            {{/if}}
            <menu.Items data-test-menu-items as |items|>
              <items.Item as |item|>
                <item.Element>Item A</item.Element>
              </items.Item>
            </menu.Items>
          </Menu>
        `);

        await click('[data-test-menu-button]');

        assertOpenMenuButton('[data-test-menu-button]');

        this.set('isShowButton', false);
        await click(document.body);
        assert.dom('[data-test-menu-button]').doesNotExist();
      });
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
});
