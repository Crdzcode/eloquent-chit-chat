import React from 'react';
import { EloquentLogo } from '../icons/EloquentLogo';
import '../../styles/components/eloquent_button.css';

type EloquentButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const EloquentButtonComponent: React.FC<EloquentButtonProps> = ({
  isOpen,
  onToggle,
}) => {
  return (
    <button
      type="button"
      className="ecc-toggle"
      onClick={onToggle}
      // Dynamic label for accessibility: informs screen readers of current state
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <EloquentLogo width={40} height={32}/>
    </button>
  );
};

// Memoize pure button component to prevent unnecessary re-renders
// Toggle button doesn't need to update unless isOpen or onToggle actually change
export const EloquentButton = React.memo(EloquentButtonComponent);
