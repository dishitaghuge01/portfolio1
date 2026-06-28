import React, { useEffect, useRef, useState } from 'react';
import GlassCircle from '../../components/ui/GlassCircle';
import { socialLinks } from '../../data/profile';
import resumePdf from '../../assets/resume.pdf';
import styles from './Spread1Left.module.css';

// ── Geometry constants ────────────────────────────────────────────────────────
const CX       = 260;                      // wrapper/SVG center x
const CY       = 260;                      // wrapper/SVG center y
const RING_R   = 218;                      // orbital ring radius (8px outside photo edge 210px)
const TICK_OUT = 228;                      // outer tick endpoint radius
const LABEL_R  = RING_R + 16;              // HTML label anchor radius — 16px outside ring edge
const INTRO_MS = 4000;                     // ring draw duration (ms)
const CIRC     = 1370;                    // ≈ 2 * π * 218
const CHAR_MS  = 60;                       // ms per typewriter character
const LINE_PAUSE_MS = 200;                 // pause between title and subtitle typing

// Only 3 labels. mathDeg = clockDeg − 90.
// clockDeg is the visual clockwise-from-12 position.
// title and subtitle may both contain \n for multi-line text; subtitle may be empty.
const ORBIT_LABELS = [
  {
    clockDeg: 60,
    mathDeg: -30,
    title: 'YESHWANTRAO CHAVAN COLLEGE\nOF ENGINEERING',
    subtitle: 'NAGPUR\n2023–27',
  },
  {
    clockDeg: 120,
    mathDeg: 30,
    title: 'B.TECH IN CSE',
    subtitle: 'MINOR IN ROBOTICS & CIM\nCGPA 9.01',
  },
  {
    clockDeg: 300,
    mathDeg: 210,
    title: 'I USE ARCH, BTW!',
    subtitle: '',
  },
];

// Tick marks only at the 3 label clock positions
const TICK_CLOCK_DEG = [60, 120, 300];

