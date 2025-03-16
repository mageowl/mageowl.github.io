import { el } from "./elements.js";
import { setKeyboardSelection } from "./keyboard.js";
import { setTheme, THEMES } from "./themes.js";
export let cmdlineOpen = false;
let input = "";
export function openCmdline() {
    setKeyboardSelection(-1);
    el.selector.classList.add("hidden");
    el.content.classList.add("hidden");
    el.themePicker.classList.remove("hidden");
    cmdlineOpen = true;
}
export function closeCmdline() {
    el.content.classList.remove("hidden");
    el.themePicker.classList.add("hidden");
    el.themePickerInput.innerHTML = "";
    cmdlineOpen = false;
    input = "";
}
export function handleLetter(key) {
    input += key;
    el.themePickerInput.innerText = input;
}
export function handleBackspace() {
    input = input.slice(0, -1);
    el.themePickerInput.innerText = input;
}
export function handleEnterCommand() {
    let cmd = input.split(" ")[0];
    COMMANDS[cmd]?.(input.substring(cmd.length + 1));
    closeCmdline();
}
const COMMANDS = {
    help() {
        location.pathname = "cmdline/";
    },
    theme(input) {
        const theme = THEMES[input];
        if (theme != null) {
            setTheme(theme);
            localStorage.theme = input;
            if (theme.pride)
                localStorage.prideTheme = input;
        }
    },
    cd(input) {
        location.pathname = input;
    },
    echo(input) {
        alert(input);
    },
};
