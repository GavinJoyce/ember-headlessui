import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class DialogDialogNestedController extends Controller {
  @tracked isOpen = false;
}
