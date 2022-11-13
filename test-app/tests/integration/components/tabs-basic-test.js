import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | Component | <Tabs>', function (hooks) {
  setupRenderingTest(hooks);
  test('Should render the tabs component', async function (assert) {
    await render(hbs`
        <div class='w-full max-w-md px-2 py-16 mx-auto'>
        <TabsGroup class="flex flex-col space-x-1 rounded-xl p-1" @onChange = {{this.onChange}} as |tabs|>
            <div class='flex space-x-1 rounded-xl bg-sky-600/20 p-1'>
                <tabs.Title
                    @index={{1}}
                    class='w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 space-x-4'
                    >
                    hello
                </tabs.Title>
                <tabs.Title 
                    @index={{2}} 
                    @disable={{true}}
                    class='w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 space-x-4'>
                    hell02
                </tabs.Title>
                <tabs.Title 
                    @index={{3}} 
                    class='w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 space-x-4'>
                    hell03
                </tabs.Title>
                <tabs.Title 
                    @index={{4}} 
                    class='w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 space-x-4'>
                    hell04
                </tabs.Title>
            </div>
            <div class="mx-auto w-full max-w-md shadow-md px-4 py-4 rounded-xl bg-white mt-4">
                <tabs.Content class="content">
                    <p>hello world</p>
                </tabs.Content>
                <tabs.Content class="content">
                    <p>hello world 2</p>
                </tabs.Content>
                <tabs.Content class="content">
                    <p>hello world 3</p>
                </tabs.Content>
                <tabs.Content class="content">
                    <p>hello world 4</p>
                </tabs.Content>
            </div>
        </TabsGroup>
    </div>`);
    assert.dom('[data-test-ember-headlessui-tabs-wrapper]').exists();
  });

  test('Should render the respective content when a tab is selected', async function (assert) {
    await render(hbs`<div class='w-full max-w-md px-2 py-16 mx-auto'>
        <TabsGroup class="flex flex-col space-x-1 rounded-xl p-1" as |tabs|>
            <div class='flex space-x-1 rounded-xl bg-sky-600/20 p-1'>
                <tabs.Title
                    @index={{1}}
                    class='w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 space-x-4'
                    >
                    hello
                </tabs.Title>
                <tabs.Title 
                    @index={{2}} 
                    @disable={{true}}
                    class='w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 space-x-4'>
                    hell02
                </tabs.Title>
                <tabs.Title 
                    @index={{3}} 
                    class='w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 space-x-4'>
                    hell03
                </tabs.Title>
                <tabs.Title 
                    @index={{4}} 
                    class='w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 space-x-4'>
                    hell04
                </tabs.Title>
            </div>
            <div class="mx-auto w-full max-w-md shadow-md px-4 py-4 rounded-xl bg-white mt-4">
                <tabs.Content class="content" @content-index={{1}}>
                    <p>hello world</p>
                </tabs.Content>
                <tabs.Content class="content"  @content-index={{2}}>
                    <p>hello world 2</p>
                </tabs.Content>
                <tabs.Content class="content"  @content-index={{3}}>
                    <p>hello world 3</p>
                </tabs.Content>
                <tabs.Content class="content"  @content-index={{4}}>
                    <p>hello world 4</p>
                </tabs.Content>
            </div>
        </TabsGroup>
    </div>
`);
    await click('[data-test-headlessui-tabs-title="test-tabs-title-btn-3"]');
    assert
      .dom('[data-test-headlessui-tabs-content="test-tabs-content-1"]')
      .doesNotExist();
    assert
      .dom('[data-test-headlessui-tabs-content="test-tabs-content-2"]')
      .doesNotExist();
    assert
      .dom('[data-test-headlessui-tabs-content="test-tabs-content-4"]')
      .doesNotexist();
    assert
      .dom('[data-test-headlessui-tabs-content="test-tabs-content-3"]')
      .exists();
  });

  test();
});
