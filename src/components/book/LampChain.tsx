import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import styles from './LampChain.module.css';

type Theme = 'dark' | 'light';
type AnimState = 'rest' | 'pull' | 'snap';

interface LampChainProps {
  theme: Theme;
  onToggle: () => void;
}

const BEADS_DESKTOP = 20;
const BEADS_MOBILE = 10; // shorter chain — 20 beads runs too tall on small screens
const EXTRA_BEADS = 3; // additional links revealed from the mount during pull

// Shared bead+segment unit — used identically for both the main chain
// and the extra slack beads, so the "feeding out" links are visually
// indistinguishable from the rest of the chain.
const BeadUnit: React.FC<{ index: number }> = ({ index }) => {
  const isEvenIndex = index % 2 === 0;
  return (
    <div className={styles.beadUnit}>
      <div className={styles.segment} />
      <div
        className={[
          styles.bead,
          isEvenIndex ? styles.beadLarge : styles.beadSmall,
          isEvenIndex ? styles.beadEven : styles.beadOdd,
        ].join(' ')}
      />
    </div>
  );
};

const LampChain: React.FC<LampChainProps> = ({ onToggle }) => {
  const [anim, setAnim]   = useState<AnimState>('rest');
  const [hovered, setHov] = useState(false);
  const timerRef          = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile          = useIsMobile();
  const beadCount          = isMobile ? BEADS_MOBILE : BEADS_DESKTOP;

  const handleClick = useCallback(() => {
    if (anim !== 'rest') return;
    if (timerRef.current !== null) clearTimeout(timerRef.current);

    setAnim('pull');
    timerRef.current = setTimeout(() => {
      setAnim('snap');
      onToggle();
      timerRef.current = setTimeout(() => setAnim('rest'), 1400);
    }, 220);
  }, [anim, onToggle]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  // Wrapper NEVER gets animation/transform classes — it stays glued to top:0
  const wrapperClasses = [
    styles.wrapper,
    hovered ? styles.wrapperHovered : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Extra beads container and chainBody animate together, in perfect sync
  const extraBeadsClasses = [
    styles.extraBeads,
    anim === 'pull' ? styles.extraBeadsPull : '',
    anim === 'snap' ? styles.extraBeadsSnap : '',
  ]
    .filter(Boolean)
    .join(' ');

  const chainBodyClasses = [
    styles.chainBody,
    anim === 'pull' ? styles.chainBodyPull : '',
    anim === 'snap' ? styles.chainBodySnap : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={wrapperClasses}
      onClick={handleClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      role="button"
      tabIndex={0}
      aria-label="Pull to toggle theme"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Extra slack — real bead+segment units revealed from the fixed mount
          as the chain pulls down, clipped by overflow:hidden when at rest */}
      <div className={extraBeadsClasses} aria-hidden="true">
        {Array.from({ length: EXTRA_BEADS }, (_, i) => (
          <BeadUnit key={`extra-${i}`} index={i} />
        ))}
      </div>

      {/* Chain body — the only element that moves; chain starts directly here */}
      <div className={chainBodyClasses}>
        {/* Beaded chain — shorter on mobile so it doesn't run too tall */}
        {Array.from({ length: beadCount }, (_, i) => (
          <BeadUnit key={i} index={i} />
        ))}

        {/* End bead — the grip, slightly larger than all other beads */}
        <div className={styles.beadUnit}>
          <div className={styles.segment} />
          <div className={`${styles.bead} ${styles.beadEnd} ${styles.beadEven}`} />
        </div>
      </div>
    </div>
  );
};

export default LampChain;