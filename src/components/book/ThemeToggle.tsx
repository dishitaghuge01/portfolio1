import React from 'react';
import styles from './ThemeToggle.module.css';

type Theme = 'dark' | 'light';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

// Show the icon for the theme you'll SWITCH TO on click
const ICONS: Record<Theme, string> = {
  dark: '☀',   // currently dark → click to go light
  light: '☾',  // currently light → click to go dark
};

const LABELS: Record<Theme, string> = {
  dark: 'Switch to light theme',
  light: 'Switch to dark theme',
};

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => (
  <button
    type="button"
    className={styles.toggle}
    onClick={onToggle}
    aria-label={LABELS[theme]}
    title={LABELS[theme]}
  >
    {ICONS[theme]}
  </button>
);

export default ThemeToggle;