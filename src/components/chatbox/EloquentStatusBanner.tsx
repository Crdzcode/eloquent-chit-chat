import React, { useMemo } from 'react';
import type { ServiceStatus } from '../../types';
import { EloquentStatusDot } from '../shared/EloquentStatusDot';
import '../../styles/components/eloquent_status_banner.css';

type EloquentStatusBannerProps = {
  status: ServiceStatus;
};

const EloquentStatusBannerComponent: React.FC<EloquentStatusBannerProps> = ({ status }) => {
  const getStatusConfig = (status: ServiceStatus) => {
    switch (status) {
      case 'maintenance':
        return {
          title: 'Assistant under maintenance',
          description: 'The assistant is temporarily unavailable. Please try again later.',
          color: 'var(--ecc-maintenance)',
        };
      case 'offline':
        return {
          title: 'Assistant offline',
          description: 'The assistant is currently offline. Please try again soon.',
          color: 'var(--ecc-offline)',
        };
      default:
        return null;
    }
  };

  // Memoize status config to avoid recalculating message text on every render
  // Only recomputes when status prop changes
  const config = useMemo(() => getStatusConfig(status), [status]);
  if (!config) return null;

  return (
    <div className="ecc-status-banner" role="status" aria-live="polite">
      <EloquentStatusDot size={12} color={config.color} />
      <div className="ecc-status-banner__content">
        <span className="ecc-status-banner__title">{config.title}</span>
        <span className="ecc-status-banner__description">{config.description}</span>
      </div>
    </div>
  );
};

// Memoize pure status component to prevent unnecessary re-renders
// Status banner only updates when service status actually changes
export const EloquentStatusBanner = React.memo(EloquentStatusBannerComponent);
