import { el, isPrideMonth } from "./consts.ts";

let visible = false;
let message = "";

function resizeMessageBar() {
  const spacedMessage = message.endsWith("\u00a0")
    ? message
    : message + "\u00a0\u00a0";
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

export function setMessage(value: string) {
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
