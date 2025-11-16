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

// ts/animation.ts
init_consts();

// ts/keyboard.ts
init_consts();

// ts/links.ts
var links = document.querySelectorAll("a");
addEventListener("navigate", () => {
  links = document.querySelectorAll("a");
  document.querySelectorAll("span.hotkey").forEach((e) => {
    e.innerHTML = navigator.userAgent.includes("Mac") ? "\u2318" : "ctrl";
  });
});
document.querySelectorAll("span.hotkey").forEach((e) => {
  e.innerHTML = navigator.userAgent.includes("Mac") ? "\u2318" : "ctrl";
});

// ts/cmdLine.ts
init_consts();

// ts/messageBar.ts
init_consts();
var visible = false;
var message = "";
function resizeMessageBar() {
  if (!visible) {
    removeEventListener("resize", resizeMessageBar);
    return;
  }
  el.messageBar.classList.remove("hide");
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
    addEventListener("resize", resizeMessageBar);
  }, 200);
}
function hideMessageBar() {
  el.messageBar.classList.add("hide");
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
init_consts();
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

// ts/cmdLine.ts
var cmdLineOpen = false;
var input = "";
var autocomplete = "";
function openCmdline() {
  if (cmdLineOpen) return closeCmdline();
  setKeyboardSelection(-1);
  el.selector.classList.add("hidden");
  el.content.classList.add("hidden");
  document.querySelector("#links > a.selected")?.classList.remove("selected");
  el.cmdLine.classList.remove("hidden");
  updateAutocomplete();
  cmdLineOpen = true;
}
function closeCmdline() {
  el.content.classList.remove("hidden");
  el.cmdLine.classList.add("hidden");
  el.cmdInput.innerHTML = "";
  el.cmdAutocomplete.innerText = "";
  cmdLineOpen = false;
  input = "";
}
function handleLetter(key) {
  input += key;
  el.cmdInput.innerText = input;
  updateAutocomplete();
}
function handleBackspace() {
  input = input.slice(0, -1);
  el.cmdInput.innerText = input;
  updateAutocomplete();
}
function handleEnterCommand() {
  runCommand(input);
  closeCmdline();
}
function runCommand(input2) {
  const cmd = input2.split(" ")[0];
  const fn = COMMANDS[cmd];
  if (fn == null) {
    console.log(`invalid command ${cmd}.`);
  } else {
    fn(input2.substring(cmd.length + 1));
  }
}
function updateAutocomplete() {
  if (input.length !== 0) {
    autocomplete = "";
    if (!input.includes(" ")) {
      for (const cmd in COMMANDS) {
        if (Object.hasOwn(COMMANDS, cmd) && cmd.startsWith(input)) {
          autocomplete = cmd.substring(input.length);
          break;
        }
      }
    }
  } else autocomplete = "help";
  el.cmdAutocomplete.innerText = autocomplete;
}
var COMMANDS = {
  help() {
    router.goto("/cmdline");
  },
  theme(input2) {
    const theme = getTheme(input2);
    if (theme != null) {
      setTheme(theme);
      localStorage.theme = input2;
      if (theme.pride) localStorage.prideTheme = input2;
    }
  },
  cd(input2) {
    router.goto("/input");
  },
  echo(input2) {
    setMessage(input2);
  }
};
var urlParam = new URLSearchParams(location.search).get("run");
if (urlParam != null) {
  runCommand(urlParam);
  console.log(location.href.split("?")[0]);
  history.replaceState({}, "", location.href.split("?")[0]);
}

// ts/keyboard.ts
var keyboardSelection = -1;
var inputDisabled = false;
function setKeyboardSelection(v) {
  keyboardSelection = v;
}
function setInputDisabled(v) {
  inputDisabled = v;
}
function updateSelection() {
  el.selector.style.top = `${links[keyboardSelection]?.getBoundingClientRect().top}px`;
}
addEventListener("resize", updateSelection);
addEventListener("keydown", (e) => {
  if (inputDisabled) e.preventDefault();
  else if (cmdLineOpen && "abcdefghijklmnopqrstuvwxyz /-.1234567890".includes(e.key.toLowerCase()) && !(e.ctrlKey || e.metaKey)) {
    handleLetter(e.key.toLowerCase());
    e.preventDefault();
  } else if (cmdLineOpen && e.key === "Enter") {
    handleEnterCommand();
  } else if (cmdLineOpen && e.key === "Backspace") {
    handleBackspace();
  } else if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
    openCmdline();
    e.preventDefault();
  } else if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Tab" || e.key === "j" || e.key === "k") {
    e.preventDefault();
    if (links.length == 0 || cmdLineOpen) return;
    const direction = {
      ArrowUp: -1,
      ArrowDown: 1,
      Tab: e.shiftKey ? -1 : 1,
      j: 1,
      k: -1
    }[e.key];
    document.querySelector("a.selected")?.classList.remove("selected");
    if (keyboardSelection === -1) {
      setKeyboardSelection(direction === -1 ? links.length - 1 : 0);
    } else {
      setKeyboardSelection((keyboardSelection + direction + links.length) % links.length);
    }
    links[keyboardSelection].classList.add("selected");
    updateSelection();
    setTimeout(() => el.selector.classList.remove("hidden"), 1);
    e.preventDefault();
  } else if (e.key === " " || e.key === "Enter" || e.key === "l") {
    if (links.length == 0 || keyboardSelection < 0) return;
    links[keyboardSelection].click();
  } else if ((e.key === "Backspace" || e.key === "h") && router.path != "/") {
    goBack();
  } else if (e.key === "Escape") {
    if (cmdLineOpen) {
      closeCmdline();
    } else {
      links[keyboardSelection]?.classList.remove("selected");
      keyboardSelection = -1;
      el.selector.classList.add("hidden");
    }
  }
});

