const selector = document.querySelector("div#selector");
let keyboardSelection = -1;

function updateSelection() {
  const selected = document.querySelector("span.link:hover");

  if (selected != null) {
    keyboardSelection = -1;

    selector.style.top = `${selected.getBoundingClientRect().top}px`;
    selector.classList.remove("disabled");
    setTimeout(() => selector.classList.remove("hidden"), 1);
  } else {
    selector.classList.add("hidden");
  }
}

let links = document.querySelectorAll("span.link");
// TODO: Update event listeners on page change.
for (let link of links) {
  link.addEventListener("mouseenter", updateSelection);
  link.addEventListener("mouseleave", updateSelection);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    if (keyboardSelection === -1) {
      keyboardSelection = (e.key === "ArrowUp" ? links.length - 1 : 0);
    } else {
      keyboardSelection =
        (keyboardSelection + (e.key === "ArrowUp" ? -1 : 1) + links.length) % links.length;
    }

    selector.style.top = `${links[keyboardSelection].getBoundingClientRect().top
      }px`;
    selector.classList.remove("disabled");
    setTimeout(() => selector.classList.remove("hidden"), 1);

    e.preventDefault();
  } else if (e.key === "Space") {
    links[keyboardSelection].click();
  }
});

window.addEventListener("mousemove", () => {
  if (keyboardSelection !== -1) {
    selector.classList.add("hidden");
  }

  keyboardSelection = -1;
});
