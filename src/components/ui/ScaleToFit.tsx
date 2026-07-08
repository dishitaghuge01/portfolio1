import React, { useLayoutEffect, useRef, useState } from 'react';
import styles from './ScaleToFit.module.css';

interface ScaleToFitProps {
  children: React.ReactNode;
}

// Wraps a page's content, measures its natural (unconstrained) size at 1:1,
// and scales it down — as a single rigid unit, preserving every proportion
// exactly — to fit whatever space is actually available in the current
// window. Never scales up past 1:1, so on a tall/roomy viewport (e.g. a
// fullscreen browser on a tall display) it renders pixel-identical to the
// original design; on a shorter windowed browser it shrinks uniformly
// instead of overflowing or relying on hand-tuned breakpoints that can
// fall out of sync with the actual content.
const ScaleToFit: React.FC<ScaleToFitProps> = ({ children }) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const recompute = () => {
      // Measure the content's natural size before any scaling is applied.
      inner.style.transform = 'scale(1)';
      const naturalWidth = inner.scrollWidth;
      const naturalHeight = inner.scrollHeight;
      if (naturalWidth === 0 || naturalHeight === 0) return;

      const availableWidth = outer.clientWidth;
      const availableHeight = outer.clientHeight;

      const next = Math.min(1, availableWidth / naturalWidth, availableHeight / naturalHeight);
      setScale(Number.isFinite(next) && next > 0 ? next : 1);
    };

    recompute();

    const ro = new ResizeObserver(recompute);
    ro.observe(outer);
    ro.observe(inner);

    return () => ro.disconnect();
  }, [children]);

  return (
    <div ref={outerRef} className={styles.outer}>
      <div
        ref={innerRef}
        className={styles.inner}
        style={{ transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScaleToFit;