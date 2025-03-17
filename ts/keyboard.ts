import { goBack } from "./animation.js";
import { el } from "./elements.js";
import { links } from "./links.js";
import {
    handleLetter,
    handleEnterCommand,
    handleBackspace,
    closeCmdline,
    openCmdline,
    cmdLineOpen,
} from "./cmdLine.js";

export let keyboardSelection = -1;
export let inputDisabled = false;

export function setKeyboardSelection(v: number) {
    keyboardSelection = v;
}

export function setInputDisabled(v: boolean) {
    inputDisabled = v;
}

function updateSelection() {
    el.selector.style.top = `${
        links[keyboardSelection]?.getBoundingClientRect().top
    }px`;
}
window.addEventListener("resize", updateSelection);

window.addEventListener("keydown", (e) => {
    if (inputDisabled) e.preventDefault();
    else if (
        cmdLineOpen &&
        "abcdefghijklmnopqrstuvwxyz /-.1234567890".includes(
            e.key.toLowerCase(),
        ) &&
        !(e.ctrlKey || e.metaKey)
    ) {
        handleLetter(e.key.toLowerCase());
        e.preventDefault();
    } else if (cmdLineOpen && e.key === "Enter") {
        handleEnterCommand();
    } else if (cmdLineOpen && e.key === "Backspace") {
        handleBackspace();
    } else if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        openCmdline();
        e.preventDefault();
    } else if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "Tab" ||
        e.key === "j" ||
        e.key === "k"
    ) {
        e.preventDefault();
        if (links.length == 0 || cmdLineOpen) return;

        let direction = {
            ArrowUp: -1,
            ArrowDown: 1,
            Tab: e.shiftKey ? -1 : 1,
            j: 1,
            k: -1,
        }[e.key];

        document.querySelector("a.selected")?.classList.remove("selected");

        if (keyboardSelection === -1) {
            setKeyboardSelection(direction === -1 ? links.length - 1 : 0);
        } else {
            setKeyboardSelection(
                (keyboardSelection + direction + links.length) % links.length,
            );
        }
        links[keyboardSelection].classList.add("selected");

        updateSelection();
        setTimeout(() => el.selector.classList.remove("hidden"), 1);

        e.preventDefault();
    } else if (e.key === " " || e.key === "Enter" || e.key === "l") {
        if (links.length == 0 || keyboardSelection < 0) return;
        links[keyboardSelection].click();
    } else if ((e.key === "Backspace" || e.key === "h") && router.path != "/") {
        goBack();
    } else if (e.key === "Escape") {
        if (cmdLineOpen) {
            closeCmdline();
        } else {
            links[keyboardSelection]?.classList.remove("selected");
            keyboardSelection = -1;
            el.selector.classList.add("hidden");
        }
    }
});
