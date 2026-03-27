import { useRef, type JSX } from "react";
import styles from "./GlobalSettingsEditor.module.css";
import type { SwatchSettings } from "../App";
import { Select } from "./Select";

interface GlobalSettingsEditorProps {
  settings: SwatchSettings;
  defaults: SwatchSettings;
  onChange: (settings: SwatchSettings) => void;
  onReset: () => void;
}

export const GlobalSettingsEditor = ({
  settings,
  defaults,
  onChange,
  onReset,
}: GlobalSettingsEditorProps): JSX.Element => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const updateSettings = (update: Partial<SwatchSettings>) => {
    onChange({ ...settings, ...update });
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Color</label>
        <button
          className={styles.colorChangeButton}
          style={{ background: settings.color }}
          onClick={() => colorInputRef.current?.click()}
          aria-label="Pick swatch color"
        />
        <input
          ref={colorInputRef}
          type="color"
          value={settings.color}
          onChange={(e) => updateSettings({ color: e.target.value })}
          className={styles.hiddenColorInput}
        />
        {settings.color !== defaults.color && (
          <button
            className={styles.fieldResetButton}
            onClick={() => updateSettings({ color: defaults.color })}
            aria-label="Reset color"
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
            value={settings.intensity}
            onChange={(e) =>
              updateSettings({ intensity: parseFloat(e.target.value) })
            }
          />
          <span className={styles.fieldValue}>
            {Math.round(settings.intensity * 100)}%
          </span>

          {settings.intensity !== defaults.intensity && (
            <button
              className={styles.fieldResetButton}
              onClick={() => updateSettings({ intensity: defaults.intensity })}
              aria-label="Reset intensity"
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
            value={settings.scale}
            onChange={(e) =>
              updateSettings({ scale: parseInt(e.target.value, 10) })
            }
          />
          <span className={styles.fieldValue}>{settings.scale}px</span>
          {settings.scale !== defaults.scale && (
            <button
              className={styles.fieldResetButton}
              onClick={() => updateSettings({ scale: defaults.scale })}
              aria-label="Reset scale"
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
          value={settings.blendMode}
          onChange={(val) => updateSettings({ blendMode: val })}
        >
          <option value="overlay">Overlay</option>
          <option value="multiply">Multiply</option>
          <option value="hard-light">Hard Light</option>
          <option value="soft-light">Soft Light</option>
        </Select>
      </div>

      <button className={styles.resetButton} onClick={onReset}>
        Reset all
      </button>
    </div>
  );
};
