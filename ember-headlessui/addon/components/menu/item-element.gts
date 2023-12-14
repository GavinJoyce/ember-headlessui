import Component from '@glimmer/component';
import { element, type ElementFromTagName, type ElementSignature } from 'ember-element-helper';
import { on } from '@ember/modifier';
import { FunctionBasedModifier} from 'ember-modifier';

import or from 'ember-truth-helpers/helpers/or';

function noop() {
  return function () {}
}

interface ItemElementSignature<
  T extends string = 'a'
> {
  Element: Element | ElementFromTagName<T>;
  Args: {
    tagName?: string | typeof Component;
    guid?: string;
    isActive?: boolean; 
    isDisabled?: boolean; 
    registerItemElement?: FunctionBasedModifier<ElementSignature<T>['Return']>;
    onMouseOver?: (event: MouseEvent) => void;
    onClick?: (event: MouseEvent) => void;
  };
  Blocks: {
    default: [];
  };
}
 
export default class ItemElement extends Component<ItemElementSignature> {

  get tagAsComponent () {
    return this.args.tagName instanceof Component ? this.args.tagName as Component: null;
  }

  get tagAsString () {
    return typeof this.args.tagName === 'string' ? this.args.tagName : null;
  }

  <template>
    {{#let
      (or this.tagAsComponent (element (or this.tagAsString 'a')))
      as |Tag|
    }}
      <Tag
        ...attributes
        id={{@guid}}
        role='menuitem'
        tabindex='-1'
        disabled={{@isDisabled}}
        data-disabled={{@isDisabled}}
        {{@registerItemElement}}
        {{on 'mouseover' (or @onMouseOver (noop))}}
        {{on 'click' (or @onClick (noop))}}
      >
        {{yield}}
      </Tag>

      <Component/>
    {{/let}}
  </template>

}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Menu::ItemElement': typeof ItemElement;
    'menu/item-element': typeof ItemElement;
  }
}