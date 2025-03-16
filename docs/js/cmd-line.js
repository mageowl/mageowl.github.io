import { el } from "./elements.js";
import { setKeyboardSelection } from "./keyboard.js";
import { setTheme, THEMES } from "./themes.js";
export let cmdLineOpen = false;
let input = "";
export function openCmdline() {
    setKeyboardSelection(-1);
    el.selector.classList.add("hidden");
    el.content.classList.add("hidden");
    document.querySelector("#links > a.selected")?.classList.remove("selected");
    el.cmdLine.classList.remove("hidden");
    cmdLineOpen = true;
}
export function closeCmdline() {
    el.content.classList.remove("hidden");
    el.cmdLine.classList.add("hidden");
    el.cmdInput.innerHTML = "";
    cmdLineOpen = false;
    input = "";
}
export function handleLetter(key) {
    input += key;
    el.cmdInput.innerText = input;
}
export function handleBackspace() {
    input = input.slice(0, -1);
    el.cmdInput.innerText = input;
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
