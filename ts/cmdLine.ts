import { el } from "./consts.ts";
import { setKeyboardSelection } from "./keyboard.ts";
import { setMessage } from "./messageBar.ts";
import { getTheme, setTheme, THEMES } from "./themes.ts";

export let cmdLineOpen = false;
let input = "";
let autocomplete = "";

export function openCmdline() {
  if (cmdLineOpen) return closeCmdline();

  setKeyboardSelection(-1);
  el.selector.classList.add("hidden");
  el.content.classList.add("hidden");
  document.querySelector("#links > a.selected")?.classList.remove("selected");

  el.cmdLine.classList.remove("hidden");
  updateAutocomplete();
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

export function handleTabAutocomplete() {
  input += autocomplete;
  updateAutocomplete();
}

export function handleEnterCommand() {
  runCommand(input);
  closeCmdline();
}

export function handleAutocomplete() {
  input += el.cmdAutocomplete.innerText;
}

export function runCommand(input: string) {
  const cmd = input.split(" ")[0];
  const fn = COMMANDS[cmd];
  if (fn == null) {
    console.log(`invalid command ${cmd}.`);
  } else {
    fn(input.substring(cmd.length + 1));
  }
}

function updateAutocomplete() {
  if (input.length !== 0) {
    autocomplete = "";
    if (!input.includes(" ")) {
      for (const cmd in COMMANDS) {
        if (Object.hasOwn(COMMANDS, cmd) && cmd.startsWith(input)) {
          // console.log(cmd.substring(input.length));
          autocomplete = cmd.substring(input.length);
          break;
        }
      }
    }
  } else autocomplete = "help";

  el.cmdAutocomplete.innerText = autocomplete;
}

const COMMANDS: { [name: string]: (input: string) => void } = {
  help() {
    router.goto("/cmdline");
  },
  theme(input) {
    const theme = getTheme(input);
    if (theme != null) {
      setTheme(theme);
      localStorage.theme = input;
      if (theme.pride) localStorage.prideTheme = input;
    }
  },
  cd(input) {
    router.goto("/input");
  },
  echo(input) {
    setMessage(input);
  },
};

const urlParam = new URLSearchParams(location.search).get("run");
if (urlParam != null) {
  runCommand(urlParam);
  console.log(location.href.split("?")[0]);
  history.replaceState({}, "", location.href.split("?")[0]);
}
