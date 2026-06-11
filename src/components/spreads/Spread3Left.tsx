import React from 'react';
import GlassCircle from '../../components/ui/GlassCircle';
import { projects } from '../../data/projects';
import styles from './Spread3Left.module.css';

// ── Floorplan placeholder SVG ─────────────────────────────────────────────────
// Abstract room layout: outer boundary + 3 interior walls dividing 4 rooms.
// White strokes at 20% opacity, no fills — purely structural suggestion.
const FloorplanPlaceholder: React.FC = () => (
  <svg
    width="140"
    height="140"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Outer boundary */}
    <rect x="10" y="10" width="80" height="80"
      stroke="rgba(255,255,255,0.20)" strokeWidth="1" />

    {/* Vertical wall — divides left and right halves */}
    <line x1="50" y1="10" x2="50" y2="70"
      stroke="rgba(255,255,255,0.20)" strokeWidth="1" />

    {/* Horizontal wall — divides top and bottom, with door gap on left side */}
    <line x1="10" y1="55" x2="42" y2="55"
      stroke="rgba(255,255,255,0.20)" strokeWidth="1" />
    <line x1="50" y1="55" x2="90" y2="55"
      stroke="rgba(255,255,255,0.20)" strokeWidth="1" />

    {/* Small inner wall stub — bottom-right room subdivision */}
    <line x1="70" y1="55" x2="70" y2="90"
      stroke="rgba(255,255,255,0.20)" strokeWidth="1" />

    {/* Door arc hints — top-left room */}
    <path d="M 34 10 A 8 8 0 0 1 42 18"
      stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />

    {/* Window notch — right wall */}
    <line x1="90" y1="28" x2="90" y2="42"
      stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />

    {/* Small square — bathroom / utility room top-right */}
    <rect x="52" y="12" width="18" height="18"
      stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
const Spread3Left: React.FC = () => (
  <div className={styles.page}>
    {/* ① Snapshot circle with floorplan placeholder */}
    <GlassCircle size={320} placeholderColor="#1a2a3a">
      <FloorplanPlaceholder />
    </GlassCircle>

    {/* ② Live demo link */}
    <a
      href={projects[0].liveLink}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.liveLink}
    >
      ↗ Live Demo
    </a>
  </div>
);

export default Spread3Left;