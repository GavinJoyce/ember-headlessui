import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";

export default class DialogDialogSlideOverController extends Controller {
  @tracked isOpen = false;
}
