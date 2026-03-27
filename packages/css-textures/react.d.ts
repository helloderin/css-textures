import 'react';

declare module 'react' {
  interface CSSProperties {
    '--texture-scale'?: string;
    '--texture-intensity'?: string | number;
    '--texture-blend-mode'?: string;
  }
}
