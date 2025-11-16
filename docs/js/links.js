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
export {
  links
};
