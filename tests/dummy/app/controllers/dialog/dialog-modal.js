import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';

export default class DialogDialogModalController extends Controller {
  @tracked isOpen = false;
}
