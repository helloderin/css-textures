# css-textures

A zero-dependency CSS texture library. No images, no network requests.

## Install

```bash
npm install css-textures
```

## Usage

### JS import (recommended)

Each texture auto-injects its `<style>` tag the first time it's used, then hands you the class name to apply.

```js
import { leather } from "css-textures";

// Apply to a DOM element
leather.apply(document.querySelector(".hero"));

// Or get the class name and apply it yourself
element.classList.add(leather.className); // "texture-leather"

// Or use it in a template string
el.className = `hero ${leather}`;
```

### React

```jsx
import { leather } from "css-textures";

function Hero() {
  return (
    <div
      className={leather.className}
      style={{ background: "#1a2744", "--texture-intensity": 0.5 }}
    >
      Hello
    </div>
  );
}
```

### CSS-only (no JS)

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/css-textures/dist/textures.css"
/>

<div class="texture-leather" style="background: #1a2744">...</div>
```

Or import individual textures:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/css-textures/dist/textures/leather.css"
/>
```

### CSS `@import`

```css
@import "css-textures/css"; /* all textures */
@import "css-textures/css/leather"; /* just leather */
```

### SSR / frameworks that manage styles

```js
import { leather } from "css-textures";

const { css, className } = leather;
```

## Customisation

All textures expose two CSS custom properties you can override per-element:

| Property              | Default | Description                  |
| --------------------- | ------- | ---------------------------- |
| `--texture-scale`     | varies  | Tile / repeat size           |
| `--texture-intensity` | varies  | Opacity of the overlay layer |

```css
.my-card {
  background: #1a2744;
  --texture-scale: 120px;
  --texture-intensity: 0.4;
}
```

```html
<div class="my-card texture-leather">...</div>
```

## Available textures

| Import name | Class name         | Description           |
| ----------- | ------------------ | --------------------- |
| `leather`   | `.texture-leather` | Pebbled organic noise |

## API

### Texture object

```ts
interface Texture {
  id: string; // e.g. "leather"
  className: string; // e.g. "texture-leather"
  css: string; // raw CSS string
  vars: Record<string, string>; // supported CSS custom properties

  apply(el: Element): Element; // add class
  remove(el: Element): Element; // remove class
  toString(): string; // returns className
}
```

## License

MIT
