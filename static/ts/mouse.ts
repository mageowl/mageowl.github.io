import { links } from "./links.ts";
import {
  inputDisabled,
  keyboardSelection,
  setKeyboardSelection,
} from "./keyboard.ts";
import { go, goBack } from "./animation.ts";
import { cmdLineOpen } from "./cmdLine.ts";
import { el } from "./consts.ts";

function updateSelection() {
  if (inputDisabled || cmdLineOpen) return;

  document.querySelector("a.selected")?.classList.remove("selected");
  const selected = document.querySelector("#links > a:hover");

  if (selected != null) {
    setKeyboardSelection(-1);

    el.selector.style.top = `${selected.getBoundingClientRect().top}px`;
    selected.classList.add("selected");
    setTimeout(() => el.selector.classList.remove("hidden"), 1);
  } else {
    el.selector.classList.add("hidden");
  }
}

function updateLinks() {
  links.forEach((link) => {
    link.addEventListener("mouseenter", updateSelection);
    link.addEventListener("mouseleave", updateSelection);

    if (
      link.origin != origin ||
      link.hasAttribute("data-force-reload")
    ) {
      return;
    }

    link.addEventListener("click", (e) => {
      e.preventDefault();
      go(link.href);
    });
  });
}
updateLinks();

addEventListener("navigate", updateLinks);

function hideSelector() {
  if (keyboardSelection !== -1) {
    document.querySelector("a.selected")?.classList.remove("selected");
    el.selector.classList.add("hidden");
  }

  setKeyboardSelection(-1);
}
addEventListener("mousemove", hideSelector);
addEventListener("wheel", hideSelector);

el.pathBack.addEventListener("click", () => {
  goBack();
});
