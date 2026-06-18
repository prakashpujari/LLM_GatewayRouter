import React from 'react';
import { RoutingDecision, ModelCategory } from '../../types';

interface ModelSelectorProps {
  decision: RoutingDecision;
  onModelChange?: (modelId: string) => void;
}

const CATEGORY_LABELS: Record<ModelCategory, string> = {
  fast: 'Fast/Low-Cost',
  coding: 'Coding/Technical',
  reasoning: 'Advanced Reasoning',
  'long-context': 'Long-Context'
};

export const ModelSelector: React.FC<ModelSelectorProps> = ({ decision, onModelChange }) => {
  return (
    <div className="omni-router-model-selector" data-testid="model-selector">
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Selected Model:</strong> {decision.selected_model}
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Category:</strong> {CATEGORY_LABELS[decision.category]}
      </div>
      {decision.fallback_model && onModelChange && (
        <button
          onClick={() => onModelChange(decision.fallback_model!)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
          }}
          data-testid="use-fallback-button"
        >
          Use Fallback: {decision.fallback_model}
        </button>
      )}
    </div>
  );
};