import { useEffect, useRef, useState, type JSX } from "react";
import type { Texture } from "css-textures";
import type { SwatchSettings } from "../App";
import styles from "./SwatchCardSettingsEditor.module.css";
import { Select } from "./Select";

interface SwatchEditorProps {
  texture: Texture;
  globalSettings: SwatchSettings;
  overrides: Partial<SwatchSettings>;
  onOverridesChange: (overrides: Partial<SwatchSettings>) => void;
  onClose: () => void;
}

enum SnippetFormat {
  JS = "js",
  JSX = "jsx",
  CSS = "css",
}

enum SnippetTarget {
  Background = "background",
  Text = "text",
}

const buildSnippet = (
  texture: Texture,
  settings: SwatchSettings,
  format: SnippetFormat,
  target: SnippetTarget,
): string => {
  const { id } = texture;
  const isText = target === SnippetTarget.Text;
  const colorProp = isText ? "backgroundColor" : "background";
  const className = isText ? `${id}.textClassName` : `${id}.className`;
  const cssClass = isText ? `texture-${id}-text` : `texture-${id}`;

  if (format === SnippetFormat.JSX) {
    const lines = [
      `import { ${id} } from 'css-textures';`,
      ``,
      isText ? `<h1` : `<div`,
      `  className={${className}}`,
      `  style={{`,
      `    ${colorProp}: '${settings.color}',`,
      `    '--texture-scale': '${settings.scale}px',`,
      ...(!isText
        ? [`    '--texture-intensity': '${settings.intensity}',`]
        : []),
      `    '--texture-blend-mode': '${settings.blendMode}',`,
      `  }}`,
    ];
    if (isText) {
      lines.push(`>`, `  Hello`, `</h1>`);
    } else {
      lines.push(`/>`);
    }
    return lines.join("\n");
  }

  if (format === SnippetFormat.JS) {
    const applyMethod = isText ? "applyToText" : "apply";
    return [
      `import { ${id} } from 'css-textures';`,
      ``,
      `const el = document.querySelector('.my-el');`,
      `el.style.${colorProp} = '${settings.color}';`,
      `el.style.setProperty('--texture-scale', '${settings.scale}px');`,
      ...(!isText
        ? [
            `el.style.setProperty('--texture-intensity', '${settings.intensity}');`,
          ]
        : []),
      `el.style.setProperty('--texture-blend-mode', '${settings.blendMode}');`,
      `${id}.${applyMethod}(el);`,
    ].join("\n");
  }

  // CSS
  return [
    `@import "css-textures/css";`,
    ``,
    `/* <div class="${cssClass}"> */`,
    `.my-el {`,
    `  ${colorProp}: ${settings.color};`,
    `  --texture-scale: ${settings.scale}px;`,
    ...(!isText ? [`  --texture-intensity: ${settings.intensity};`] : []),
    `  --texture-blend-mode: ${settings.blendMode};`,
    `}`,
  ].join("\n");
};

