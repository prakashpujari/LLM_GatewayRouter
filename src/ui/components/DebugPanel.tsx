import React from 'react';
import { RoutingDecision } from '../../types';

interface DebugPanelProps {
  decision: RoutingDecision;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ decision }) => {
  const { metadata, ui } = decision;

  return (
    <div
      className="omni-router-debug-panel"
      style={{
        backgroundColor: '#f5f5f5',
        padding: '1rem',
        borderRadius: '0.5rem',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
      }}
      data-testid="debug-panel"
    >
      <h4 style={{ margin: '0 0 0.5rem 0' }}>Routing Debug</h4>
      <div style={{ display: 'grid', gap: '0.25rem' }}>
        <div>
          <strong>Complexity:</strong> {metadata.complexity}
        </div>
        <div>
          <strong>Task Type:</strong> {metadata.task_type}
        </div>
        <div>
          <strong>Context Length:</strong> {metadata.context_length.toLocaleString()} chars
        </div>
        <div>
          <strong>Latency Mode:</strong> {metadata.latency_mode}
        </div>
        <div>
          <strong>Cost Mode:</strong> {metadata.cost_mode}
        </div>
        {metadata.token_estimate && (
          <div>
            <strong>Token Estimate:</strong> {metadata.token_estimate.toLocaleString()}
          </div>
        )}
        {metadata.detected_keywords && metadata.detected_keywords.length > 0 && (
          <div>
            <strong>Detected Keywords:</strong> {metadata.detected_keywords.join(', ')}
          </div>
        )}
        <div style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
          {ui.debug}
        </div>
      </div>
    </div>
  );
};