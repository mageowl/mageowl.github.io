import { el } from "./consts.ts";

const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;

if (isMobile) {
  addEventListener("navigate", () => {
    el.pathBack.style.display = router.path == "/" ? "none" : "block";
  });

  if (router.path == "/") {
    el.pathBack.style.display = "none";
  }

  document.documentElement.classList.add("mobile");
}
