import React from 'react';
import styles from './NavArrow.module.css';

type Direction = 'left' | 'right';

interface NavArrowProps {
  direction: Direction;
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

const ARROWS: Record<Direction, string> = {
  left: '←',
  right: '→',
};

const NavArrow: React.FC<NavArrowProps> = ({
  direction,
  onClick,
  disabled = false,
  label,
}) => {
  const defaultLabel = direction === 'left' ? 'Previous page' : 'Next page';

  return (
    <button
      type="button"
      className={[styles.button, disabled ? styles.disabled : '']
        .filter(Boolean)
        .join(' ')}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={label ?? defaultLabel}
      aria-disabled={disabled}
    >
      {ARROWS[direction]}
    </button>
  );
};

export default NavArrow;