import Component from '@glimmer/component'
import element from 'ember-element-helper/helpers/element'

interface PopoverOverlayComponentSignature {
  Element: Element
  Args: {
    as?: string
    guid?: string
    popoverGuid?: string
    open?: boolean
  }
  Blocks: {
    default?: []
  }
}

export default class PopoverOverlayComponent extends Component<PopoverOverlayComponentSignature> {
  DEFAULT_TAG_NAME = 'div'

  constructor(owner: unknown, args: PopoverOverlayComponentSignature['Args']) {
    super(owner, args)

    let { popoverGuid } = this.args

    if (!popoverGuid) {
      throw new Error('<Popover::-Overlay /> is missing a parent <Popover /> component.')
    }
  }

  get tagName() {
    return this.args.as || this.DEFAULT_TAG_NAME
  }

  <template>
    {{#let (element this.tagName) as |Tag|}}
      <Tag id={{@guid}} ...attributes>
        {{yield}}
      </Tag>
    {{/let}}
  </template>
}
