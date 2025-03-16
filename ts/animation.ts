import { el } from "./elements.js";
import {
    keyboardSelection,
    setInputDisabled,
    setKeyboardSelection,
} from "./keyboard.js";
import { links } from "./links.js";

function sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}

function animationStart(reverse = false) {
    el.links.classList.add("hidden");
    el.selector.classList.add("hidden");

    if (!reverse) {
        let titleOffset = el.title?.getBoundingClientRect().width;
        [el.title, el.pathBack].forEach((e) => {
            e.style.transform = `translateX(-${titleOffset}px)`;
            e.classList.add("moving", "transparent");
        });
    } else {
        el.title.classList.add("hidden");
    }
}

function animationEnd(reverse = false) {
    Array.from(el.links.children).forEach(
        (el, i) => ((el as HTMLElement).style.transitionDelay = 0.05 * i + "s"),
    );

    if (reverse) {
        [el.title, el.pathBack].forEach((e) => {
            e.classList.add("moving");
            e.style.transform = "none";
            setTimeout(() => e.classList.remove("moving"), 200);
        });
    }

    el.links.classList.remove("hidden", reverse ? "left" : "right");
}

export async function go(to: string) {
    const doAnim = !document.documentElement.classList.contains("no-anim");
    if (doAnim) {
        // start animation
        setInputDisabled(true);
        animationStart();

        // wait for links to hide
        await sleep(200);
        el.links.classList.add("right");
    }
    // save time that animation will finish
    const animDone = sleep(200);

    // wait for page to change
    await router.goto(to, {}, true);
    [el.title, el.pathBack].forEach((e) => {
        e.style.transform = "none";
        e.classList.remove("moving", "transparent");
    });

    if (doAnim) {
        setInputDisabled(false);

        // wait for animation to finish
        await animDone;

        // fade in links
        animationEnd();
    } else {
        el.selector.classList.add("hidden");
    }

    // update kbd selection
    if (keyboardSelection !== -1) {
        if (links.length > 0) {
            setKeyboardSelection(0);
            el.selector.style.top = `${links[0].getBoundingClientRect().top}px`;
            links[0].classList.add("selected");
            setTimeout(() => el.selector.classList.remove("hidden"), 1);
        } else {
            setKeyboardSelection(-2);
        }
    }
}

export async function goBack() {
    const doAnim = !document.documentElement.classList.contains("no-anim");
    if (doAnim) {
        // start reverse animation
        animationStart(true);
        el.links.classList.add("left");
    }

    // save time that animation will finish
    const animDone = sleep(200);

    // wait for page to change
    await router.goto(
        (
            "/" +
            router.path
                .split("/")
                .filter((x) => x !== "")
                .slice(0, -1)
                .join("/")
        ).replace("//", "/"),
    );

    if (doAnim) {
        let titleOffset = el.title.getBoundingClientRect().width;
        [el.title, el.pathBack].forEach((e) => {
            e.classList.remove("hidden");
            e.style.transform = `translateX(-${titleOffset}px)`;
        });

        // wait for animation to finish
        setInputDisabled(false);
        await animDone;
        animationEnd(true);
    } else {
        el.selector.classList.add("hidden");
    }

    // update kbd selection
    if (keyboardSelection != -1) {
        if (links.length > 0) {
            setKeyboardSelection(0);
            el.selector.style.top = `${links[0].getBoundingClientRect().top}px`;
            links[0].classList.add("selected");
            setTimeout(() => el.selector.classList.remove("hidden"), 1);
        } else {
            setKeyboardSelection(-2);
        }
    }
}
