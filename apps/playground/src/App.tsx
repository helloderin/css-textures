import { leather } from "css-textures";
import styles from "./App.module.css";
import { SwatchCard } from "./components/SwatchCard";
import { SwatchCardSettingsEditor } from "./components/SwatchCardSettingsEditor";
import { GlobalSettingsEditor } from "./components/GlobalSettingsEditor";
import { Fragment, useRef, useState } from "react";

const textures = [leather];

const DEFAULT_COLOR = "#a0856b";
const DEFAULT_INTENSITY = 0.5;
const DEFAULT_SCALE = 200;
const DEFAULT_BLEND_MODE = "overlay";

const DEFAULTS: SwatchSettings = {
  color: DEFAULT_COLOR,
  intensity: DEFAULT_INTENSITY,
  scale: DEFAULT_SCALE,
  blendMode: DEFAULT_BLEND_MODE,
};

export interface SwatchSettings {
  color: string;
  intensity: number;
  scale: number;
  blendMode: string;
}

function App() {
  const [globalSettings, setGlobalSettings] =
    useState<SwatchSettings>(DEFAULTS);
  const [selectedTextureId, setSelectedTextureId] = useState<string | null>(
    null,
  );
  const [insertAfterIndex, setInsertAfterIndex] = useState<number | null>(null);
  const [textureOverrides, setTextureOverrides] = useState<
    Record<string, Partial<SwatchSettings>>
  >({});
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  function handleCardClick(textureId: string, index: number) {
    if (selectedTextureId === textureId) {
      setSelectedTextureId(null);
      setInsertAfterIndex(null);
      return;
    }

    const clickedTop =
      cardRefs.current[index]?.getBoundingClientRect().top ?? 0;
    let lastInRow = index;
    for (let i = index + 1; i < textures.length; i++) {
      const top = cardRefs.current[i]?.getBoundingClientRect().top ?? -1;
      if (Math.round(top) === Math.round(clickedTop)) lastInRow = i;
      else break;
    }

    setSelectedTextureId(textureId);
    setInsertAfterIndex(lastInRow);
  }

  const selectedTexture = textures.find((t) => t.id === selectedTextureId);

  return (
    <>
      <section className={styles.globalsEditorSection}>
        <GlobalSettingsEditor
          settings={globalSettings}
          defaults={DEFAULTS}
          onChange={setGlobalSettings}
          onReset={() => setGlobalSettings(DEFAULTS)}
        />
      </section>
      <section className={styles.gallerySection}>
        {textures.map((t, i) => (
          <Fragment key={i}>
            <SwatchCard
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              texture={t}
              isSelected={selectedTextureId === t.id}
              hasOverrides={
                !!(
                  textureOverrides[t.id] &&
                  Object.keys(textureOverrides[t.id]).length > 0
                )
              }
              vars={{ ...globalSettings, ...textureOverrides[t.id] }}
              onClick={() => handleCardClick(t.id, i)}
            />
            {insertAfterIndex === i && selectedTexture && (
              <SwatchCardSettingsEditor
                texture={selectedTexture}
                globalSettings={globalSettings}
                overrides={textureOverrides[selectedTexture.id] ?? {}}
                onOverridesChange={(overrides) =>
                  setTextureOverrides((prev) => ({
                    ...prev,
                    [selectedTexture.id]: overrides,
                  }))
                }
                onClose={() => {
                  setSelectedTextureId(null);
                  setInsertAfterIndex(null);
                }}
              />
            )}
          </Fragment>
        ))}
      </section>
    </>
  );
}

export default App;
