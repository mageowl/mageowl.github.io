import { keyboardSelection, setKeyboardSelection } from "./keyboard.js";
import { links } from "./links.js";

export function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function go(to) {
  document.querySelector("#links").classList.add("hidden");
  document.querySelector("#selector").classList.add("hidden");
  await sleep(200);
  await router.goto(to, {}, true);
  await sleep(200);
  document.querySelector("#links").classList.remove("hidden");

  if (keyboardSelection != -1) {
    setKeyboardSelection(0);
    selector.style.top = `${
      links[keyboardSelection].getBoundingClientRect().top
    }px`;
    setTimeout(
      () => document.querySelector("#selector").classList.remove("hidden"),
      1,
    );
  }
}

export async function goBack() {
  document.querySelector("#links").classList.add("hidden");
  document.querySelector("#selector").classList.add("hidden");
  await sleep(200);
  history.back();
  await sleep(200);
  document.querySelector("#links").classList.remove("hidden");

  if (keyboardSelection != -1) {
    if (links.length > 0) {
      setKeyboardSelection(0);
      selector.style.top = `${
        links[keyboardSelection].getBoundingClientRect().top
      }px`;
      setTimeout(
        () => document.querySelector("#selector").classList.remove("hidden"),
        1,
      );
    } else {
      setKeyboardSelection(-1);
    }
  }
}
