import { forwardRef, type JSX } from "react";
import styles from "./SwatchCard.module.css";
import type { SwatchSettings } from "../App";
import type { Texture } from "css-textures";

interface SwatchCardProps {
  texture: Texture;
  hasOverrides: boolean;
  isSelected: boolean;
  vars: SwatchSettings;
  onClick: () => void;
}

export const SwatchCard = forwardRef<HTMLDivElement, SwatchCardProps>(
  (props, ref): JSX.Element => {
    return (
      <div
        ref={ref}
        className={`${styles.swatchCard}${props.isSelected ? ` ${styles.swatchCardSelected}` : ""}`}
        onClick={props.onClick}
      >
        <div
          className={`${styles.background} ${props.texture.className}`}
          style={
            {
              background: props.vars.color,
              "--texture-intensity": props.vars.intensity,
              "--texture-scale": `${props.vars.scale}px`,
              "--texture-blend-mode": props.vars.blendMode,
            }
          }
        />
        <div className={styles.description}>
          <div className={styles.textureNameContainer}>
            <p className={styles.textureName}>{props.texture.id}</p>
            {props.hasOverrides && (
              <span className={styles.modifiedDot} aria-hidden="true">
                •
              </span>
            )}
          </div>
          <p className={styles.textureClassName}>.{props.texture.className}</p>
        </div>
      </div>
    );
  },
);
