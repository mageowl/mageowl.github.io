// ts/consts.ts
function get(query) {
  const e = document.querySelector(query);
  if (e != null) {
    return e;
  } else {
    throw `could not get element ${query}`;
  }
}
var el = {
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
var isPrideMonth = (/* @__PURE__ */ new Date()).getMonth() === 5;

// ts/mobile.ts
var isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
if (isMobile) {
  addEventListener("navigate", () => {
    el.pathBack.style.display = router.path == "/" ? "none" : "block";
  });
  if (router.path == "/") {
    el.pathBack.style.display = "none";
  }
  document.documentElement.classList.add("mobile");
}
