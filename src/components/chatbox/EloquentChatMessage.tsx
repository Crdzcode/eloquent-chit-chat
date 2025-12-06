import React, { useMemo } from 'react';

import '../../styles/components/eloquent_message.css';
import { EloquentLogo } from '../icons/EloquentLogo';

type EloquentChatMessageProps = {
    content: React.ReactNode;
    isAssistant: boolean;
    className?: string;
};

const EloquentChatMessageComponent: React.FC<EloquentChatMessageProps> = ({
    content,
    isAssistant = false,
    className,
}) => {
    // Memoize CSS class name to prevent unnecessary string concatenation
    // Only changes when isAssistant prop changes
    const roleClass = useMemo(() => isAssistant ? 'ecc-message--assistant' : 'ecc-message--user', [isAssistant]);

    return (
        <div className={`ecc-message-container ${roleClass}`}>
            {isAssistant && (
                <div className="ecc-message-logo-bubble">
                    <EloquentLogo width={20} height={12} />
                </div>
            )}

            <div className={`ecc-message ${roleClass} ${className ?? ''}`}>
                <div className="ecc-bubble">
                    {content}
                </div>
            </div>
        </div>
    );
};

// Memoize pure message component to prevent re-render on parent updates
// Content and role rarely change after initial render
export const EloquentChatMessage = React.memo(EloquentChatMessageComponent);
