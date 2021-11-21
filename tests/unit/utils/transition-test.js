import { module, test } from 'qunit';

import { rawTimeout as timeout } from 'ember-concurrency';
import {
  ClassNameSet,
  splitClassNames,
  waitForTransition,
} from 'ember-headlessui/utils/transition';

module('Unit | Utility | transition', function () {
  test('ClassNameSet', function (assert) {
    const set = new ClassNameSet();

    set.add('foo', 'bar', 'baz');

    assert.strictEqual(set.toString(), 'foo bar baz');

    set.delete('foo', 'bar');

    assert.strictEqual(set.toString(), 'baz');
  });

  module('splitClassNames', function () {
    test('a class string with spaces separating classes', function (assert) {
      assert.deepEqual(splitClassNames('foo bar'), ['foo', 'bar']);
    });

    test('a class string with newlines in it', function (assert) {
      assert.deepEqual(
        splitClassNames(`
        foo
        bar
      `),
        ['foo', 'bar']
      );
    });

    test('an empty class string', function (assert) {
      assert.deepEqual(splitClassNames(), []);
    });
  });

  module('waitForTransition', function (hooks) {
    const TRANSITION = Symbol('Transition');
    const CONSTANT = Symbol('Constant');

    let element;

    function createElement(duration, delay) {
      let element = document.createElement('div');

      element.style.transitionDuration = `${duration}ms`;

      if (delay) {
        element.style.transitionDelay = `${delay}ms`;
      }

      // Node needs to be in the DOM to use `getComputedStyle` correctly
      document.body.appendChild(element);

      return element;
    }

    hooks.afterEach(function () {
      document.body.removeChild(element);
    });

    test('it resolves after the transition duration', async function (assert) {
      element = createElement(2);

      let result = await Promise.race([
        waitForTransition(element).then(() => TRANSITION),
        timeout(5).then(() => CONSTANT),
      ]);

      assert.strictEqual(
        result,
        TRANSITION,
        'The transition resolved before the constant'
      );

      result = await Promise.race([
        waitForTransition(element).then(() => TRANSITION),
        timeout(1).then(() => CONSTANT),
      ]);

      assert.strictEqual(
        result,
        CONSTANT,
        'The transition resolved after the constant'
      );
    });

    test('if there is a delay, resolve after the duration and delay', async function (assert) {
      element = createElement(2, 2);

      let result = await Promise.race([
        waitForTransition(element).then(() => TRANSITION),
        timeout(5).then(() => CONSTANT),
      ]);

      assert.strictEqual(
        result,
        TRANSITION,
        'The transition resolved before the constant'
      );

      result = await Promise.race([
        waitForTransition(element).then(() => TRANSITION),
        timeout(3).then(() => CONSTANT),
      ]);

      assert.strictEqual(
        result,
        CONSTANT,
        'The transition resolved after the constant'
      );
    });

    test('the delay is ignored if the duration is `0`', async function (assert) {
      element = createElement(0, 10);

      let result = await Promise.race([
        waitForTransition(element).then(() => TRANSITION),
        timeout(1).then(() => CONSTANT),
      ]);

      assert.strictEqual(
        result,
        TRANSITION,
        'The transition resolved before the constant'
      );
    });
  });
});
