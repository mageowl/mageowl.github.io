import { goBack } from "./util.js";
import { links } from "./links.js";
import {
  handleLetter,
  handleEnterTheme,
  handleBackspace,
  hideThemePicker,
  openThemePicker,
  pickerOpen,
} from "./themes.js";

export let keyboardSelection = -1;
export let inputDisabled = false;

const selector = document.querySelector("div#selector");

export function setKeyboardSelection(v) {
  keyboardSelection = v;
}

export function setInputDisabled(v) {
  inputDisabled = v;
}

window.addEventListener("keydown", (e) => {
  if (inputDisabled) e.preventDefault();
  else if (
    pickerOpen &&
    "abcdefghijklmnopqrstuvwxyz ".includes(e.key.toLowerCase()) &&
    !(e.ctrlKey || e.metaKey)
  ) {
    handleLetter(e.key.toLowerCase());
  } else if (pickerOpen && e.key === "Enter") {
    handleEnterTheme();
  } else if (pickerOpen && e.key === "Backspace") {
    handleBackspace();
  } else if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Tab") {
    e.preventDefault();
    if (links.length == 0 || pickerOpen) return;

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
    if (links.length == 0 || keyboardSelection < 0) return;
    links[keyboardSelection].click();
  } else if (e.key === "Backspace" && router.path != "/") {
    goBack();
  } else if (e.key === "Escape") {
    if (pickerOpen) {
      hideThemePicker();
    } else {
      keyboardSelection = -1;
      selector.classList.add("hidden");
    }
  } else if (e.key === "k" && e.ctrlKey) {
    openThemePicker();
    e.preventDefault();
  }
});
