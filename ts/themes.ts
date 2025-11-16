import { el, isPrideMonth } from "./consts.ts";
import { setMessage } from "./messageBar.ts";

interface Theme {
  classNames?: string[];
  pride?: boolean;
  message?: string;
  shader?: {
    frag: string;
    uniforms?: { [name: string]: number[] };
  };
}

function color(hex: number): [number, number, number] {
  return [(hex >> 16) / 255, ((hex >> 8) & 0xff) / 255, (hex & 0xff) / 255];
}

export const THEMES: { [key: string]: Theme } = {
  dark: {},
  light: {
    classNames: ["light-mode"],
  },
  pride: {
    classNames: ["transparent", "light-mode", "no-invert"],
    pride: true,
    message: "HAPPY PRIDE",
    shader: {
      frag: "glsl/pride.glsl",
    },
  },
  bisexual: {
    classNames: ["transparent", "light-mode", "no-invert"],
    pride: true,
    message: "GIRLS AND BOYS AND ENBIES AND\u00a0",
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
    classNames: ["transparent", "light-mode", "no-invert"],
    pride: true,
    message: "TRANS PEOPLE ARE PEOPLE",
    shader: {
      frag: "glsl/gradient.glsl",
      uniforms: {
        color1: color(0x58c8f2),
        color2: [1, 1, 1],
        color3: color(0xeda4b2),
      },
    },
  },
  nonbinary: {
    classNames: ["transparent", "no-invert"],
    pride: true,
    message: "GENDER IS A CONSTRUCT",
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
  asexual: {
    classNames: ["transparent", "light-mode"],
    pride: true,
    message: "GARLIC BREAD",
    shader: {
      frag: "glsl/gradient.glsl",
      uniforms: {
        color1: color(0x666666),
        color2: color(0xffffff),
        color3: color(0x840884),
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

const ALIASES: { [alias: string]: string } = {
  default: "dark",
  bi: "bisexual",
  transgender: "trans",
  enby: "nonbinary",
  wlw: "lesbian",
  mlm: "gay",
  ase: "asexual",
};

export const getTheme = (name: string) => THEMES[name] ?? THEMES[ALIASES[name]];

let currentTheme = getTheme(localStorage.theme || "dark");
let shadersLoaded = false;

setTheme(currentTheme);

let shaders: Promise<typeof import("./shaders.ts")>;
export async function setTheme(theme: Theme) {
  if (isPrideMonth && !theme.pride) {
    theme = getTheme(localStorage.prideTheme || "pride");
  }

  if (currentTheme?.classNames) {
    currentTheme.classNames.forEach((n) =>
      document.documentElement.classList.remove(n)
    );
  }
  if (theme?.classNames) {
    theme.classNames.forEach((n) => document.documentElement.classList.add(n));
  }
  if (theme?.shader) {
    if (!shadersLoaded) enableShaders();
    (await shaders).set(theme.shader.frag, theme.shader.uniforms ?? {});
  } else if (currentTheme?.shader) {
    await disableShaders();
  }

  setMessage(theme.message ?? "");

  currentTheme = theme;
}

function enableShaders() {
  function updateCanvasSize() {
    el.shaderCanvas.width = innerWidth;
    el.shaderCanvas.height = innerHeight;
  }

  addEventListener("resize", updateCanvasSize);
  updateCanvasSize();

  el.shaderCanvas.style.display = "block";

  shaders = import("./shaders.ts");
  shadersLoaded = true;
}

async function disableShaders() {
  if (!shadersLoaded) return;
  el.shaderCanvas.style.display = "none";
  (await shaders).unset();
  shadersLoaded = false;
  console.log("shaders disabled");
}
