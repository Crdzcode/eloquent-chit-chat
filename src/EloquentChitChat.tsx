import React, { useEffect, useState, useCallback, useMemo } from 'react';
import type { ChatMessage, ServiceStatus } from './types';
import './styles/styles.css';
import './styles/vars.css';
import { EloquentButton } from './components/shared/EloquentButton';
import { EloquentChatBox } from './components/EloquentChatBox';

export type EloquentChitChatProps = {
  title?: string;
  initialMessages?: ChatMessage[];
  llmClient: (params: { messages: ChatMessage[] }) => Promise<string>;
  messages?: ChatMessage[];
  status?: ServiceStatus;
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left';
}; 

export const EloquentChitChat: React.FC<EloquentChitChatProps> = ({
  title = 'Eloquent Chit Chat',
  initialMessages = [],
  llmClient,
  status,
  theme,
  position = 'bottom-right',
}) => {
  // Local Storage key for persisting chat history
  const STORAGE_KEY = 'ecc-chat-history';
  // Limit history to prevent excessive storage usage
  const MAX_MESSAGES = 10;

  // isOpen: tracks logical state (whether component exists in the UI or not)
  // isVisible: tracks DOM state (whether component is visible for animation purposes)
  // Split to enable smooth exit animations before unmounting
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // isThinking: controls loading state when waiting for LLM response; disables input
  const [isThinking, setIsThinking] = useState(false);
  const [internalMessages, setInternalMessages] = useState<ChatMessage[]>(() => {
    // Checks for existing chat history in localStorage on initial load
    // Falls back to initialMessages prop if none found
    // Prevents issues during server-side rendering by checking for window
    if (typeof window === 'undefined') return initialMessages;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return initialMessages;

      const parsed = JSON.parse(stored) as ChatMessage[];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialMessages;
    } catch (e) {
      console.error('Failed to parse stored chat history', e);
      return initialMessages;
    }
  });

  // Persist messages to localStorage whenever they change
  // Keeps history across browser sessions and page refreshes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const lastMessages = internalMessages.slice(-MAX_MESSAGES);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lastMessages));
    } catch (err) {
      console.error('[EloquentChitChat] Failed to save chat history to localStorage', err);
    }
  }, [internalMessages]);

  // Memoize theme CSS variables to avoid recalculating on every render
  // Only recomputes when theme prop changes
  const themeVars = useMemo(() => theme === 'dark'
    ? {
      '--ecc-bg': 'var(--ecc-dark-bg)',
      '--ecc-bg-secondary': 'var(--ecc-dark-bg-secondary)',
      '--ecc-surface': 'var(--ecc-dark-surface)',
      '--ecc-surface-alt': 'var(--ecc-dark-surface-alt)',
      '--ecc-text-bot': 'var(--ecc-dark-text-bot)',
      '--ecc-text-user': 'var(--ecc-dark-text-user)',
      '--ecc-text-muted': 'var(--ecc-dark-text-muted)',
      '--ecc-border': 'var(--ecc-dark-border)',
      '--ecc-online': 'var(--ecc-dark-online)',
      '--ecc-maintenance': 'var(--ecc-dark-maintenance)',
      '--ecc-offline': 'var(--ecc-dark-offline)',
      '--ecc-shadow': 'var(--ecc-dark-shadow)',
    }
    : {
      '--ecc-bg': 'var(--ecc-light-bg)',
      '--ecc-bg-secondary': 'var(--ecc-light-bg-secondary)',
      '--ecc-surface': 'var(--ecc-light-surface)',
      '--ecc-surface-alt': 'var(--ecc-light-surface-alt)',
      '--ecc-text-bot': 'var(--ecc-light-text-bot)',
      '--ecc-text-user': 'var(--ecc-light-text-user)',
      '--ecc-text-muted': 'var(--ecc-light-text-muted)',
      '--ecc-border': 'var(--ecc-light-border)',
      '--ecc-online': 'var(--ecc-light-online)',
      '--ecc-maintenance': 'var(--ecc-light-maintenance)',
      '--ecc-offline': 'var(--ecc-light-offline)',
      '--ecc-shadow': 'var(--ecc-light-shadow)',
    }, [theme]);

  // Memoized callbacks prevent unnecessary child re-renders when props are passed down
  // useCallback stabilizes function identity across renders
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setIsVisible(true);
  }, []);

  // Delays close to allow exit animation (200ms) before unmounting
  const handleClose = useCallback(() => {
    setIsVisible(false);

    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  }, []);

  // Toggle callback that is passed to button as a prop
  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [isOpen, handleClose, handleOpen]);

  // Callback to update messages state from child components
  // Wrapped in useCallback to stabilize identity for children
  const pushMessages = useCallback((next: ChatMessage[]) => {
    setInternalMessages(next);
  }, []);

  // Main message handler: validates status, calls LLM, updates state with response
  // Wrapped in useCallback with full dependency array to stabilize for child components
  const handleSend = useCallback(async (content: string) => {
    if (isThinking) return;

    if (status === 'maintenance' || status === 'offline') return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      role: 'user',
      content: content.trim(),
    };

    const withUser = [...internalMessages, userMessage];
    pushMessages(withUser);

    setIsThinking(true);

    try {
      const replyText = await llmClient({ messages: withUser });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID?.() ?? String(Date.now() + 1),
        role: 'assistant',
        content: replyText,
      };

      pushMessages([...withUser, assistantMessage]);
    } catch (e) {
      console.error(e);
      const errorMessage: ChatMessage = {
        id: String(Date.now() + 2),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again later.',
      };
      pushMessages([...withUser, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  }, [isThinking, status, internalMessages, llmClient, pushMessages]);

  return (
    <div
      className={`ecc-root ecc-root--${position}`}
      style={themeVars as React.CSSProperties}
      >
      {isOpen && (
        <EloquentChatBox
          title={title}
          messages={internalMessages}
          status={status ?? 'online'}
          onSendMessage={handleSend}
          isClosing={!isVisible}
          isThinking={isThinking}
        />
      )}

      <EloquentButton isOpen={isOpen} onToggle={handleToggle} />
    </div>
  );
};
