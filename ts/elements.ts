function get(query: string): HTMLElement {
    const e = document.querySelector(query);
    if (e != null) {
        return e as HTMLElement;
    } else {
        throw `could not get element ${query}`;
    }
}

export const el = {
    links: get("#links"),
    selector: get("#selector"),
    title: get("#title"),
    pathBack: get("#path-back"),
    themePicker: get("div#theme-picker"),
    themePickerInput: get("div#theme-picker .input"),
    content: get("div#center"),
    shaderCanvas: get("canvas#shader") as HTMLCanvasElement,
};
