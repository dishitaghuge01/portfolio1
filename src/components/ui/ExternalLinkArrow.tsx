import React from 'react';

interface ExternalLinkArrowProps {
  size?: number;
}

// Renders as a real vector path everywhere — unlike the Unicode "↗" character,
// which several mobile browsers substitute with an emoji-style glyph instead
// of a text glyph, making it look like a clashing icon rather than a typographic
// arrow.
const ExternalLinkArrow: React.FC<ExternalLinkArrowProps> = ({ size = 12 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17L17 7M17 7H8M17 7V16" />
  </svg>
);

export default ExternalLinkArrow;