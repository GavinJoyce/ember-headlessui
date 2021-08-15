import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class DialogDialogModalController extends Controller {
  @tracked isOpen = false;
}
