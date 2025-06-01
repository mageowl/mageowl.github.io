import { el } from "./elements.js";
function color(hex) {
    return [(hex >> 16) / 255, ((hex >> 8) & 0xff) / 255, (hex & 0xff) / 255];
}
export const THEMES = {
    dark: {},
    light: {
        classNames: ["light-mode"],
    },
    pride: {
        classNames: ["transparent", "light-mode"],
        pride: true,
        shader: {
            frag: "glsl/pride.glsl",
        },
    },
    bisexual: {
        classNames: ["transparent", "light-mode"],
        pride: true,
        shader: {
            frag: "glsl/gradient_noclamp.glsl",
            uniforms: {
                color1: color(0xdb3ffd),
                color2: color(0x7a09fa),
                color3: color(0x3003d9),
            },
        },
    },
    trans: {
        classNames: ["transparent", "light-mode"],
        pride: true,
        shader: {
            frag: "glsl/gradient.glsl",
            uniforms: {
                color1: color(0x58c8f2),
                color2: [1, 1, 1],
                color3: color(0xeda4b2),
            },
        },
    },
    enby: {
        classNames: ["transparent", "light-mode"],
        pride: true,
        shader: {
            frag: "glsl/gradient_noclamp.glsl",
            uniforms: {
                color1: color(0xF6B94B),
                color2: color(0x9B59D0),
                color3: color(0x3C234D),
            },
        },
    },
    lesbian: {
        classNames: ["transparent", "light-mode"],
        pride: true,
        shader: {
            frag: "glsl/gradient.glsl",
            uniforms: {
                color1: color(0xd42c00),
                color2: color(0xdc8fa2),
                color3: color(0xa20161),
            },
        },
    },
    gay: {
        classNames: ["transparent", "light-mode"],
        pride: true,
        shader: {
            frag: "glsl/gradient.glsl",
            uniforms: {
                color1: color(0x21cfac),
                color2: color(0x4391c2),
                color3: color(0x4f47cd),
            },
        },
    },
    fire: {
        classNames: ["transparent", "fire"],
        shader: {
            frag: "glsl/fire.glsl",
        },
    },
    retro: {
        classNames: ["retro", "no-anim"],
    },
    alpha: {
        classNames: ["transparent"],
    },
};
const isPrideMonth = new Date().getMonth() === 5;
if (isPrideMonth) {
    el.messageBar.classList.remove("hide");
    const message = "HAPPY PRIDE MONTH\u00a0\u00a0";
    el.messageBarContent.innerText = message;
    const msgWidth = el.messageBarContent.clientWidth;
    const screenWidth = Math.ceil(innerWidth / msgWidth);
    console.log(screenWidth);
    let text = "";
    for (let i = 0; i <= screenWidth; i++) {
        text += message;
    }
    el.messageBar.style.setProperty("--msg-width", msgWidth + "px");
    el.messageBarContent.innerText = text;
}
let currentTheme = THEMES[localStorage.theme || "dark"];
let shadersEnabled = false;
setTheme(currentTheme);
let shaders;
export async function setTheme(theme) {
    if (isPrideMonth && !theme.pride) {
        theme = THEMES[localStorage.prideTheme || "pride"];
    }
    if (currentTheme?.classNames) {
        currentTheme.classNames.forEach((n) => document.documentElement.classList.remove(n));
    }
    if (theme?.classNames) {
        theme.classNames.forEach((n) => document.documentElement.classList.add(n));
    }
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
    shaders.unset();
}
