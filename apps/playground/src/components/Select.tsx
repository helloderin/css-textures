import type { JSX } from "react";
import styles from "./Select.module.css";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

export const Select = ({ value, onChange, children }: SelectProps): JSX.Element => (
  <select
    className={styles.select}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    {children}
  </select>
);
