import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | tabs/tabs-basic', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:tabs/tabs-basic');
    assert.ok(controller);
  });
});
