import React, { useEffect, useState } from 'react';
import styles from './BookPage.module.css';

type Side = 'left' | 'right';
type FlipDirection = 'forward' | 'backward';

interface BookPageProps {
  side: Side;
  children?: React.ReactNode;
  isFlipping?: boolean;
  flipDirection?: FlipDirection;
  className?: string;
}

const BookPage: React.FC<BookPageProps> = ({
  side,
  children,
  isFlipping = false,
  flipDirection,
  className,
}) => {
  const [animationReady, setAnimationReady] = useState(false);

  const isIncoming = (isFlipping && flipDirection === 'forward' && side === 'left') ||
                     (isFlipping && flipDirection === 'backward' && side === 'right');
  const isOutgoing = (isFlipping && flipDirection === 'forward' && side === 'right') ||
                     (isFlipping && flipDirection === 'backward' && side === 'left');

  useEffect(() => {
    if (!isIncoming) {
      setAnimationReady(false);
      return;
    }

    setAnimationReady(false);
    const timer = setTimeout(() => setAnimationReady(true), 300);
    return () => clearTimeout(timer);
  }, [isIncoming]);

  const pageClasses = [
    styles.page,
    side === 'left' ? styles.left : styles.right,
    isOutgoing && flipDirection === 'forward'               ? styles.flipOutForward  : '',
    isIncoming && animationReady && flipDirection === 'forward'  ? styles.flipInForward   : '',
    isOutgoing && flipDirection === 'backward'              ? styles.flipOutBackward : '',
    isIncoming && animationReady && flipDirection === 'backward' ? styles.flipInBackward  : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const spineShadowClasses = [
    styles.spineShadow,
    side === 'left' ? styles.spineShadowLeft : styles.spineShadowRight,
  ].join(' ');

  return (
    <div className={pageClasses}>
      <div className={styles.inner}>{children}</div>
      <div className={spineShadowClasses} aria-hidden="true" />
    </div>
  );
};

export default BookPage;