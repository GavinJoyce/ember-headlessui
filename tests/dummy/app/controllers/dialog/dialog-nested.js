import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';

export default class DialogDialogNestedController extends Controller {
  @tracked isOpen = false;
}
