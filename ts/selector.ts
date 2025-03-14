import { links } from "./links.js";
import {
    inputDisabled,
    keyboardSelection,
    setKeyboardSelection,
} from "./keyboard.js";
import { go, goBack } from "./animation.js";
import { cmdlineOpen } from "./cmdline.js";
import { el } from "./elements.js";

function updateSelection() {
    if (inputDisabled || cmdlineOpen) return;

    const selected = document.querySelector("a:hover");

    if (selected != null) {
        setKeyboardSelection(-1);

        el.selector.style.top = `${selected.getBoundingClientRect().top}px`;
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
        el.selector.classList.add("hidden");
    }

    setKeyboardSelection(-1);
});

el.pathBack.addEventListener("click", () => {
    goBack();
});
