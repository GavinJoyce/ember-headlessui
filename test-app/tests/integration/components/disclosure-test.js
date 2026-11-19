import { hbs } from 'ember-cli-htmlbars';
import  { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render} from '@ember/test-helpers';

module('Integration | Component | <Disclosure>', (hooks) => {
  setupRenderingTest(hooks);

  test('it should render disclosure component', async function (assert) {
    await render(hbs`
      <Disclosure as |disclosure|>
        <span class='rounded-md shadow-sm'>
          <disclosure.Button @index={{1}}
            class='flex mt-2 w-full justify-between rounded-lg bg-indigo-500 px-4 py-2 text-left text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 pb-2 mb-2'>
            <span>What is your refund policy?</span>
            <svg class='w-5 h-5 ml-2 -mr-1
                    {{if disclosure.isOpen "transform rotate-180"}}' viewBox='0 0 20 20' fill='currentColor'>
              <path fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'></path>
            </svg>
          </disclosure.Button>
          <disclosure.Panel @index={{1}} class='px-4 pt-4 pb-4 text-sm text-gray-500'>
            If you're unhappy with your purchase for any reason, email us within
            90 days and we'll refund you in full, no questions asked.
          </disclosure.Panel>
        </span>
      </Disclosure>
    `);
    assert.dom('[data-test-ember-headlessui-disclosure-wrapper]').exists();
  });

  test('it should render disclosure component titles', async function (assert) {
    await render(hbs`
      <Disclosure as |disclosure|>
        <span class='rounded-md shadow-sm'>
          <disclosure.Button @index={{1}}
            class='flex mt-2 w-full justify-between rounded-lg bg-indigo-500 px-4 py-2 text-left text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 pb-2 mb-2'>
            <span>What is your refund policy?</span>
            <svg class='w-5 h-5 ml-2 -mr-1
                    {{if disclosure.isOpen "transform rotate-180"}}' viewBox='0 0 20 20' fill='currentColor'>
              <path fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'></path>
            </svg>
          </disclosure.Button>
          <disclosure.Panel @index={{1}} class='px-4 pt-4 pb-4 text-sm text-gray-500'>
            If you're unhappy with your purchase for any reason, email us within
            90 days and we'll refund you in full, no questions asked.
          </disclosure.Panel>
        </span>
      </Disclosure>
      <Disclosure as |disclosure|>
        <span class='rounded-md shadow-sm'>
          <disclosure.Button @index={{2}}
            class='flex mt-2 w-full justify-between rounded-lg bg-indigo-500 px-4 py-2 text-left text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 pb-2 mb-2'>
            <span>Do you provide technical support ?</span>
            <svg class='w-5 h-5 ml-2 -mr-1
                    {{if disclosure.isOpen "transform rotate-180"}}' viewBox='0 0 20 20' fill='currentColor'>
              <path fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'></path>
            </svg>
          </disclosure.Button>
          <disclosure.Panel @index={{2}} class='px-4 pt-4 pb-4 text-sm text-gray-500'>
           No
          </disclosure.Panel>
        </span>
      </Disclosure>
    `);
    assert.dom('[data-test-headlessui-disclosure-button="test-disclosure-btn-1"]').hasText('What is your refund policy?')
    assert.dom('[data-test-headlessui-disclosure-button="test-disclosure-btn-2"]').hasText('Do you provide technical support ?')
  });

  test('it should render disclosure component panel description', async function (assert) {
    await render(hbs`
      <Disclosure as |disclosure|>
        <span class='rounded-md shadow-sm'>
          <disclosure.Button @index={{1}}
            class='flex mt-2 w-full justify-between rounded-lg bg-indigo-500 px-4 py-2 text-left text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 pb-2 mb-2'>
            <span>What is your refund policy?</span>
            <svg class='w-5 h-5 ml-2 -mr-1
                    {{if disclosure.isOpen "transform rotate-180"}}' viewBox='0 0 20 20' fill='currentColor'>
              <path fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'></path>
            </svg>
          </disclosure.Button>
          <disclosure.Panel @index={{1}} class='px-4 pt-4 pb-4 text-sm text-gray-500'>
            If you're unhappy with your purchase for any reason, email us within
            90 days and we'll refund you in full, no questions asked.
          </disclosure.Panel>
        </span>
      </Disclosure>
      <Disclosure as |disclosure|>
        <span class='rounded-md shadow-sm'>
          <disclosure.Button @index={{2}}
            class='flex mt-2 w-full justify-between rounded-lg bg-indigo-500 px-4 py-2 text-left text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 pb-2 mb-2'>
            <span>Do you provide technical support ?</span>
            <svg class='w-5 h-5 ml-2 -mr-1
                    {{if disclosure.isOpen "transform rotate-180"}}' viewBox='0 0 20 20' fill='currentColor'>
              <path fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'></path>
            </svg>
          </disclosure.Button>
          <disclosure.Panel @index={{2}} class='px-4 pt-4 pb-4 text-sm text-gray-500'>
           No
          </disclosure.Panel>
        </span>
      </Disclosure>
    `);
    await click('[data-test-headlessui-disclosure-button="test-disclosure-btn-1"]');
    await click('[data-test-headlessui-disclosure-button="test-disclosure-btn-2"]');
    assert.dom('[data-test-headlessui-disclosure-panel="disclosure-panel-1"]').hasText(`If you're unhappy with your purchase for any reason, email us within
            90 days and we'll refund you in full, no questions asked.`);
    assert.dom('[data-test-headlessui-disclosure-panel="disclosure-panel-2"]').hasText('No');
  });

  test('check the toggle for disclosure component', async function (assert) {
    await render(hbs`
      <Disclosure as |disclosure|>
        <span class='rounded-md shadow-sm'>
          <disclosure.Button @index={{1}}
            class='flex mt-2 w-full justify-between rounded-lg bg-indigo-500 px-4 py-2 text-left text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 pb-2 mb-2'>
            <span>What is your refund policy?</span>
            <svg class='w-5 h-5 ml-2 -mr-1
                    {{if disclosure.isOpen "transform rotate-180"}}' viewBox='0 0 20 20' fill='currentColor'>
              <path fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'></path>
            </svg>
          </disclosure.Button>
          <disclosure.Panel @index={{1}} class='px-4 pt-4 pb-4 text-sm text-gray-500'>
            If you're unhappy with your purchase for any reason, email us within
            90 days and we'll refund you in full, no questions asked.
          </disclosure.Panel>
        </span>
      </Disclosure>
      <Disclosure as |disclosure|>
        <span class='rounded-md shadow-sm'>
          <disclosure.Button @index={{2}}
            class='flex mt-2 w-full justify-between rounded-lg bg-indigo-500 px-4 py-2 text-left text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 pb-2 mb-2'>
            <span>Do you provide technical support ?</span>
            <svg class='w-5 h-5 ml-2 -mr-1
                    {{if disclosure.isOpen "transform rotate-180"}}' viewBox='0 0 20 20' fill='currentColor'>
              <path fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'></path>
            </svg>
          </disclosure.Button>
          <disclosure.Panel @index={{2}} class='px-4 pt-4 pb-4 text-sm text-gray-500'>
           No
          </disclosure.Panel>
        </span>
      </Disclosure>
    `);
    assert.dom('[data-test-headlessui-disclosure-panel="disclosure-panel-1"]').doesNotExist();
    await click('[data-test-headlessui-disclosure-button="test-disclosure-btn-1"]');
    assert.dom('[data-test-headlessui-disclosure-panel="disclosure-panel-1"]').exists();
    await click('[data-test-headlessui-disclosure-button="test-disclosure-btn-2"]');
    assert.dom('[data-test-headlessui-disclosure-panel="disclosure-panel-2"]').exists();
    await click('[data-test-headlessui-disclosure-button="test-disclosure-btn-2"]');
    assert.dom('[data-test-headlessui-disclosure-panel="disclosure-panel-1"]').exists();
    assert.dom('[data-test-headlessui-disclosure-panel="disclosure-panel-2"]').doesNotExist();
    await click('[data-test-headlessui-disclosure-button="test-disclosure-btn-1"]');
    assert.dom('[data-test-headlessui-disclosure-panel="disclosure-panel-1"]').doesNotExist();
    assert.dom('[data-test-headlessui-disclosure-panel="disclosure-panel-2"]').doesNotExist();
  });
});