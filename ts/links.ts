export let links = document.querySelectorAll("a");

addEventListener("navigate", () => {
  links = document.querySelectorAll("a");

  document.querySelectorAll("span.hotkey").forEach((e) => {
    e.innerHTML = navigator.userAgent.includes("Mac") ? "⌘" : "ctrl";
  });
});

document.querySelectorAll("span.hotkey").forEach((e) => {
  e.innerHTML = navigator.userAgent.includes("Mac") ? "⌘" : "ctrl";
});
