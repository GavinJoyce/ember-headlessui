import { on } from '@ember/modifier'
import Component from '@glimmer/component'
import element from 'ember-element-helper/helpers/element'

interface PopoverButtonComponentSignature {
  Element: Element
  Args: {
    as?: string
    guid?: string
    popoverGuid?: string
    panelGuid?: string
    onClick?: () => void
    open?: boolean
  }
  Blocks: {
    default?: []
  }
}

export default class PopoverButtonComponent extends Component<PopoverButtonComponentSignature> {
  DEFAULT_TAG_NAME = 'button'

  constructor(owner: unknown, args: PopoverButtonComponentSignature['Args']) {
    super(owner, args)

    let { popoverGuid } = this.args

    if (!popoverGuid) {
      throw new Error('<Popover::-Button /> is missing a parent <Popover /> component.')
    }
  }

  get onClick() {
    return this.args.onClick || function () {}
  }

  get tagName() {
    return this.args.as || this.DEFAULT_TAG_NAME
  }

  <template>
    {{#let (element this.tagName) as |Tag|}}
      <Tag
        id={{@guid}}
        aria-controls={{if @open @panelGuid false}}
        aria-expanded={{if @open 'true' false}}
        {{on 'click' this.onClick}}
        ...attributes
      >
        {{yield}}
      </Tag>
    {{/let}}
  </template>
}
