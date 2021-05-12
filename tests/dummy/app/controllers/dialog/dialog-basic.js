import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";

export default class DialogDialogBasicController extends Controller {
  @tracked isOpen = false;
}
