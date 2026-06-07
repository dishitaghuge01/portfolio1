import React from 'react';
import styles from './BookPage.module.css';

type Side = 'left' | 'right';
type FlipDirection = 'forward' | 'backward';

interface BookPageProps {
  side: Side;
  children?: React.ReactNode;
  isFlipping?: boolean;
  flipDirection?: FlipDirection;
}

const BookPage: React.FC<BookPageProps> = ({
  side,
  children,
  isFlipping = false,
  flipDirection,
}) => {
  const isAnimatingForwardRight =
    isFlipping && flipDirection === 'forward' && side === 'right';
  const isAnimatingBackwardLeft =
    isFlipping && flipDirection === 'backward' && side === 'left';

  const classes = [
    styles.page,
    side === 'left' ? styles.left : styles.right,
    isAnimatingForwardRight ? styles.flipForwardRight : '',
    isAnimatingBackwardLeft ? styles.flipBackwardLeft : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className={styles.inner}>{children}</div>

      {/* Spine shadow — right edge of left page, left edge of right page */}
      <div
        className={[
          styles.spineShadow,
          side === 'left' ? styles.spineShadowLeft : styles.spineShadowRight,
        ].join(' ')}
        aria-hidden="true"
      />
    </div>
  );
};

export default BookPage;