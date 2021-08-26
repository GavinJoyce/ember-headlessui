import Component from '@glimmer/component';

export default class MenuItemElement extends Component {
  get tagNameIsComponent() {
    return typeof this.args.tagName === 'object';
  }
}
