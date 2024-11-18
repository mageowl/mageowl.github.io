declare const router: Router;

interface Router {
    is404: boolean;

    // Current path. Always starts with '/'.
    path: string;

    // Joins `args` together as a path.
    joinPath: (...args: string[]) => void;

    // Create an anchor element
    anchor: (href: string) => HTMLAnchorElement;

    // Navigate to href.
    goto: (
        href: string,
        state?: Object,
        includesOrigin?: boolean,
    ) => Promise<void>;
}
