/**
 * createTexture — Factory that produces a Texture object.
 *
 * Each texture object exposes:
 *   .className   — the CSS class to put on your element  e.g. "texture-leather"
 *   .apply(el)   — injects + adds the class to a DOM element
 *   .remove(el)  — removes the class from a DOM element
 *   .css         — the raw CSS string (useful for SSR / frameworks that manage styles)
 *   .vars        — typed map of supported CSS custom properties
 */
export const createTexture = ({ id, css, vars = {} }) => {
  const className = `texture-${id}`;
  const styleElementId = `css-textures-${id}`;

  const inject = () => {
    if (typeof document === "undefined") return;
    if (document.getElementById(styleElementId)) return;

    const styleElement = document.createElement("style");
    styleElement.id = styleElementId;
    styleElement.textContent = css;

    document.head.appendChild(styleElement);
  };

  return {
    id,
    get className() {
      inject();
      return className;
    },
    css,
    vars,

    apply(element) {
      inject();
      if (element instanceof Element) element.classList.add(className);
      return element;
    },

    remove(element) {
      if (element instanceof Element) element.classList.remove(className);
      return element;
    },

    toString() {
      inject();
      return className;
    },
  };
};
