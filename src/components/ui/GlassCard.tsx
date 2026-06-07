import React from 'react';
import styles from './GlassCard.module.css';

type Padding = 'sm' | 'md' | 'lg' | 'none';

interface GlassCardProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  hoverable?: boolean;
  padding?: Padding;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  style,
  onClick,
  hoverable = false,
  padding = 'md',
}) => {
  const classes = [
    styles.card,
    styles[`padding-${padding}`],
    hoverable ? styles.hoverable : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
};

export default GlassCard;