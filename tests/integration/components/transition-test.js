import { click, render, resetOnerror, setupOnerror } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, skip, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { ARG_SHOW_MISSING_ERROR_MESSAGE } from 'ember-headlessui/components/transition';
import { PARENT_MISSING_ERROR_MESSAGE } from 'ember-headlessui/components/transition/child';
import td from 'testdouble';

module('Integration | Component | transition', function (hooks) {
  setupRenderingTest(hooks);

  hooks.afterEach(function () {
    resetOnerror();
  });

  test('should render without crashing', async function (assert) {
    await render(hbs`
      <Transition @show={{true}}>
        <div class="hello">Children</div>
      </Transition>
    `);

    assert.dom('.hello').hasText('Children');
  });

  test('should be possible to render a Transition without children', async function (assert) {
    await render(hbs`
      <Transition data-test-transition @show={{true}} />
    `);

    assert.dom('[data-test-transition]').exists();
  });

  test('should yell at us when we forget the required show prop', async function (assert) {
    assert.expect(1);

    setupOnerror((error) => {
      assert.strictEqual(
        error.message,
        `Assertion Failed: ${ARG_SHOW_MISSING_ERROR_MESSAGE}`,
        'The `Transition` component must have a `@show` argument'
      );
    });

    await render(hbs`
      <Transition>
        <div class="hello">Children</div>
      </Transition>
    `);
  });

  module('Setup API', function () {
    module('shallow', function () {
      test('should render a div and its children by default', async function (assert) {
        await render(hbs`
          <Transition data-test-transition @show={{true}}>
            Children
          </Transition>
        `);

        assert.dom('[data-test-transition]').hasTagName('div');
        assert.dom('[data-test-transition]').hasText('Children');
      });

      // Note: this has been translated to the most appropriate analogue: attributes
      test('should passthrough all the props (that we do not use internally)', async function (assert) {
        await render(hbs`
          <Transition data-test-transition id="transition" @show={{true}}>
            Children
          </Transition>
        `);

        assert.dom('[data-test-transition]').hasAttribute('id', 'transition');
      });

      // should render another component if the `as` prop is used and its children by default
      test('should render another component if the `tagName` argument is used and its children by default', async function (assert) {
        await render(hbs`
          <Transition data-test-transition @tagName="span" @show={{true}}>
            Children
          </Transition>
        `);

        assert.dom('[data-test-transition]').hasTagName('span');
      });

      // Test is redundant based on the implementation
      skip(
        'should passthrough all the props (that we do not use internally) even when using an `as` prop'
      );

      test('should render nothing when the show prop is false', async function (assert) {
        await render(hbs`
          <Transition data-test-transition @show={{false}}>
            Children
          </Transition>
        `);

        assert.dom('[data-test-transition]').doesNotExist();
      });

      // Test is already covered by previous tests
      skip('should be possible to change the underlying DOM tag');

      // Test is not relevant in Ember
      skip('should be possible to use a render prop');

      // Test is not relevant in Ember
      skip(
        'should yell at us when we forget to forward the ref when using a render prop'
      );
    });

    module('nested', function () {
      test('should yell at us when we forget to wrap the `<Transition.Child />` in a parent <Transition /> component', async function (assert) {
        assert.expect(1);

        setupOnerror((error) => {
          assert.strictEqual(
            error.message,
            `Assertion Failed: ${PARENT_MISSING_ERROR_MESSAGE}`,
            'The `Transition::Child` component must have a parent `Transition` component'
          );
        });

        await render(hbs`
          <Transition::Child @show={{true}}>
            Oops
          </Transition::Child>
        `);
      });

      test('should be possible to render a Transition.Child without children', async function (assert) {
        await render(hbs`
          <Transition @show={{true}} as |t|>
            <t.Child data-test-transition />
          </Transition>
        `);

        assert.dom('[data-test-transition]').exists();
      });

      // Skipped since `Transition.Root` is not part of the documented API
      skip(
        'should be possible to use a Transition.Root and a Transition.Child'
      );

      test('should be possible to nest transition components', async function (assert) {
        await render(hbs`
          <Transition @show={{true}} data-test-transition as |t|>
            <t.Child data-test-child-1>Sidebar</t.Child>
            <t.Child data-test-child-2>Content</t.Child>
          </Transition>
        `);

        assert.dom('[data-test-transition]').exists();
        assert.dom('[data-test-child-1]').hasText('Sidebar');
        assert.dom('[data-test-child-2]').hasText('Content');
      });

      test('should be possible to change the underlying DOM tag of the Transition.Child components', async function (assert) {
        await render(hbs`
          <Transition @show={{true}} as |t|>
            <t.Child @tagName="aside" data-test-child-1>Sidebar</t.Child>
            <t.Child @tagName="section" data-test-child-2>Content</t.Child>
          </Transition>
        `);

        assert.dom('[data-test-child-1]').hasTagName('aside');
        assert.dom('[data-test-child-2]').hasTagName('section');
      });

      // Skipped because functionality is well-covered by other tests
      skip(
        'should be possible to change the underlying DOM tag of the Transition component and Transition.Child components'
      );

      // Skipped because API is not relevant to Ember
      skip(
        'should be possible to use render props on the Transition.Child components'
      );

      // Skipped because API is not relevant to Ember
      skip(
        'should be possible to use render props on the Transition and Transition.Child components'
      );

      // Skipped because API is not relevant to Ember
      skip(
        'should yell at us when we forgot to forward the ref on one of the Transition.Child components'
      );

      // Skipped because API is not relevant to Ember
      skip(
        'should yell at us when we forgot to forward a ref on the Transition component'
      );
    });

    module('transition classes', function () {
      test('should be possible to passthrough the transition classes', async function (assert) {
        await render(hbs`
          <Transition
            @show={{true}}
            @enter="enter"
            @enterFrom="enter-from"
            @enterTo="enter-to"
            @leave="leave"
            @leaveFrom="leave-from"
            @leaveTo="leave-to"
            data-test-transition
          >
            Children
          </Transition>
        `);

        // Has only the framework-provided classes
        // NOTE: I thought `ember-view` wasn't relevant anymore?
        assert
          .dom('[data-test-transition]')
          .hasAttribute('class', 'ember-view');
      });

      // https://github.com/GavinJoyce/ember-headlessui/issues/113
      skip('should be possible to passthrough the transition classes and immediately apply the enter transitions when appear is set to true', async function (assert) {
        // NOTE: We must *not* await rendering; the transition will have completed by the time it resolves
        const renderComplete = render(hbs`
          <Transition
            @show={{true}}
            @appear={{true}}
            @enter="enter"
            @enterFrom="enter-from"
            @enterTo="enter-to"
            @leave="leave"
            @leaveFrom="leave-from"
            @leaveTo="leave-to"
            data-test-transition
          >
            Children
          </Transition>
        `);

        await assert.waitFor(() => {
          assert.dom('[data-test-transition]').hasClass('enter');
          assert.dom('[data-test-transition]').hasClass('enter-from');
        });

        // Make sure the rendering process is complete before finishing the test
        await renderComplete;
      });

      // https://github.com/GavinJoyce/ember-headlessui/issues/113
      skip('should be possible to passthrough the enter classes and immediately apply the enter transitions when appear is set to true on Child component', async function (assert) {
        // NOTE: We must *not* await rendering; the transition will have completed by the time it resolves
        const renderComplete = render(hbs`
          <Transition
            @show={{true}}
          as |t|>
            <t.Child
              @appear={{true}}
              @enter="enter"
              @enterFrom="enter-from"
              data-test-transition
            >
              Children
            </t.Child>
          </Transition>
        `);

        await assert.waitFor(() => {
          assert.dom('[data-test-transition]').hasClass('enter');
          assert.dom('[data-test-transition]').hasClass('enter-from');
        });

        // Make sure the rendering process is complete before finishing the test
        await renderComplete;
      });
    });
  });

  module('Transitions', function () {
    module('shallow transitions', function () {
      // https://github.com/GavinJoyce/ember-headlessui/issues/113
      skip('should transition in completely (duration defined in milliseconds)', async function (assert) {
        this.isShown = false;
        this.showTransition = () => {
          this.set('isShown', true);
        };

        await render(hbs`
          <style>
            .enter { transition-duration: 50ms }
            .from { opacity: 0% }
            .to { opacity: 100% }
          </style>

          <Transition
            @show={{this.isShown}}
            @enter="enter"
            @enterFrom="from"
            @enterTo="to"
            data-test-transition
          />

          <button {{on 'click' this.showTransition}}>
            Show the transition: {{this.isShown}}
          </button>
        `);

        assert.dom('[data-test-transition]').doesNotExist();

        let showChangeComplete = click('button');

        await assert.waitFor(() => {
          assert.dom('[data-test-transition]').hasClass('enter');
          assert.dom('[data-test-transition]').hasClass('from');
        });

        await assert.waitFor(() => {
          assert.dom('[data-test-transition]').hasClass('enter');
          assert.dom('[data-test-transition]').hasClass('to');
          assert.dom('[data-test-transition]').doesNotHaveClass('from');
        });

        await showChangeComplete;

        assert.dom('[data-test-transition]').doesNotHaveClass('enter');
        assert.dom('[data-test-transition]').doesNotHaveClass('to');
      });

      // https://github.com/GavinJoyce/ember-headlessui/issues/113
      skip('should transition in completely (duration defined in seconds)', async function (assert) {
        this.isShown = false;
        this.showTransition = () => {
          this.set('isShown', true);
        };

        await render(hbs`
          <style>
            .enter { transition-duration: .05s }
            .from { opacity: 0% }
            .to { opacity: 100% }
          </style>

          <Transition
            @show={{this.isShown}}
            @enter="enter"
            @enterFrom="from"
            @enterTo="to"
            data-test-transition
          />

          <button {{on 'click' this.showTransition}}>
            Show the transition: {{this.isShown}}
          </button>
        `);

        assert.dom('[data-test-transition]').doesNotExist();

        let showChangeComplete = click('button');

        await assert.waitFor(() => {
          assert.dom('[data-test-transition]').hasClass('enter');
          assert.dom('[data-test-transition]').hasClass('from');
        });

        await assert.waitFor(() => {
          assert.dom('[data-test-transition]').hasClass('enter');
          assert.dom('[data-test-transition]').hasClass('to');
          assert.dom('[data-test-transition]').doesNotHaveClass('from');
        });

        await showChangeComplete;

        assert.dom('[data-test-transition]').doesNotHaveClass('enter');
        assert.dom('[data-test-transition]').doesNotHaveClass('to');
      });

      // https://github.com/GavinJoyce/ember-headlessui/issues/113
      skip('should transition in completely (duration defined in seconds) in (render strategy = hidden)', async function (assert) {
        this.isShown = false;
        this.showTransition = () => {
          this.set('isShown', true);
        };

        await render(hbs`
          <style>
            .enter { transition-duration: .05s }
            .from { opacity: 0% }
            .to { opacity: 100% }
          </style>

          <Transition
            @show={{this.isShown}}
            @unmount={{false}}
            @enter="enter"
            @enterFrom="from"
            @enterTo="to"
            data-test-transition
          />

          <button {{on 'click' this.showTransition}}>
            Show the transition: {{this.isShown}}
          </button>
        `);

        assert.dom('[data-test-transition]').exists();
        assert.dom('[data-test-transition]').isNotVisible();

        let showChangeComplete = click('button');

        await assert.waitFor(() => {
          assert.dom('[data-test-transition]').hasClass('enter');
          assert.dom('[data-test-transition]').hasClass('from');
        });

        await assert.waitFor(() => {
          assert.dom('[data-test-transition]').hasClass('enter');
          assert.dom('[data-test-transition]').hasClass('to');
          assert.dom('[data-test-transition]').doesNotHaveClass('from');
        });

        await showChangeComplete;

        assert.dom('[data-test-transition]').doesNotHaveClass('enter');
        assert.dom('[data-test-transition]').doesNotHaveClass('to');
      });

      // Skipped because this test is already covered above
      skip('should transition in completely');

      // https://github.com/GavinJoyce/ember-headlessui/issues/113
      skip('it should transition out completely', async function (assert) {
        this.isShown = true;
        this.showTransition = () => {
          this.set('isShown', false);
        };

        await render(hbs`
          <style>
            .leave { transition-duration: .1s; }
            .from { opacity: 0%; }
            .to { opacity: 100%; }
          </style>

          <Transition
            @show={{this.isShown}}
            @leave="leave"
            @leaveFrom="from"
            @leaveTo="to"
            data-test-transition
          />

          <button {{on 'click' this.showTransition}}>
            Show the transition: {{this.isShown}}
          </button>
        `);

        let showChangeComplete = click('button');

        await assert.waitFor(() => {
          assert.dom('[data-test-transition]').hasClass('leave');
          assert.dom('[data-test-transition]').hasClass('from');
        });

        await assert.waitFor(() => {
          assert.dom('[data-test-transition]').hasClass('leave');
          assert.dom('[data-test-transition]').hasClass('to');
          assert.dom('[data-test-transition]').doesNotHaveClass('from');
        });

        await showChangeComplete;

        assert.dom('[data-test-transition]').doesNotExist();
      });

      // https://github.com/GavinJoyce/ember-headlessui/issues/113
      skip('should transition out completely (render strategy = hidden)', async function (assert) {
        this.isShown = true;
        this.showTransition = () => {
          this.set('isShown', false);
        };

        await render(hbs`
          <style>
            .leave { transition-duration: .1s; }
            .from { opacity: 0%; }
            .to { opacity: 100%; }
          </style>

          <Transition
            @show={{this.isShown}}
            @unmount={{false}}
            @leave="leave"
            @leaveFrom="from"
            @leaveTo="to"
            data-test-transition
          />

          <button {{on 'click' this.showTransition}}>
            Show the transition: {{this.isShown}}
          </button>
        `);

        let showChangeComplete = click('button');

        await assert.waitFor(() => {
          assert.dom('[data-test-transition]').hasClass('leave');
          assert.dom('[data-test-transition]').hasClass('from');
        });

        await assert.waitFor(() => {
          assert.dom('[data-test-transition]').hasClass('leave');
          assert.dom('[data-test-transition]').hasClass('to');
          assert.dom('[data-test-transition]').doesNotHaveClass('from');
        });

        await showChangeComplete;

        assert.dom('[data-test-transition]').exists();
        assert.dom('[data-test-transition]').isNotVisible();
      });

      // Skipped because this test seems redundant
      skip('should transition in and out completely');

      // Skipped because this test seems redundant
      skip(
        'should transition in and out completely (render strategy = hidden)'
      );
    });

    module('nested transitions', function () {
      // https://github.com/GavinJoyce/ember-headlessui/issues/113
      skip('should not unmount the whole tree when some children are still transitioning', async function (assert) {
        this.isShown = true;
        this.showTransition = () => {
          this.set('isShown', false);
        };

        await render(hbs`
          <style>
            .leave-fast { transition-duration: .1s; }
            .leave-slow { transition-duration: .2s; }
            .from { opacity: 100%; }
            .to { opacity: 0%; }
          </style>
          <Transition @show={{this.isShown}} data-test-transition as |t|>
            <t.Child
              @leave="leave-fast"
              @leaveFrom="from"
              @leaveTo="to"
              data-test-child-fast
            >
              Fast Child
            </t.Child>
            <t.Child
              @leave="leave-slow"
              @leaveFrom="from"
              @leaveTo="to"
              data-test-child-slow
            >
              Slow Child
            </t.Child>
          </Transition>

          <button {{on 'click' this.showTransition}}>
            Show the transition: {{this.isShown}}
          </button>
        `);

        let showChangeComplete = click('button');

        await assert.waitFor(() => {
          assert
            .dom('[data-test-child-fast]')
            .hasClass('from', 'Fast child has `from` class applied');
          assert
            .dom('[data-test-child-slow]')
            .hasClass('leave-slow', 'Slow child has `from` class applied');
        });

        await assert.waitFor(() => {
          assert
            .dom('[data-test-child-fast]')
            .hasClass('to', 'Fast child has `to` class applied');
          assert
            .dom('[data-test-child-slow]')
            .hasClass('to', 'Slow child has `to` class applied');
        });

        await assert.waitFor(() => {
          assert
            .dom('[data-test-child-fast]')
            .doesNotExist('Fast child is hidden after transition duration');

          assert
            .dom('[data-test-child-slow]')
            .hasClass('to', 'Slow child still has `to` class applied');
        });

        await showChangeComplete;

        assert
          .dom('[data-test-transition]')
          .doesNotExist('Transition is completely hidden');
      });

      // Skipped because this seems to require communicating between unrelated `Transition` components
      // Unsure if/how to implement that
      // The name of this test is the same as another, but the actual test includes a `Transition` rendered inside a
      // `Transition::Child`
      skip(
        'should not unmount the whole tree when some children are still transitioning'
      );
    });
  });

  module('Events', function () {
    // https://github.com/GavinJoyce/ember-headlessui/issues/113
    skip('should fire events for all the stages', async function (assert) {
      this.beforeEnter = td.function();
      this.afterEnter = td.function();
      this.beforeLeave = td.function();
      this.afterLeave = td.function();

      this.isShown = false;
      this.toggleTransition = () => {
        this.set('isShown', !this.isShown);
      };

      await render(hbs`
        <style>
          .enter { transition-duration: 50ms }
          .enter-from { opacity: 0% }
          .enter-to { opacity: 100% }
          .leave { transition-duration: 75ms }
          .leave-from { opacity: 100% }
          .leave-to { opacity: 0% }
        </style>

        <Transition
          @show={{this.isShown}}
          @enter="enter"
          @enterFrom="enter-from"
          @enterTo="enter-to"
          @leave="leave"
          @leaveFrom="leave-from"
          @leaveTo="leave-to"
          @beforeEnter={{this.beforeEnter}}
          @afterEnter={{this.afterEnter}}
          @beforeLeave={{this.beforeLeave}}
          @afterLeave={{this.afterLeave}}
          data-test-transition
        />

        <button {{on 'click' this.toggleTransition}}>
          Show the transition: {{this.isShown}}
        </button>
      `);

      assert.verify(
        this.beforeEnter(),
        { times: 0, ignoreExtraArgs: true },
        'The `beforeEnter` argument has not been called yet'
      );

      // Events while showing the transition
      let showChangeComplete = click('button');

      await assert.waitFor(() => {
        assert.verify(
          this.beforeEnter(),
          'The `beforeEnter` argument has been called'
        );
      });

      assert.verify(
        this.afterEnter(),
        { times: 0, ignoreExtraArgs: true },
        'The `afterEnter` hook has not been called yet'
      );

      await assert.waitFor(() => {
        assert
          .dom('[data-test-transition]')
          .hasClass('enter-to', 'The `enter-to` class has been applied');
      });

      await assert.waitFor(() => {
        assert.verify(
          this.afterEnter(),
          'The `afterEnter` hook has been called'
        );
      });

      await showChangeComplete;

      // Events while hiding the transition
      showChangeComplete = click('button');

      await assert.waitFor(() => {
        assert.verify(
          this.beforeLeave(),
          'The `beforeLeave` argument has been called'
        );
      });

      assert.verify(
        this.afterLeave(),
        { times: 0, ignoreExtraArgs: true },
        'The `afterLeave` argument has not been called yet'
      );

      await assert.waitFor(() => {
        assert
          .dom('[data-test-transition]')
          .hasClass('leave-to', 'The `leave-to` class has been applied');
      });

      await assert.waitFor(() => {
        assert.verify(
          this.afterLeave(),
          'The `afterLeave` argument has been called'
        );
      });

      await showChangeComplete;
    });
  });
});
