import React from "react";

const EloquentLogoComponent: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Main brand logo SVG path */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.9566 9.56526C16.5355 9.56526 11.4783 14.74 11.4783 21.0435C11.4783 28.4955 17.4175 34.4348 24.8697 34.4348V42.087C13.1913 42.087 3.82617 32.7217 3.82617 21.0435C3.82617 10.5708 12.2526 1.91309 22.9566 1.91309C32.7448 1.91309 40.174 9.40075 40.174 19.1305C40.174 27.7081 33.4378 34.4348 24.8697 34.4348V26.7827C29.2145 26.7827 32.5218 23.479 32.5218 19.1305C32.5218 13.6109 28.5026 9.56526 22.9566 9.56526Z"
      fill="#8944ff"
    />
  </svg>
);

// Memoize SVG component to prevent re-renders on parent updates
// Logo is a pure presentational icon that never changes
export const EloquentLogo = React.memo(EloquentLogoComponent);
