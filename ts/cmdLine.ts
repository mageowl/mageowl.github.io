import { el } from "./elements.js";
import { setKeyboardSelection } from "./keyboard.js";
import { setTheme, THEMES } from "./themes.js";

export let cmdLineOpen = false;
let input = "";

export function openCmdline() {
    if (cmdLineOpen) return closeCmdline();

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
    el.cmdAutocomplete.innerText = "";
    cmdLineOpen = false;
    input = "";
}

export function handleLetter(key: string) {
    input += key;
    el.cmdInput.innerText = input;
    updateAutocomplete();
}

export function handleBackspace() {
    input = input.slice(0, -1);
    el.cmdInput.innerText = input;
    updateAutocomplete();
}

export function handleEnterCommand() {
    let cmd = input.split(" ")[0];
    COMMANDS[cmd]?.(input.substring(cmd.length + 1));

    closeCmdline();
}

export function handleAutocomplete() {
    input += el.cmdAutocomplete.innerText;
}

function updateAutocomplete() {
    if (input.length !== 0)
        for (const cmd in COMMANDS) {
            if (COMMANDS.hasOwnProperty(cmd) && cmd.startsWith(input)) {
                console.log(cmd.substring(input.length));
                el.cmdAutocomplete.innerText = cmd.substring(input.length);
                return;
            }
        }
    el.cmdAutocomplete.innerText = "";
}

const COMMANDS: { [name: string]: (input: string) => void } = {
    help() {
        location.pathname = "cmdline/";
    },
    theme(input) {
        const theme = THEMES[input];
        if (theme != null) {
            setTheme(theme);
            localStorage.theme = input;
            if (theme.pride) localStorage.prideTheme = input;
        }
    },
    cd(input) {
        location.pathname = input;
    },
    echo(input) {
        alert(input);
    },
};
