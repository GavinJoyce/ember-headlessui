import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';

export default class DialogDialogSlideOverController extends Controller {
  @tracked isOpen = false;
}
