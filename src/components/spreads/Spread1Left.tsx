import React, { useEffect, useRef, useState } from 'react';
import GlassCircle from '../../components/ui/GlassCircle';
import { socialLinks } from '../../data/profile';
import styles from './Spread1Left.module.css';

// ── Geometry constants ────────────────────────────────────────────────────────
const CX       = 260;                      // wrapper/SVG center x
const CY       = 260;                      // wrapper/SVG center y
const RING_R   = 218;                      // orbital ring radius (8px outside photo edge 210px)
const TICK_OUT = 228;                      // outer tick endpoint radius
const LABEL_R  = 245;                      // HTML label anchor radius
const INTRO_MS = 4000;                     // ring draw duration (ms)
const CIRC     = 1370;                    // ≈ 2 * π * 218
const CHAR_MS  = 60;                       // ms per typewriter character

// Only 3 labels. mathDeg = clockDeg − 90.
// clockDeg is the visual clockwise-from-12 position.
const ORBIT_LABELS = [
  { label: 'CGPA 9.01',   clockDeg:  60, mathDeg:  -30 },
  { label: 'YCCE NAGPUR', clockDeg: 120, mathDeg:   30 },
  { label: '2023 – 2027', clockDeg: 300, mathDeg:  210 },
];

// Tick marks only at the 3 label clock positions
const TICK_CLOCK_DEG = [60, 120, 300];

const BADGES: Record<string, string> = {
  github: 'gh', linkedin: 'in', gmail: 'gm', email: 'gm',
};
function getBadge(p: string): string {
  return BADGES[p.toLowerCase()] ?? p.slice(0, 2).toLowerCase();
}

// Convert math angle (degrees, 0=right, CW positive) to radians
function toMathRad(mathDeg: number): number {
  return (mathDeg * Math.PI) / 180;
}

