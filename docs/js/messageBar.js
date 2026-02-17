// static/ts/consts.ts
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

// static/ts/messageBar.ts
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
export {
  setMessage
};
