# css-textures

Zero-dependency CSS texture overlays for backgrounds and text.

## Installation

```
npm install css-textures
```

## Usage

### JS (auto-inject)

Importing a texture and accessing `.className` or calling `.apply()` / `.applyToText()` automatically injects the required CSS into the document.

```js
import { leather } from "css-textures";

// Apply to a DOM element (injects CSS automatically)
leather.apply(document.querySelector(".card"));

// Apply to text
leather.applyToText(document.querySelector("h1"));

// Or manage the class yourself
const el = document.querySelector(".card");
el.classList.add(leather.className); // "texture-leather"

// Works in template strings too (calls toString())
el.className = `card ${leather}`;
```

### React

```jsx
import { leather } from 'css-textures';

// Background
<div
  className={leather.className}
  style={{ backgroundColor: '#1a2744', '--texture-scale': '150px', '--texture-blend-mode': 'multiply' }}
/>

// Text
<h1
  className={leather.textClassName}
  style={{ backgroundColor: '#1a2744' }}
>
  Hello
</h1>
```

> [!NOTE]
> **TypeScript users:** import the React augmentation once (e.g. in `src/env.d.ts`) to use CSS custom properties in `style={}` without casts:
> ```ts
> import 'css-textures/react';
> ```
> Otherwise, cast the style object explicitly:
> ```tsx
> style={{ '--texture-scale': '150px' } as React.CSSProperties}
> ```

### CSS-only

Import the stylesheet and apply classes directly:

```css
@import "css-textures/css"; /* all textures */
@import "css-textures/css/leather"; /* just leather */
```

```html
<div class="texture-leather" style="background-color: #1a2744"></div>
<h1 class="texture-leather-text" style="background-color: #1a2744">Hello</h1>
```

Or via CDN (no build step required):

```html
<!-- All textures -->
<link
  rel="stylesheet"
  href="https://unpkg.com/css-textures/dist/textures.css"
/>

<!-- Just leather -->
<link
  rel="stylesheet"
  href="https://unpkg.com/css-textures/dist/textures/leather.css"
/>
```

### SSR

Inject the raw CSS string server-side to avoid a flash of unstyled content:

```js
import { leather } from "css-textures";

const { css, className } = leather;
// Inject `css` into your <head>, then use `className` on your element
```

## Customization

Textures are customized with CSS custom properties, either inline or via a CSS rule:

```css
.my-card {
  background-color: #1a2744;
  --texture-scale: 150px;
  --texture-intensity: 0.4;
  --texture-blend-mode: multiply;
}
```

```html
<div class="my-card texture-leather">...</div>
```

Or inline:

```html
<div
  class="texture-leather"
  style="background-color: #1a2744; --texture-scale: 150px; --texture-intensity: 0.4;"
></div>
```

| Property               | Default   | Description                                                                                       |
| ---------------------- | --------- | ------------------------------------------------------------------------------------------------- |
| `--texture-scale`      | `200px`   | Tile/repeat size                                                                                  |
| `--texture-intensity`  | `0.6`     | Overlay opacity (0–1). **Background textures only** — see [text limitations](#limitations) below. |
| `--texture-blend-mode` | `overlay` | CSS blend mode                                                                                    |

## Texturing text

The text variant uses `background-clip: text` to mask the texture through the text shape. A `background-color` is required as the blend target — without one the text will be invisible.

```jsx
<h1 className={leather.textClassName} style={{ backgroundColor: "#1a2744" }}>
  Hello
</h1>
```

### Limitations

**`--texture-intensity` has no effect on text variants.**
The text clipping technique (`background-clip: text` + `-webkit-text-fill-color: transparent`) works by masking the element's background through its text. There's no separate overlay layer to apply opacity to, so intensity cannot be controlled. To adjust the apparent strength of the texture on text, try adjusting `--texture-scale` or the element's text color.

**`--texture-blend-mode` behaves differently on text.**
For background textures, blend mode is applied via `mix-blend-mode` on a `::before` pseudo-element layered over the content. For text, it's applied as `background-blend-mode`, which blends the texture image against the element's `background-color`. Results will differ from the background variant and depend on what background color is set.

**Avoid the `background` shorthand. Use `background-color` instead.**
The `background` shorthand resets `background-image` to `none`. The library uses `!important` on `background-image` to guard against this, but `background-color` (or `backgroundColor` in JSX/JS) is clearer and avoids surprises if you need to set other background sub-properties.

## Available textures

| Export    | Description           |
| --------- | --------------------- |
| `leather` | Pebbled organic noise |

## API reference

| Member            | Type                       | Description                                                  |
| ----------------- | -------------------------- | ------------------------------------------------------------ |
| `id`              | `string`                   | Texture identifier, e.g. `"leather"`                         |
| `className`       | `string`                   | CSS class for background texturing, e.g. `"texture-leather"` |
| `textClassName`   | `string`                   | CSS class for text texturing, e.g. `"texture-leather-text"`  |
| `css`             | `string`                   | Raw CSS string (useful for SSR)                              |
| `vars`            | `Record<string, string>`   | Descriptions of supported CSS custom properties              |
| `apply(el)`       | `(el: Element) => Element` | Adds `className` to the element                              |
| `applyToText(el)` | `(el: Element) => Element` | Adds `textClassName` to the element                          |
| `remove(el)`      | `(el: Element) => Element` | Removes both texture classes from the element                |
| `toString()`      | `() => string`             | Returns `className` — enables template string usage          |
