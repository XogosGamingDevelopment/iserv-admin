declare module "bootstrap/js/dist/tooltip" {
  export default class Tooltip {
    constructor(element: Element, options?: Partial<Tooltip.Options>);
    dispose(): void;
    hide(): void;
    show(): void;
    toggle(): void;
    update(): void;

    static getInstance(element: Element): Tooltip | null;
    static getOrCreateInstance(element: Element, config?: Partial<Tooltip.Options>): Tooltip;
  }

  namespace Tooltip {
    interface Options {
      animation: boolean;
      container: string | Element | false;
      delay: number | { show: number; hide: number };
      html: boolean;
      placement:
        | "top"
        | "bottom"
        | "left"
        | "right"
        | "auto"
        | ((tooltip: Element, trigger: Element) => string);
      selector: string | false;
      template: string;
      title: string | Element | (() => string);
      trigger: string;
      offset: [number, number] | string;
      fallbackPlacements: string[];
      boundary: string | Element;
      customClass: string | ((tooltip: Element) => string);
      sanitize: boolean;
      sanitizeFn?: null | ((unsafeHtml: string) => string);
      allowList: Record<string, unknown>;
      popperConfig: object | ((defaultConfig: object) => object);
    }
  }
}
