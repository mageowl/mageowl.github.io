import { goBack } from "./util.js";
import { links } from "./links.js";

export let keyboardSelection = -1;

export function setKeyboardSelection(v) {
  keyboardSelection = v;
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Tab") {
    e.preventDefault();
    if (links.length == 0) return;

    let direction = {
      ArrowUp: -1,
      ArrowDown: 1,
      Tab: e.shiftKey ? -1 : 1,
    }[e.key];

    if (keyboardSelection === -1) {
      setKeyboardSelection(direction === -1 ? links.length - 1 : 0);
    } else {
      setKeyboardSelection(
        (keyboardSelection + direction + links.length) % links.length,
      );
    }

    selector.style.top = `${
      links[keyboardSelection].getBoundingClientRect().top
    }px`;
    setTimeout(() => selector.classList.remove("hidden"), 1);

    e.preventDefault();
  } else if (e.key === " " || e.key === "Enter") {
    links[keyboardSelection].click();
  } else if (e.key === "Backspace") {
    goBack();
  }
});
