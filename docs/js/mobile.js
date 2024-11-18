import { el } from "./elements.js";
const isMobile = window.innerWidth <= 400;
if (isMobile) {
    window.addEventListener("navigate", () => {
        el.pathBack.style.display = router.path == "/" ? "none" : "block";
    });
    if (router.path == "/") {
        el.pathBack.style.display = "none";
    }
}
