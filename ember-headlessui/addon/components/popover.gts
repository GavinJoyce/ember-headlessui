import Component from '@glimmer/component'
import { guidFor } from '@ember/object/internals'
import { tracked } from '@glimmer/tracking'
import { action } from '@ember/object'
import PopoverButtonComponent from './popover/button'
import PopoverPanelComponent from './popover/panel'
import PopoverOverlayComponent from './popover/overlay'
import { hash } from '@ember/helper'
import element from 'ember-element-helper/helpers/element'
import { ensureSafeComponent } from '@embroider/util';


export interface PopoverComponentSignature {
  Element: Element
  Args: {
    as?: string
  }
  Blocks: {
    default: [
      {
        isOpen: boolean
        close: () => void
        toggle: () => void
        Button: typeof PopoverButtonComponent
        Panel: typeof PopoverPanelComponent
        Overlay: typeof PopoverOverlayComponent
      },
    ]
  }
}

export default class PopoverComponent extends Component<PopoverComponentSignature> {
  DEFAULT_TAG_NAME = 'div'

  guid = `${guidFor(this)}-headlessui-popover`

  @tracked isOpen = false

  get tagName() {
    return this.args.as || this.DEFAULT_TAG_NAME
  }

  get buttonGuid() {
    return `${this.guid}-button`
  }

  get panelGuid() {
    return `${this.guid}-panel`
  }

  get overlayGuid() {
    return `${this.guid}-overlay`
  }

  @action
  handleButtonClick() {
    this.isOpen = !this.isOpen
  }

  @action
  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  @action
  open() {
    this.isOpen = true
  }

  @action
  close() {
    this.isOpen = false
  }

  <template>
    {{#let (element this.tagName) as |Tag|}}
      <Tag id={{this.guid}} ...attributes>
        {{yield
          (hash
            isOpen=this.isOpen
            close=this.close
            toggle=this.toggle
            Button=(component
              (ensureSafeComponent PopoverButtonComponent this)
              guid=this.buttonGuid
              popoverGuid=this.guid
              panelGuid=this.panelGuid
              open=this.isOpen
              onClick=this.handleButtonClick
            )
            Panel=(component
              (ensureSafeComponent PopoverPanelComponent this)
              guid=this.panelGuid
              popoverGuid=this.guid
              panelGuid=this.panelGuid
              buttonGuid=this.buttonGuid
              open=this.isOpen
              close=this.close
            )
            Overlay=(component
              (ensureSafeComponent PopoverOverlayComponent this)
              guid=this.overlayGuid
              popoverGuid=this.guid 
              open=this.isOpen
            )
          )
        }}
      </Tag>
    {{/let}}
  </template>
}
