import Component from "@glimmer/component";
import { action } from "@ember/object";
import { next } from "@ember/runloop";

export default class Button extends Component {
  @action
  onKeydown(event) {
    switch (event.key) {
      case " ":
      case "Enter":
      case "ArrowDown":
        event.preventDefault();
        this.args.openMenu();

        next(() => {
          this.args.goToFirstItem();
        });
        break;

      case "ArrowUp":
        event.preventDefault();
        this.args.openMenu();

        next(() => {
          this.args.goToLastItem();
        });
        break;
    }
  }
}
