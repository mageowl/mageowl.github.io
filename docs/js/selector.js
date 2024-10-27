import { links } from "./links.js";
import {
    inputDisabled,
    keyboardSelection,
    setKeyboardSelection,
} from "./keyboard.js";
import { go, goBack } from "./animation.js";
import { pickerOpen } from "./themes.js";

const selector = document.querySelector("div#selector");

function updateSelection() {
    if (inputDisabled || pickerOpen) return;

    const selected = document.querySelector("a:hover");

    if (selected != null) {
        setKeyboardSelection(-1);

        selector.style.top = `${selected.getBoundingClientRect().top}px`;
        setTimeout(() => selector.classList.remove("hidden"), 1);
    } else {
        selector.classList.add("hidden");
    }
}

function updateLinks() {
    links.forEach((link) => {
        link.addEventListener("mouseenter", updateSelection);
        link.addEventListener("mouseleave", updateSelection);

        if (
            link.origin != window.origin ||
            link.hasAttribute("data-force-reload")
        )
            return;

        link.addEventListener("click", (e) => {
            e.preventDefault();
            go(link.href);
        });
    });
}
updateLinks();

window.addEventListener("navigate", updateLinks);

window.addEventListener("mousemove", () => {
    if (keyboardSelection !== -1) {
        selector.classList.add("hidden");
    }

    setKeyboardSelection(-1);
});

let pathBack = document.querySelector("h1#path-back");
pathBack.addEventListener("click", () => {
    goBack();
});
