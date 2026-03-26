export interface Texture {
  id: string;
  className: string;
  textClassName: string;
  css: string;
  vars: Record<string, string>;
  apply(element: Element): Element;
  applyToText(element: Element): Element;
  remove(element: Element): Element;
  toString(): string;
}

export declare const leather: Texture;
