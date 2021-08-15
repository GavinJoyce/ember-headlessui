import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class DialogNestedComponent extends Component {
  @tracked value = false;
}
