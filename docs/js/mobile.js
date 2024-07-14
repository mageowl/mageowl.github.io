const isMobile = window.innerWidth <= 400;

if (isMobile) {
  window.addEventListener("navigate", () => {
    document.querySelector("#path-back").style.display =
      router.path == "/" ? "none" : "block";
  });

  if (router.path == "/") {
    document.querySelector("#path-back").style.display = "none";
  }
}
