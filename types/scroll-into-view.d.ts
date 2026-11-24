declare module "scroll-into-view" {
    interface Align {
        top?: number;
        topOffset?: number;
        left?: number;
        leftOffset?: number;
    }

    interface Options {
        time?: number;
        align?: Align;
        ease?: (t: number) => number;
        validTarget?: (target: HTMLElement, parentsScrolled: HTMLElement[]) => boolean;
        isScrollable?: (target: HTMLElement) => boolean;
    }

    function scrollIntoView(
        element: Element,
        options?: Options,
        callback?: () => void
    ): void;

    export default scrollIntoView;
}
