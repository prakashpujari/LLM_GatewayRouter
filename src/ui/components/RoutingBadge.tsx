import React from 'react';
import { RoutingDecision } from '../../types';

interface RoutingBadgeProps {
  decision: RoutingDecision;
}

export const RoutingBadge: React.FC<RoutingBadgeProps> = ({ decision }) => {
  const { ui, selected_model, fallback_model } = decision;

  return (
    <div className="omni-router-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span
        className={`badge badge-${ui.badge.toLowerCase()}`}
        style={{
          backgroundColor: ui.color,
          color: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem',
          fontSize: '0.75rem',
          fontWeight: 'bold',
        }}
        data-testid="routing-badge"
      >
        {ui.badge}
      </span>
      <span style={{ fontSize: '0.875rem', color: '#666' }}>
        {selected_model}
      </span>
      {fallback_model && (
        <span
          title={`Fallback: ${fallback_model}`}
          style={{ fontSize: '0.75rem', color: '#999' }}
          data-testid="fallback-indicator"
        >
          ⚡ Fallback: {fallback_model}
        </span>
      )}
    </div>
  );
};