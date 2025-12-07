var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ts/consts.ts
function get(query) {
  const e = document.querySelector(query);
  if (e != null) {
    return e;
  } else {
    throw `could not get element ${query}`;
  }
}
var el, isPrideMonth;
var init_consts = __esm({
  "ts/consts.ts"() {
    el = {
      links: get("#links"),
      selector: get("#selector"),
      title: get("#title"),
      pathBack: get("#path-back"),
      cmdLine: get("div#cmd-line"),
      cmdInput: get("div#cmd-line .input"),
      cmdAutocomplete: get("div#cmd-line .autocomplete"),
      content: get("div#center"),
      messageBar: get("div#message-bar"),
      messageBarContent: get("div#message-bar div"),
      shaderCanvas: get("canvas#shader")
    };
    isPrideMonth = (/* @__PURE__ */ new Date()).getMonth() === 5;
  }
});

// ts/shaders.ts
var shaders_exports = {};
__export(shaders_exports, {
  set: () => set,
  unset: () => unset
});
function assert(value, msg) {
  if (value == null) {
    throw msg;
  } else {
    return value;
  }
}
async function compileShader(path, type) {
  const code = await fetch("/" + path).then((res) => res.text());
  const shader = assert(gl.createShader(type), "Could not create shader.");
  gl.shaderSource(shader, code);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader: ${gl.getShaderInfoLog(shader)}`);
    throw gl.getShaderInfoLog(shader);
  }
  shaderCache[path] = shader;
  return shader;
}
async function buildProgram(shaderInfo, uniforms, attributes) {
  const program2 = assert(gl.createProgram(), "Could not create program.");
  await Promise.all(shaderInfo.map(async (desc) => {
    const shader = shaderCache[desc.path] ?? await compileShader(desc.path, desc.type);
    gl.attachShader(program2, shader);
  }));
  gl.linkProgram(program2);
  if (!gl.getProgramParameter(program2, gl.LINK_STATUS)) {
    console.error("Error linking shader parameter");
    throw gl.getProgramInfoLog(program2);
  }
  const uniformsMap = {};
  uniforms.forEach((name) => {
    uniformsMap[name] = assert(gl.getUniformLocation(program2, name), `Could not find uniform ${name}.`);
  });
  const attributesMap = {};
  attributes.forEach((name) => {
    attributesMap[name] = assert(gl.getAttribLocation(program2, name), `Could not find attribute ${name}.`);
  });
  return {
    program: program2,
    uniformsMap,
    attributesMap
  };
}
async function set(path, uniforms) {
  if (program) gl.deleteProgram(program.program);
  program = await buildProgram([
    {
      type: ShaderType.VERTEX,
      path: "./glsl/vertex.glsl"
    },
    {
      type: ShaderType.FRAGMENT,
      path
    }
  ], [
    "time",
    ...Object.keys(uniforms)
  ], [
    "aVertexPosition",
    "aTexturePosition"
  ]);
  staticUniforms = uniforms;
  if (!running) {
    running = true;
    draw();
  }
}
function unset() {
  if (!program) return;
  gl.deleteProgram(program.program);
  program = null;
  running = false;
}
function draw() {
  gl.viewport(0, 0, el.shaderCanvas.width, el.shaderCanvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  const vertexPosition = assert(program?.attributesMap["aVertexPosition"], "Could not get vertex position attribute");
  const texturePosition = assert(program?.attributesMap["aTexturePosition"], "Could not get texture position attribute");
  gl.enableVertexAttribArray(vertexPosition);
  gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 4 * 4, 0);
  gl.enableVertexAttribArray(texturePosition);
  gl.vertexAttribPointer(texturePosition, 2, gl.FLOAT, false, 4 * 4, 2 * 4);
  gl.uniform1f(assert(program?.uniformsMap["time"], "Could not get time uniform"), (Date.now() - timeStart) / 1e3);
  for (const [name, data] of Object.entries(staticUniforms)) {
    const uniform = assert(program?.uniformsMap[name], "Could not get custom uniform");
    if (data.length === 4) {
      gl.uniform4f(uniform, data[0], data[1], data[2], data[3]);
    } else if (data.length === 3) {
      gl.uniform3f(uniform, data[0], data[1], data[2]);
    }
  }
  gl.useProgram(assert(program?.program, "Shaders not initialized."));
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  if (running) requestAnimationFrame(draw);
}
var gl, ShaderType, shaderCache, program, running, staticUniforms, verticies, vertexBuffer, timeStart;
var init_shaders = __esm({
  "ts/shaders.ts"() {
    init_consts();
    gl = assert(el.shaderCanvas.getContext("webgl"), "Could not initialize WebGL.");
    ShaderType = /* @__PURE__ */ function(ShaderType2) {
      ShaderType2[ShaderType2["VERTEX"] = gl.VERTEX_SHADER] = "VERTEX";
      ShaderType2[ShaderType2["FRAGMENT"] = gl.FRAGMENT_SHADER] = "FRAGMENT";
      return ShaderType2;
    }(ShaderType || {});
    shaderCache = {};
    running = false;
    staticUniforms = {};
    verticies = new Float32Array([
      -1,
      1,
      0,
      0,
      1,
      1,
      1,
      0,
      -1,
      -1,
      0,
      1,
      1,
      -1,
      1,
      1
    ]);
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticies, gl.STATIC_DRAW);
    timeStart = Date.now();
  }
});

// ts/themes.ts
init_consts();

// ts/messageBar.ts
init_consts();
var visible = false;
var message = "";
function resizeMessageBar() {
  const spacedMessage = message.endsWith("\xA0") ? message : message + "\xA0\xA0";
  el.messageBarContent.innerText = spacedMessage;
  const msgWidth = el.messageBarContent.clientWidth;
  const screenWidth = Math.ceil(innerWidth / msgWidth) + 1;
  el.messageBar.style.setProperty("--msg-width", msgWidth.toString());
  el.messageBarContent.innerText = spacedMessage.repeat(screenWidth);
}
function showMessageBar() {
  visible = true;
  setTimeout(() => {
    resizeMessageBar();
    el.messageBar.classList.remove("hide");
    addEventListener("resize", resizeMessageBar);
  }, 200);
}
function hideMessageBar() {
  el.messageBar.classList.add("hide");
  removeEventListener("resize", resizeMessageBar);
}
function setMessage(value) {
  if (isPrideMonth) return;
  message = value;
  if (message !== "") {
    if (!visible) showMessageBar();
    else resizeMessageBar();
  } else if (message === "" && visible) {
    hideMessageBar();
  }
}
if (isPrideMonth) {
  setMessage("HAPPY PRIDE MONTH!!");
}

// ts/themes.ts
function color(hex) {
  return [
    (hex >> 16) / 255,
    (hex >> 8 & 255) / 255,
    (hex & 255) / 255
  ];
}
var THEMES = {
  dark: {},
  light: {
    classNames: [
      "light-mode"
    ]
  },
  pride: {
    classNames: [
      "transparent",
      "light-mode",
      "no-invert"
    ],
    pride: true,
    message: "HAPPY PRIDE",
    shader: {
      frag: "glsl/pride.glsl"
    }
  },
  bisexual: {
    classNames: [
      "transparent",
      "light-mode",
      "no-invert"
    ],
    pride: true,
    message: "GIRLS AND BOYS AND ENBIES AND\xA0",
    shader: {
      frag: "glsl/gradient_noclamp.glsl",
      uniforms: {
        color1: color(14368765),
        color2: color(7997946),
        color3: color(3146713)
      }
    }
  },
  trans: {
    classNames: [
      "transparent",
      "light-mode",
      "no-invert"
    ],
    pride: true,
    message: "TRANS PEOPLE ARE PEOPLE",
    shader: {
      frag: "glsl/gradient.glsl",
      uniforms: {
        color1: color(5818610),
        color2: [
          1,
          1,
          1
        ],
        color3: color(15574194)
      }
    }
  },
  nonbinary: {
    classNames: [
      "transparent",
      "no-invert"
    ],
    pride: true,
    message: "GENDER IS A CONSTRUCT",
    shader: {
      frag: "glsl/gradient_noclamp.glsl",
      uniforms: {
        color1: color(16169291),
        color2: color(10181072),
        color3: color(3941197)
      }
    }
  },
  lesbian: {
    classNames: [
      "transparent",
      "light-mode"
    ],
    pride: true,
    message: "GIRLKISSER",
    shader: {
      frag: "glsl/gradient.glsl",
      uniforms: {
        color1: color(13904896),
        color2: color(14454690),
        color3: color(10617185)
      }
    }
  },
  gay: {
    classNames: [
      "transparent",
      "light-mode"
    ],
    pride: true,
    message: "BOYKISSER",
    shader: {
      frag: "glsl/gradient.glsl",
      uniforms: {
        color1: color(2215852),
        color2: color(4428226),
        color3: color(5195725)
      }
    }
  },
  asexual: {
    classNames: [
      "transparent",
      "light-mode"
    ],
    pride: true,
    message: "GARLIC BREAD",
    shader: {
      frag: "glsl/gradient.glsl",
      uniforms: {
        color1: color(6710886),
        color2: color(16777215),
        color3: color(8652932)
      }
    }
  },
  fire: {
    classNames: [
      "transparent",
      "fire"
    ],
    shader: {
      frag: "glsl/fire.glsl"
    }
  },
  retro: {
    classNames: [
      "retro",
      "no-anim"
    ]
  },
  alpha: {
    classNames: [
      "transparent"
    ]
  }
};
var ALIASES = {
  default: "dark",
  bi: "bisexual",
  transgender: "trans",
  enby: "nonbinary",
  wlw: "lesbian",
  mlm: "gay",
  ase: "asexual"
};
var getTheme = (name) => THEMES[name] ?? THEMES[ALIASES[name]];
var currentTheme = getTheme(localStorage.theme || "dark");
var shadersLoaded = false;
setTheme(currentTheme);
var shaders;
async function setTheme(theme) {
  if (isPrideMonth && !theme.pride) {
    theme = getTheme(localStorage.prideTheme || "pride");
  }
  if (currentTheme?.classNames) {
    currentTheme.classNames.forEach((n) => document.documentElement.classList.remove(n));
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
  shaders = Promise.resolve().then(() => (init_shaders(), shaders_exports));
  shadersLoaded = true;
}
async function disableShaders() {
  if (!shadersLoaded) return;
  el.shaderCanvas.style.display = "none";
  (await shaders).unset();
  shadersLoaded = false;
  console.log("shaders disabled");
}
export {
  THEMES,
  getTheme,
  setTheme
};