export const SwatchCardSettingsEditor = ({
  texture,
  globalSettings,
  overrides,
  onOverridesChange,
  onClose,
}: SwatchEditorProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [snippetFormat, setSnippetFormat] = useState(SnippetFormat.JSX);
  const [snippetTarget, setSnippetTarget] = useState(SnippetTarget.Background);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setOpen(true));
  }, []);

  const effectiveSettings: SwatchSettings = {
    ...globalSettings,
    ...overrides,
  };
  const snippet = buildSnippet(
    texture,
    effectiveSettings,
    snippetFormat,
    snippetTarget,
  );

  const updateSettings = (update: Partial<SwatchSettings>) => {
    onOverridesChange({ ...overrides, ...update });
  };

  const resetSetting = (setting: keyof SwatchSettings) => {
    const newSettings = { ...overrides };
    delete newSettings[setting];
    onOverridesChange(newSettings);
  };

  const copySnippet = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const hasOverrides = Object.keys(overrides).length > 0;

  return (
    <div className={`${styles.drawer}${open ? ` ${styles.drawerOpen}` : ""}`}>
      <div className={styles.editorContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.titleContainer}>
            <span className={styles.textureName}>{texture.id}</span>
            {hasOverrides && (
              <span className={styles.modifiedDot} aria-hidden="true">
                •
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Color</label>
            <button
              className={styles.colorChangeButton}
              style={{ background: effectiveSettings.color }}
              onClick={() => colorInputRef.current?.click()}
              aria-label="Pick swatch color"
            />
            <input
              ref={colorInputRef}
              type="color"
              value={effectiveSettings.color}
              onChange={(e) => updateSettings({ color: e.target.value })}
              className={styles.hiddenColorInput}
            />
            {overrides.color !== undefined && (
              <button
                className={styles.fieldResetButton}
                onClick={() => resetSetting("color")}
                title="Reset color"
              >
                ↺
              </button>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Intensity</label>
            <div className={styles.fieldModifier}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={effectiveSettings.intensity}
                onChange={(e) =>
                  updateSettings({ intensity: parseFloat(e.target.value) })
                }
              />
              <span className={styles.fieldValue}>
                {Math.round(effectiveSettings.intensity * 100)}%
              </span>
              {overrides.intensity !== undefined && (
                <button
                  className={styles.fieldResetButton}
                  onClick={() => resetSetting("intensity")}
                  title="Reset intensity"
                >
                  ↺
                </button>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Scale</label>
            <div className={styles.fieldModifier}>
              <input
                type="range"
                min={40}
                max={400}
                step={10}
                value={effectiveSettings.scale}
                onChange={(e) =>
                  updateSettings({ scale: parseInt(e.target.value, 10) })
                }
              />
              <span className={styles.fieldValue}>
                {effectiveSettings.scale}px
              </span>
              {overrides.scale !== undefined && (
                <button
                  className={styles.fieldResetButton}
                  onClick={() => resetSetting("scale")}
                  title="Reset scale"
                >
                  ↺
                </button>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Blend Mode</label>
            <Select
              value={effectiveSettings.blendMode}
              onChange={(val) => updateSettings({ blendMode: val })}
            >
              <option value="overlay">Overlay</option>
              <option value="multiply">Multiply</option>
              <option value="hard-light">Hard Light</option>
              <option value="soft-light">Soft Light</option>
            </Select>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <section className={styles.allPreviews}>
            <div className={styles.previewContainer}>
              <p className={styles.previewLabel}>Background Preview</p>
              <div
                className={`${styles.backgroundPreview} ${texture.className}`}
                style={{
                  background: effectiveSettings.color,
                  "--texture-intensity": effectiveSettings.intensity,
                  "--texture-scale": `${effectiveSettings.scale}px`,
                  "--texture-blend-mode": effectiveSettings.blendMode,
                }}
              />
            </div>
            <div className={styles.previewContainer}>
              <p className={styles.previewLabel}>Text Preview</p>
              <div
                className={`${styles.textPreview} ${texture.textClassName}`}
                style={{
                  backgroundColor: effectiveSettings.color,
                  "--texture-intensity": effectiveSettings.intensity,
                  "--texture-scale": `${effectiveSettings.scale}px`,
                  "--texture-blend-mode": effectiveSettings.blendMode,
                }}
              >
                Texture
              </div>
            </div>
          </section>

          <div className={styles.snippetHeader}>
            <p className={styles.previewLabel}>Snippet</p>
          </div>
          <div className={styles.snippetBox}>
            <pre className={styles.snippet}>{snippet}</pre>
          </div>

          <div className={styles.snippetActions}>
            <div className={styles.snippetOptions}>
              <Select
                value={snippetFormat}
                onChange={(val) => setSnippetFormat(val as SnippetFormat)}
              >
                <option value={SnippetFormat.JSX}>JSX</option>
                <option value={SnippetFormat.JS}>JS</option>
                <option value={SnippetFormat.CSS}>CSS</option>
              </Select>
              <Select
                value={snippetTarget}
                onChange={(val) => setSnippetTarget(val as SnippetTarget)}
              >
                <option value={SnippetTarget.Background}>Background</option>
                <option value={SnippetTarget.Text}>Text</option>
              </Select>
            </div>
            <button onClick={copySnippet}>
              {copied ? "Copied!" : "Copy snippet"}
            </button>
          </div>
        </div>

        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close editor"
        >
          ×
        </button>
      </div>
    </div>
  );
};
