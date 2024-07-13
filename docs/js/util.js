import { keyboardSelection, setKeyboardSelection } from "./keyboard.js";
import { links } from "./links.js";

export function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function animationStart(reverse = false) {
  document
    .querySelector("#links")
    .classList.add("hidden", reverse ? "right" : "left");
  document.querySelector("#selector").classList.add("hidden");

  let titleOffset = document
    .querySelector("#title")
    .getBoundingClientRect().width;
  document.querySelector("#title").style.transform =
    `translateX(-${titleOffset}px)`;
  document.querySelector("#title").classList.add("moving");
}

function animationEnd(reverse = false) {
  document
    .querySelector("#links")
    .classList.remove("hidden", reverse ? "left" : "right");

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
      setKeyboardSelection(-2);
    }
  }
}

export async function go(to) {
  animationStart();
  await sleep(200);
  document.querySelector("#links").classList.replace("left", "right");
  await router.goto(to, {}, true);
  document.querySelector("#title").style.transform = "none";
  document.querySelector("#title").classList.remove("moving");
  await sleep(200);
  animationEnd();
}

export async function goBack() {
  animationStart(true);
  await sleep(200);
  document.querySelector("#links").classList.replace("right", "left");
  history.back();
  document.querySelector("#title").style.transform = "none";
  document.querySelector("#title").classList.remove("moving");
  await sleep(200);
  animationEnd(true);
}
