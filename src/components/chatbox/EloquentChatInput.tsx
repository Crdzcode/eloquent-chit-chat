import React, { useCallback, useState } from 'react';
import '../../styles/components/eloquent_chat_input.css';
import { EloquentSendIcon } from '../icons/EloquentSendIcon';

type EloquentChatInputProps = {
  disabled?: boolean;
  onSend: (value: string) => void;
  thinking?: boolean;
};

const EloquentChatInputComponent: React.FC<EloquentChatInputProps> = ({
  disabled = false,
  onSend,
  thinking = false,
}) => {
  const [value, setValue] = useState('');

  // Memoize submit handler to stabilize for child event listeners
  // Prevents unnecessary re-binding on every render
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  }, [disabled, value, onSend]);

  // Memoize keyboard handler to stabilize function identity
  // Used as event listener callback
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit(e);
  }, [handleSubmit]);

  return (
    <form className="ecc-input-wrapper" onSubmit={handleSubmit}>
      <input
        className="ecc-input"
        type="text"
        placeholder={disabled ? 'Service temporarily unavailable' : thinking ? 'Awaiting response...' : 'Type a message...'}
        value={value}
        disabled={disabled || thinking}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="submit"
        className="ecc-send-button"
        disabled={disabled || !value.trim() || thinking}
        aria-label="Send message"
      >
        <EloquentSendIcon width={18} height={18} />
      </button>
    </form>
  );
};

// Memoize to prevent re-render when parent changes but props stay the same
// Input field and button are pure components that don't need frequent updates
export const EloquentChatInput = React.memo(EloquentChatInputComponent);
