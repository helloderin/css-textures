import { describe, it, expect, afterEach } from "vitest";
import { leather } from "../index.js";

afterEach(() => {
  document.getElementById("css-textures-leather")?.remove();
});

describe("leather texture", () => {
  it('has id "leather"', () => {
    expect(leather.id).toBe("leather");
  });

  it('has className "texture-leather"', () => {
    expect(leather.className).toBe("texture-leather");
  });

  it('has textClassName "texture-leather-text"', () => {
    expect(leather.textClassName).toBe("texture-leather-text");
  });

  it("exposes --texture-scale var", () => {
    expect(leather.vars).toHaveProperty("--texture-scale");
  });

  it("exposes --texture-intensity var", () => {
    expect(leather.vars).toHaveProperty("--texture-intensity");
  });

  it("exposes --texture-blend-mode var", () => {
    expect(leather.vars).toHaveProperty("--texture-blend-mode");
  });

  it("css is a non-empty string", () => {
    expect(typeof leather.css).toBe("string");
    expect(leather.css.length).toBeGreaterThan(0);
  });

  it("css snapshot", () => {
    expect(leather.css).toMatchSnapshot();
  });
});
