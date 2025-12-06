import React from 'react';

export type EloquentStatusDotProps = {
  color?: string;
  size?: number;
} & React.SVGProps<SVGSVGElement>;

const EloquentStatusDotComponent: React.FC<EloquentStatusDotProps> = ({
  color = '#22c55e',
  size = 10
}) => {
  // Calculate radius for SVG circle
  const radius = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      focusable="false"
      style={{alignSelf: 'center'}}
    >
      <circle cx={radius} cy={radius} r={radius} fill={color} />
    </svg>
  );
};

// Memoize SVG component to prevent re-renders on parent updates
// Status dot is a pure presentational component that rarely changes
export const EloquentStatusDot = React.memo(EloquentStatusDotComponent);
