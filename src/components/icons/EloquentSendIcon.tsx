import React from 'react';

const EloquentSendIconComponent: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Send/upload arrow icon path */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 3L5 10.5L6.4 11.9L11 7.3V21H13V7.3L17.6 11.9L19 10.5L12 3Z"
      fill="var(--ecc-bg-secondary)"
    />
  </svg>
);

// Memoize SVG icon component to prevent re-renders on parent updates
// Send button icon is a pure presentational element
export const EloquentSendIcon = React.memo(EloquentSendIconComponent);
