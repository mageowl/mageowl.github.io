import { el } from "./elements.js";
import { setKeyboardSelection } from "./keyboard.js";

interface Theme {
    classNames?: string[];
    shader?: {
        frag: string;
    };
}

const THEMES: { [key: string]: Theme } = {
    dark: {},
    light: {
        classNames: ["light-mode"],
    },
    gay: {
        classNames: ["pride", "gay"],
        shader: {
            frag: "glsl/pride.glsl",
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

export function handleLetter(key: string) {
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

let shaders: typeof import("./shaders.js");
async function setTheme(theme: Theme) {
    if (currentTheme?.classNames)
        currentTheme.classNames.forEach((n) =>
            document.documentElement.classList.remove(n),
        );
    if (theme?.classNames)
        theme.classNames.forEach((n) =>
            document.documentElement.classList.add(n),
        );
    if (theme?.shader) {
        if (!shadersEnabled) await enableShaders();
        shaders.set(theme.shader.frag);
    } else if (currentTheme?.shader) {
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