// ts/animation.ts
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
function animationStart(reverse = false) {
  el.links.classList.add("hidden");
  el.selector.classList.add("hidden");
  if (!reverse) {
    const titleOffset = el.title?.getBoundingClientRect().width;
    [
      el.title,
      el.pathBack
    ].forEach((e) => {
      e.style.transform = `translateX(-${titleOffset}px)`;
      e.classList.add("moving", "transparent");
    });
  } else {
    el.title.classList.add("hidden");
  }
}
function animationEnd(reverse = false) {
  Array.from(el.links.children).forEach((el2, i) => el2.style.transitionDelay = 0.05 * i + "s");
  if (reverse) {
    [
      el.title,
      el.pathBack
    ].forEach((e) => {
      e.classList.add("moving");
      e.style.transform = "none";
      setTimeout(() => e.classList.remove("moving"), 200);
    });
  }
  el.links.classList.remove("hidden", reverse ? "left" : "right");
}
async function go(to) {
  const doAnim = !document.documentElement.classList.contains("no-anim");
  if (doAnim) {
    setInputDisabled(true);
    animationStart();
    await sleep(200);
    el.links.classList.add("right");
  }
  const animDone = sleep(200);
  await router.goto(to, {}, true);
  [
    el.title,
    el.pathBack
  ].forEach((e) => {
    e.style.transform = "none";
    e.classList.remove("moving", "transparent");
  });
  if (doAnim) {
    setInputDisabled(false);
    await animDone;
    animationEnd();
  } else {
    el.selector.classList.add("hidden");
  }
  if (keyboardSelection !== -1) {
    if (links.length > 0) {
      setKeyboardSelection(0);
      el.selector.style.top = `${links[0].getBoundingClientRect().top}px`;
      links[0].classList.add("selected");
      setTimeout(() => el.selector.classList.remove("hidden"), 1);
    } else {
      setKeyboardSelection(-2);
    }
  }
}
async function goBack() {
  const doAnim = !document.documentElement.classList.contains("no-anim");
  if (doAnim) {
    animationStart(true);
    el.links.classList.add("left");
  }
  const animDone = sleep(200);
  await router.goto(("/" + router.path.split("/").filter((x) => x !== "").slice(0, -1).join("/")).replace("//", "/"));
  if (doAnim) {
    const titleOffset = el.title.getBoundingClientRect().width;
    [
      el.title,
      el.pathBack
    ].forEach((e) => {
      e.classList.remove("hidden");
      e.style.transform = `translateX(-${titleOffset}px)`;
    });
    setInputDisabled(false);
    await animDone;
    animationEnd(true);
  } else {
    el.selector.classList.add("hidden");
  }
  if (keyboardSelection != -1) {
    if (links.length > 0) {
      setKeyboardSelection(0);
      el.selector.style.top = `${links[0].getBoundingClientRect().top}px`;
      links[0].classList.add("selected");
      setTimeout(() => el.selector.classList.remove("hidden"), 1);
    } else {
      setKeyboardSelection(-2);
    }
  }
}
export {
  go,
  goBack
};
