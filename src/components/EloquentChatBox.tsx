import React, { useEffect, useRef, useMemo } from 'react';
import type { ChatMessage, ServiceStatus } from '../types';
import '../styles/components/eloquent_chatbox.css';
import { EloquentLogo } from './icons/EloquentLogo';
import { EloquentStatusDot } from './shared/EloquentStatusDot';
import { EloquentChatMessage } from './chatbox/EloquentChatMessage';
import { EloquentChatInput } from './chatbox/EloquentChatInput';
import { EloquentStatusBanner } from './chatbox/EloquentStatusBanner';

type EloquentChatBoxProps = {
  title: string;
  messages: ChatMessage[];
  status: ServiceStatus;
  onSendMessage: (content: string) => void;
  isClosing?: boolean;
  isThinking?: boolean;
};

const EloquentChatBoxComponent: React.FC<EloquentChatBoxProps> = ({
  title,
  messages,
  status,
  onSendMessage,
  isClosing = false,
  isThinking = false,
}) => {
  // Check if chat service is restricted (maintenance/offline)
  const isRestricted = status === 'maintenance' || status === 'offline';
  
  // Memoize status color to avoid recalculation on every render
  // Only changes when status prop changes
  const statusDotColor = useMemo(() => {
    switch (status) {
      case 'maintenance':
        return 'var(--ecc-maintenance)';
      case 'offline':
        return 'var(--ecc-offline)';
      default:
        return 'var(--ecc-online)';
    }
  }, [status]);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when new messages arrive
  // Improves UX by keeping latest message visible
  useEffect(() => {
    const el = messagesRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, status]);

  // Memoize message list rendering to prevent re-creating on every parent render
  // Only recalculates when messages array changes
  const renderedMessages = useMemo(() => messages.map((m) => (
    <EloquentChatMessage
      key={m.id}
      content={m.content}
      isAssistant={m.role === 'assistant'}
    />
  )), [messages]);

  return (
    <div className={`ecc-window ${isClosing ? 'ecc-window--closing' : 'ecc-window--opening'}`}>
      <header className="ecc-header">
        <div style={{ display: 'flex' }}>
          <EloquentLogo width={24} height={24} style={{ alignSelf: 'center' }} />
          <h1 className="ecc-title">{title}</h1>
        </div>
        <EloquentStatusDot size={12} color={statusDotColor} />
      </header>

      <div className="ecc-messages" ref={messagesRef}>
        {isRestricted ? (
          <EloquentStatusBanner status={status} />
        ) : (
          renderedMessages
        )}

        {isThinking && (
          <div className="ecc-typing-wrapper">
            <div className="ecc-typing-bubble">
              <span className="ecc-typing-dot" />
              <span className="ecc-typing-dot" />
              <span className="ecc-typing-dot" />
            </div>
          </div>
        )}
      </div>

      <footer className="ecc-footer">
        <EloquentChatInput
          thinking={isThinking}
          disabled={isRestricted}
          onSend={onSendMessage}
        />
      </footer>
    </div>
  );
};

// Wrap with React.memo to prevent re-renders when parent changes
// Only re-renders if props (title, messages, status, etc.) actually change
export const EloquentChatBox = React.memo(EloquentChatBoxComponent);
