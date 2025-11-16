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
  cmdLine: get("div#cmd-line"),
  cmdInput: get("div#cmd-line .input"),
  cmdAutocomplete: get("div#cmd-line .autocomplete"),
  content: get("div#center"),
  messageBar: get("div#message-bar"),
  messageBarContent: get("div#message-bar div"),
  shaderCanvas: get("canvas#shader") as HTMLCanvasElement,
};

export const isPrideMonth = new Date().getMonth() === 5;
