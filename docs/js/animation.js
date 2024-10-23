import {
    keyboardSelection,
    setInputDisabled,
    setKeyboardSelection,
} from "./keyboard.js";
import { links } from "./links.js";

function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

function animationStart(reverse = false) {
    setInputDisabled(true);

    document.querySelector("#links").classList.add("hidden");
    document.querySelector("#selector").classList.add("hidden");

    if (!reverse) {
        let titleOffset = document
            .querySelector("#title")
            .getBoundingClientRect().width;
        document.querySelectorAll("#title, #path-back").forEach((e) => {
            e.style.transform = `translateX(-${titleOffset}px)`;
            e.classList.add("moving", "transparent");
        });
    } else {
        document.querySelector("#title").classList.add("hidden");
    }
}

function animationEnd(reverse = false) {
    Array.from(document.querySelector("#links").children).forEach(
        (el, i) => (el.style.transitionDelay = 0.05 * i + "s"),
    );

    if (reverse) {
        document.querySelectorAll("#title, #path-back").forEach((e) => {
            e.classList.add("moving");
            e.style.transform = "none";
            setTimeout(() => e.classList.remove("moving"), 200);
        });
    }

    document
        .querySelector("#links")
        .classList.remove("hidden", reverse ? "left" : "right");

    if (keyboardSelection != -1) {
        if (links.length > 0) {
            setKeyboardSelection(0);
            selector.style.top = `${
                links[keyboardSelection].getBoundingClientRect().top
            }px`;
            setTimeout(
                () =>
                    document
                        .querySelector("#selector")
                        .classList.remove("hidden"),
                1,
            );
        } else {
            setKeyboardSelection(-2);
        }
    }
}

export async function go(to) {
    // start animation
    animationStart();

    // wait for links to hide
    await sleep(200);
    document.querySelector("#links").classList.add("right");
    // save time that animation will finish
    const animDone = sleep(200);

    // wait for page to change
    await router.goto(to, {}, true);
    document.querySelectorAll("#title, #path-back").forEach((e) => {
        e.style.transform = "none";
        e.classList.remove("moving", "transparent");
    });
    setInputDisabled(false);

    // wait for animation to finish
    await animDone;
    //await sleep(200);

    // fade in links
    animationEnd();
}

export async function goBack() {
    // start reverse animation
    animationStart(true);
    document.querySelector("#links").classList.add("left");

    // save time that animation will finish
    const animDone = sleep(200);

    // wait for page to change
    await router.goto(
        ("/" + router.path.split("/").slice(0, -1).join("/")).replace(
            "//",
            "/",
        ),
    );

    let titleOffset = document
        .querySelector("#title")
        .getBoundingClientRect().width;
    document.querySelectorAll("#title, #path-back").forEach((e) => {
        e.classList.remove("hidden");
        e.style.transform = `translateX(-${titleOffset}px)`;
    });

    // wait for animation to finish
    setInputDisabled(false);
    await animDone;
    animationEnd(true);
}