// Resume link — handled locally since SocialLink's platform union doesn't
// include "resume". If profile.ts's SocialLink type is later widened to
// include "resume", this can be folded back into socialLinks instead.
const resumeLink = { platform: 'resume', url: resumePdf, label: 'Resume' };

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
// Right half (−90 to 90, exclusive of exact top/bottom): text extends rightward.
// Left half (90 to 270): text extends leftward.
// Exact top (−90°) and bottom (90°) get their own vertical-push cases.
function getLabelStyle(mathDeg: number): { left: number; top: number; transform: string } {
  const rad  = toMathRad(mathDeg);
  const left = CX + LABEL_R * Math.cos(rad);
  const top  = CY + LABEL_R * Math.sin(rad);
  // Normalise to 0–360 for the half-plane check
  const norm = ((mathDeg % 360) + 360) % 360;

  let transform: string;
  if (norm === 270) {
    // Exact top — push upward, away from the ring
    transform = 'translate(-50%, calc(-100% - 6px))';
  } else if (norm === 90) {
    // Exact bottom — push downward, away from the ring
    transform = 'translate(-50%, 6px)';
  } else if (norm <= 90 || norm >= 270) {
    transform = 'translate(6px, -50%)';                   // right half → text goes right
  } else {
    transform = 'translate(calc(-100% - 6px), -50%)';     // left half  → text goes left
  }
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

// ── Component ─────────────────────────────────────────────────────────────────
// No props — the animation runs once per mount, naturally. The parent
// (Book.tsx) is responsible for remounting this component via a changing
// `key` whenever the user returns to spread 1, which is what re-triggers
// the animation. No animationKey prop needed.
const Spread1Left: React.FC = () => {
  // Each label now types its title (possibly multi-line) and subtitle.
  const [titleTexts, setTitleTexts]       = useState<string[]>(['', '', '']);
  const [subtitleTexts, setSubtitleTexts] = useState<string[]>(['', '', '']);
  const [typing, setTyping]               = useState<boolean[]>([false, false, false]);
  // Bumped once on mount to force the CSS ring-draw animation to (re)start
  const [animCycle, setAnimCycle]         = useState(0);

  const intervalIdsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const timeoutIdsRef  = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Always reset state on mount
    setTitleTexts(['', '', '']);
    setSubtitleTexts(['', '', '']);
    setTyping([false, false, false]);

    setAnimCycle((c) => c + 1);

    intervalIdsRef.current.forEach(clearInterval);
    intervalIdsRef.current = [];
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];

    // ── Typewriter for one line of a label ───────────────────────────────
    // Calls onDone when the full line has been typed. No-ops immediately
    // (calling onDone synchronously) if fullText is empty — covers the
    // empty-subtitle case (e.g. "I USE ARCH, BTW!").
    function typeLine(
      fullText: string,
      setter: React.Dispatch<React.SetStateAction<string[]>>,
      index: number,
      onDone: () => void,
    ): void {
      if (fullText.length === 0) {
        onDone();
        return;
      }
      let charCount = 0;
      const ivId = setInterval(() => {
        charCount += 1;
        const current = fullText.slice(0, charCount);
        setter((prev) => {
          const next = [...prev]; next[index] = current; return next;
        });
        if (charCount >= fullText.length) {
          clearInterval(ivId);
          intervalIdsRef.current = intervalIdsRef.current.filter((id) => id !== ivId);
          onDone();
        }
      }, CHAR_MS);
      intervalIdsRef.current.push(ivId);
    }

    // ── Type title, pause, then type subtitle (if any) ───────────────────
    function typeLabel(index: number): void {
      const { title, subtitle } = ORBIT_LABELS[index];

      setTyping((prev) => {
        const next = [...prev]; next[index] = true; return next;
      });

      typeLine(title, setTitleTexts, index, () => {
        const pauseId = setTimeout(() => {
          typeLine(subtitle, setSubtitleTexts, index, () => {
            setTyping((prev) => {
              const next = [...prev]; next[index] = false; return next;
            });
          });
        }, LINE_PAUSE_MS);
        timeoutIdsRef.current.push(pauseId);
      });
    }

    // ── Schedule each label by its clock position along the ring draw ────
    // Trigger time = INTRO_MS × (clockDeg / 360)
    ORBIT_LABELS.forEach(({ clockDeg }, i) => {
      const delay = INTRO_MS * (clockDeg / 360);
      const toId  = setTimeout(() => typeLabel(i), delay);
      timeoutIdsRef.current.push(toId);
    });

    // Safety-net: after full 4s (+ generous buffer for the two-line type +
    // pause sequence), snap all labels to complete text
    const safetyId = setTimeout(() => {
      setTitleTexts(ORBIT_LABELS.map((l) => l.title));
      setSubtitleTexts(ORBIT_LABELS.map((l) => l.subtitle));
      setTyping([false, false, false]);
    }, INTRO_MS + 2000);
    timeoutIdsRef.current.push(safetyId);

    return () => {
      intervalIdsRef.current.forEach(clearInterval);
      intervalIdsRef.current = [];
      timeoutIdsRef.current.forEach(clearTimeout);
      timeoutIdsRef.current = [];
    };
  }, []);

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

        {/* HTML text labels — title and subtitle each split on \n into block lines */}
        {ORBIT_LABELS.map(({ mathDeg, title }, index) => {
          const { left, top, transform } = getLabelStyle(mathDeg);
          const titleText    = titleTexts[index];
          const subtitleText = subtitleTexts[index];
          const isCursoring  = typing[index];
          const cursorAfterTitle = isCursoring && subtitleText.length === 0;
          // Split the currently-typed text on \n so each line renders as its
          // own block-level span — handles multi-line title/subtitle like
          // "YESHWANTRAO CHAVAN COLLEGE\nOF ENGINEERING" and "NAGPUR\n2023–27".
          const titleLines    = titleText.split('\n');
          const subtitleLines = subtitleText.split('\n');
          const hasSubtitleContent = subtitleText.length > 0 || (isCursoring && !cursorAfterTitle);
          return (
            <div
              key={title}
              className={styles.orbitLabel}
              style={{ left, top, transform }}
            >
              {titleLines.map((line, lineIdx) => (
                <span
                  key={`title-${lineIdx}`}
                  className={styles.orbitLabelTitle}
                  style={{ display: 'block' }}
                >
                  {line}
                  {cursorAfterTitle && lineIdx === titleLines.length - 1 && (
                    <span className={styles.cursor}>|</span>
                  )}
                </span>
              ))}
              {hasSubtitleContent &&
                subtitleLines.map((line, lineIdx) => (
                  <span
                    key={`subtitle-${lineIdx}`}
                    className={styles.orbitLabelSubtitle}
                    style={{ display: 'block' }}
                  >
                    {line}
                    {isCursoring && !cursorAfterTitle && lineIdx === subtitleLines.length - 1 && (
                      <span className={styles.cursor}>|</span>
                    )}
                  </span>
                ))}
            </div>
          );
        })}
      </div>

      {/* ② Name + tagline */}
      <div className={styles.identity}>
        <h1 className={styles.name}>Dishita Ghuge</h1>
        <p className={styles.tagline}>
          Applied ML, post-quantum security, and a bias for research that ships
        </p>
      </div>

      {/* ③ Social links — label + northeast arrow, no badge */}
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
            <span className={styles.socialLabel}>{link.platform}</span>
            <span className={styles.socialArrow}>↗</span>
          </a>
        ))}

        {/* Resume — handled separately since SocialLink's platform union
            doesn't include "resume" */}
        <a
          key={resumeLink.platform}
          href={resumeLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label={resumeLink.label}
        >
          <span className={styles.socialLabel}>{resumeLink.label}</span>
          <span className={styles.socialArrow}>↗</span>
        </a>
      </div>

    </div>
  );
};

export default Spread1Left;