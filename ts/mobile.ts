import { el } from "./consts.ts";

const isMobile = innerWidth <= 400;

if (isMobile) {
  addEventListener("navigate", () => {
    el.pathBack.style.display = router.path == "/" ? "none" : "block";
  });

  if (router.path == "/") {
    el.pathBack.style.display = "none";
  }
}
