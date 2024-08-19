import { setKeyboardSelection } from "./keyboard.js";

const THEMES = {
  dark: {},
  light: {
    className: "light-mode",
  },
};

let currentTheme = localStorage.theme
  ? THEMES[localStorage.theme]
  : THEMES.dark;
setTheme(currentTheme);

const selector = document.querySelector("div#selector");
const themePicker = document.querySelector("div#theme-picker");
const themePickerInput = themePicker.querySelector(".input");
const content = document.querySelector("div#center");
const shaderCanvas = document.querySelector("canvas#shader");

export let pickerOpen = false;
let input = "";

export function openThemePicker() {
  setKeyboardSelection(-1);
  selector.classList.add("hidden");
  content.classList.add("hidden");

  themePicker.classList.remove("hidden");
  pickerOpen = true;
}

export function hideThemePicker() {
  content.classList.remove("hidden");
  themePicker.classList.add("hidden");
  themePickerInput.innerHTML = "";
  pickerOpen = false;
  input = "";
}

export function handleLetter(key) {
  input += key;
  themePickerInput.innerText = input;
}

export function handleBackspace() {
  input = input.slice(0, -1);
  themePickerInput.innerText = input;
}

export function handleEnterTheme() {
  const theme = THEMES[input];
  if (theme != null) {
    setTheme(theme);
    localStorage.theme = input;
  }

  hideThemePicker();
}

function setTheme(theme) {
  if (currentTheme?.className)
    document.documentElement.classList.remove(currentTheme.className);
  if (theme?.className) document.documentElement.classList.add(theme.className);

  currentTheme = theme;
}

function enableShaders() {
  function updateCanvasSize() {
    shaderCanvas.width = innerWidth;
    shaderCanvas.height = innerHeight;
  }

  window.addEventListener("resize", updateCanvasSize);
  updateCanvasSize();

  shaderCanvas.style.display = "block";
}
