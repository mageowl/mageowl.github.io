import { el } from "./elements.js";
import { setKeyboardSelection } from "./keyboard.js";
const THEMES = {
    dark: {},
    light: {
        classNames: ["light-mode"],
    },
    gay: {
        classNames: ["pride", "light-mode"],
        shader: {
            frag: "glsl/rainbow.glsl",
        },
    },
};
let currentTheme = localStorage.theme
    ? THEMES[localStorage.theme]
    : THEMES.dark;
export let pickerOpen = false;
let shadersEnabled = false;
let input = "";
setTheme(currentTheme);
export function openThemePicker() {
    setKeyboardSelection(-1);
    el.selector.classList.add("hidden");
    el.content.classList.add("hidden");
    el.themePicker.classList.remove("hidden");
    pickerOpen = true;
}
export function hideThemePicker() {
    el.content.classList.remove("hidden");
    el.themePicker.classList.add("hidden");
    el.themePickerInput.innerHTML = "";
    pickerOpen = false;
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
export function handleEnterTheme() {
    const theme = THEMES[input];
    if (theme != null) {
        setTheme(theme);
        localStorage.theme = input;
    }
    hideThemePicker();
}
let shaders;
async function setTheme(theme) {
    if (currentTheme?.classNames)
        currentTheme.classNames.forEach((n) => document.documentElement.classList.remove(n));
    if (theme?.classNames)
        theme.classNames.forEach((n) => document.documentElement.classList.add(n));
    if (theme?.shader) {
        if (!shadersEnabled)
            await enableShaders();
        shaders.set(theme.shader.frag, theme.shader.uniforms ?? {});
    }
    else if (currentTheme?.shader) {
        disableShaders();
    }
    currentTheme = theme;
}
async function enableShaders() {
    function updateCanvasSize() {
        el.shaderCanvas.width = innerWidth;
        el.shaderCanvas.height = innerHeight;
    }
    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();
    el.shaderCanvas.style.display = "block";
    shaders = await import("./shaders.js");
}
function disableShaders() {
    el.shaderCanvas.style.display = "none";
}
