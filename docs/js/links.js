let pathBack = document.querySelector("h1#path-back");
pathBack.addEventListener("click", () => {
  history.back();
});

export let links = document.querySelectorAll("a");

window.addEventListener("navigate", () => {
  links = document.querySelectorAll("a");
});
