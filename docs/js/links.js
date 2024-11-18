export let links = document.querySelectorAll("a");
window.addEventListener("navigate", () => {
    links = document.querySelectorAll("a");
});
