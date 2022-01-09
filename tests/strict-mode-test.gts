import { module, test } from 'qunit'
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { tracked } from 'ember-deep-tracked';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

import { Dialog } from 'ember-headlessui';

import { DialogState, assertDialog } from './accessibility-assertions';

/**
  * Until strict mode becomes default, these tests are somewhat
  * "bare minimum" to ensure that we don't break anything in strict mode.
  * The component-specific tests should still be used for most of the tests.
  */
module('Strict Mode', function (hooks) {
  setupRenderingTest(hooks);

  let state: any;
  let set = (prop: string, value: any) => state[prop] = value;

  hooks.beforeEach(function() {
    state = tracked({})
  });

  test('Dialog works', async function() {
    await render(
      <template>
        <button {{on 'click' (fn set 'isOpen' true)}}>Trigger</button>
        <Dialog @isOpen={{state.isOpen}} @onClose={{fn set 'isOpen' false}}>
          Hello
          <div tabindex="0"></div>
        </Dialog>
      </template>
    );

    assertDialog({ state: DialogState.InvisibleUnmounted });

    await click(document.getElementById('trigger'));

    assertDialog({ state: DialogState.Visible, textContent: 'Hello' });
  });
});
