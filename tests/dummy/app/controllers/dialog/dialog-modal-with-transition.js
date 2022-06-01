import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';

export default class DialogDialogModalWithTransitionController extends Controller {
  @tracked isOpen = false;
}
