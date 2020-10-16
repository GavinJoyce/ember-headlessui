import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

const isMac = navigator.userAgent.indexOf("Mac OS X") !== -1;

const KeyDisplay = isMac
  ? {
      ArrowUp: "↑",
      ArrowDown: "↓",
      ArrowLeft: "←",
      ArrowRight: "→",
      Home: "↖",
      End: "↘",
      Alt: "⌥",
      CapsLock: "⇪",
      Meta: "⌘",
      Shift: "⇧",
      Control: "⌃",
      Backspace: "⌫",
      Delete: "⌦",
      Enter: "↵",
      Escape: "⎋",
      Tab: "⇥",
      ShiftTab: "⇤",
      PageUp: "⇞",
      PageDown: "⇟",
      " ": "␣",
    }
  : {
      ArrowUp: "↑",
      ArrowDown: "↓",
      ArrowLeft: "←",
      ArrowRight: "→",
      Meta: "Win",
      Control: "Ctrl",
      Backspace: "⌫",
      Delete: "Del",
      Escape: "Esc",
      PageUp: "PgUp",
      PageDown: "PgDn",
      " ": "␣",
    };

export default class extends Component {
  window = window;
  @tracked keys = [];

  get displayedKeys() {
    return this.keys.slice().reverse().join(" ");
  }

  @action
  onWindowKeydown(event) {
    let { keys } = this;

    keys.unshift(
      event.shiftKey && event.key !== "Shift"
        ? KeyDisplay[`Shift${event.key}`] ?? event.key
        : KeyDisplay[event.key] ?? event.key
    );

    this.keys = keys;

    setTimeout(() => {
      if (!this.isDestroying) {
        let { keys } = this;

        keys.pop();
        this.keys = keys;
      }
    }, 2000);
  }
}
