import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createTexture } from "../createTexture.js";

const testCSS = ".texture-test { color: red; }";
const testVars = { "--texture-scale": "Tile size" };

describe("createTexture", () => {
  let texture;

  beforeEach(() => {
    texture = createTexture({ id: "test", css: testCSS, vars: testVars });
  });

  afterEach(() => {
    document.getElementById("css-textures-test")?.remove();
  });

  describe("shape", () => {
    it("sets id correctly", () => {
      expect(texture.id).toBe("test");
    });

    it("className is texture-{id}", () => {
      expect(texture.className).toBe("texture-test");
    });

    it("textClassName is texture-{id}-text", () => {
      expect(texture.textClassName).toBe("texture-test-text");
    });

    it("css matches the input css string", () => {
      expect(texture.css).toBe(testCSS);
    });

    it("vars matches the input vars object", () => {
      expect(texture.vars).toEqual(testVars);
    });

    it("defaults vars to empty object when not provided", () => {
      const t = createTexture({ id: "no-vars", css: testCSS });
      expect(t.vars).toEqual({});
    });
  });

  describe("apply()", () => {
    it("adds className to element", () => {
      const el = document.createElement("div");
      texture.apply(el);
      expect(el.classList.contains("texture-test")).toBe(true);
    });

    it("returns the element", () => {
      const el = document.createElement("div");
      expect(texture.apply(el)).toBe(el);
    });

    it("injects a <style> tag into document.head", () => {
      const el = document.createElement("div");
      texture.apply(el);
      const styleEl = document.getElementById("css-textures-test");
      expect(styleEl).not.toBeNull();
      expect(styleEl.tagName).toBe("STYLE");
      expect(styleEl.textContent).toBe(testCSS);
    });

    it("does not inject duplicate <style> tags when called twice", () => {
      const el = document.createElement("div");
      texture.apply(el);
      texture.apply(el);
      const styleEls = document.querySelectorAll("#css-textures-test");
      expect(styleEls.length).toBe(1);
    });

    it("does not throw when passed a non-Element", () => {
      expect(() => texture.apply(null)).not.toThrow();
      expect(() => texture.apply("not an element")).not.toThrow();
    });
  });

  describe("applyToText()", () => {
    it("adds textClassName to element", () => {
      const el = document.createElement("span");
      texture.applyToText(el);
      expect(el.classList.contains("texture-test-text")).toBe(true);
    });

    it("returns the element", () => {
      const el = document.createElement("span");
      expect(texture.applyToText(el)).toBe(el);
    });
  });

  describe("remove()", () => {
    it("removes className from element", () => {
      const el = document.createElement("div");
      texture.apply(el);
      texture.remove(el);
      expect(el.classList.contains("texture-test")).toBe(false);
    });

    it("removes textClassName from element", () => {
      const el = document.createElement("span");
      texture.applyToText(el);
      texture.remove(el);
      expect(el.classList.contains("texture-test-text")).toBe(false);
    });

    it("returns the element", () => {
      const el = document.createElement("div");
      expect(texture.remove(el)).toBe(el);
    });

    it("does not throw when passed a non-Element", () => {
      expect(() => texture.remove(null)).not.toThrow();
    });
  });

  describe("toString()", () => {
    it("returns className", () => {
      expect(texture.toString()).toBe("texture-test");
    });

    it("works in template literals", () => {
      expect(`class="${texture}"`).toBe('class="texture-test"');
    });
  });

  describe("SSR safety", () => {
    it("does not throw when document is undefined", () => {
      const originalDocument = globalThis.document;
      // @ts-ignore
      delete globalThis.document;
      try {
        const t = createTexture({ id: "ssr", css: testCSS });
        expect(() => t.apply(null)).not.toThrow();
        expect(() => t.applyToText(null)).not.toThrow();
        expect(() => t.toString()).not.toThrow();
      } finally {
        globalThis.document = originalDocument;
      }
    });

    it("css property is still accessible without document", () => {
      const originalDocument = globalThis.document;
      // @ts-ignore
      delete globalThis.document;
      try {
        const t = createTexture({ id: "ssr2", css: testCSS });
        expect(t.css).toBe(testCSS);
      } finally {
        globalThis.document = originalDocument;
      }
    });
  });
});