// Convert clock angle (0=top, CW) to SVG position
// SVG y increases downward, so clockDeg 0 → top → subtract 90° from math convention
function clockToSvgPos(clockDeg: number, r: number) {
  const rad = ((clockDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

// Returns label position and outward transform.
// mathDeg: standard math angle (0=right, +CW).
// Right half (−90 to 90): text extends rightward from anchor.
// Left half (90 to 270): text extends leftward from anchor.
function getLabelStyle(mathDeg: number): { left: number; top: number; transform: string } {
  const rad  = toMathRad(mathDeg);
  const left = CX + LABEL_R * Math.cos(rad);
  const top  = CY + LABEL_R * Math.sin(rad);
  // Normalise to 0–360 for the half-plane check
  const norm = ((mathDeg % 360) + 360) % 360;
  const transform =
    norm <= 90 || norm >= 270
      ? 'translate(10px, -50%)'                  // right half → text goes right
      : 'translate(calc(-100% - 10px), -50%)';   // left half  → text goes left
  return { left, top, transform };
}

// ── Placeholder silhouette ────────────────────────────────────────────────────
const PersonPlaceholder: React.FC = () => (
  <svg
    width="96" height="96"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="50" cy="32" r="18" fill="rgba(255,255,255,0.20)" />
    <ellipse cx="50" cy="90" rx="32" ry="22" fill="rgba(255,255,255,0.20)" />
  </svg>
);

// ── Props ─────────────────────────────────────────────────────────────────────
interface Spread1LeftProps {
  animationKey?: number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const Spread1Left: React.FC<Spread1LeftProps> = ({ animationKey = 0 }) => {
  const [labelTexts, setLabelTexts] = useState<string[]>(['', '', '']);
  const [typing,     setTyping]     = useState<boolean[]>([false, false, false]);
  // Bumped on each animationKey change to force CSS ring-draw restart via React key
  const [animCycle,  setAnimCycle]  = useState(0);

  const intervalIdsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const timeoutIdsRef  = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // ── Reset ────────────────────────────────────────────────────────────
    setLabelTexts(['', '', '']);
    setTyping([false, false, false]);
    setAnimCycle((c) => c + 1);

    intervalIdsRef.current.forEach(clearInterval);
    intervalIdsRef.current = [];
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];

    // ── Typewriter for a single label ────────────────────────────────────
    function typeLabel(index: number): void {
      const fullText = ORBIT_LABELS[index].label;
      let charCount  = 0;

      setTyping((prev) => {
        const next = [...prev]; next[index] = true; return next;
      });

      const ivId = setInterval(() => {
        charCount += 1;
        const current = fullText.slice(0, charCount);
        setLabelTexts((prev) => {
          const next = [...prev]; next[index] = current; return next;
        });
        if (charCount >= fullText.length) {
          clearInterval(ivId);
          setTyping((prev) => {
            const next = [...prev]; next[index] = false; return next;
          });
          intervalIdsRef.current = intervalIdsRef.current.filter((id) => id !== ivId);
        }
      }, CHAR_MS);
      intervalIdsRef.current.push(ivId);
    }

    // ── Schedule each label by its clock position along the ring draw ────
    // Trigger time = INTRO_MS × (clockDeg / 360)
    ORBIT_LABELS.forEach(({ clockDeg }, i) => {
      const delay = INTRO_MS * (clockDeg / 360);
      const toId  = setTimeout(() => typeLabel(i), delay);
      timeoutIdsRef.current.push(toId);
    });

    // Safety-net: after full 4s, snap all labels to complete text
    const safetyId = setTimeout(() => {
      setLabelTexts(ORBIT_LABELS.map((l) => l.label));
      setTyping([false, false, false]);
    }, INTRO_MS + 100);
    timeoutIdsRef.current.push(safetyId);

    return () => {
      intervalIdsRef.current.forEach(clearInterval);
      intervalIdsRef.current = [];
      timeoutIdsRef.current.forEach(clearTimeout);
      timeoutIdsRef.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationKey]);

  return (
    <div className={styles.page}>

      {/* ① Radar orbital circle */}
      <div className={styles.orbitalWrapper}>

        {/* Photo frame — absolutely centered */}
        <div className={styles.circleAnchor}>
          <GlassCircle size={420} placeholderColor="#1a2a3a" imageSrc="/src/assets/Dishita.jpeg">
            <PersonPlaceholder />
          </GlassCircle>
        </div>

        {/* Orbital SVG — ring + ticks only, no sweep line */}
        <svg
          className={styles.orbitalSvg}
          viewBox="0 0 520 520"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Ring — draws itself clockwise from 12 o'clock over 4s */}
          <circle
            key={`ring-${animCycle}`}
            cx={CX} cy={CY} r={RING_R}
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth={0.8}
            opacity={0.6}
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC}
            className={styles.ringDraw}
            style={{ transformOrigin: `${CX}px ${CY}px`, transform: 'rotate(-90deg)' }}
          />

          {/* Tick marks — only at the 3 label positions */}
          {TICK_CLOCK_DEG.map((clockDeg) => {
            const inner = clockToSvgPos(clockDeg, RING_R);
            const outer = clockToSvgPos(clockDeg, TICK_OUT);
            return (
              <line
                key={clockDeg}
                x1={inner.x} y1={inner.y}
                x2={outer.x} y2={outer.y}
                stroke="var(--accent-primary)"
                strokeWidth={0.8}
                opacity={0.6}
              />
            );
          })}
        </svg>

        {/* HTML text labels */}
        {ORBIT_LABELS.map(({ label, mathDeg }, index) => {
          const { left, top, transform } = getLabelStyle(mathDeg);
          const text        = labelTexts[index];
          const isCursoring = typing[index];
          return (
            <div
              key={label}
              className={styles.orbitLabel}
              style={{ left, top, transform }}
            >
              {text}
              {isCursoring && <span className={styles.cursor}>|</span>}
            </div>
          );
        })}
      </div>

      {/* ② Name + tagline */}
      <div className={styles.identity}>
        <h1 className={styles.name}>Dishita Ghuge</h1>
        <p className={styles.tagline}>
          Building intelligent systems at the intersection of ML and architecture
        </p>
      </div>

      {/* ③ Social links */}
      <div className={styles.socialRow}>
        {socialLinks.map((link) => (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label={link.platform}
          >
            <span className={styles.badge}>{getBadge(link.platform)}</span>
            <span className={styles.socialLabel}>{link.platform}</span>
          </a>
        ))}
      </div>

    </div>
  );
};

export default Spread1Left;