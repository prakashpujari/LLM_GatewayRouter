import React from 'react';
import { render, screen } from '@testing-library/react';
import { DebugPanel } from '../../src/ui/components/DebugPanel';
import { RoutingDecision } from '../../src/types';

const mockDecision: RoutingDecision = {
  selected_model: 'reasoning-claude-opus',
  category: 'reasoning',
  reason: 'High complexity task: routed to advanced reasoning model',
  fallback_model: 'reasoning-gpt-4',
  metadata: {
    complexity: 'high',
    task_type: 'reasoning',
    context_length: 5000,
    latency_mode: 'normal',
    cost_mode: 'normal',
    token_estimate: 1250,
    detected_keywords: ['analyze', 'compare', 'reasoning'],
  },
  ui: {
    color: '#8b5cf6',
    badge: 'REASON',
    icon: 'brain',
    debug: 'High complexity task',
  },
};

describe('DebugPanel', () => {
  it('should render debug information', () => {
    render(<DebugPanel decision={mockDecision} />);

    expect(screen.getByTestId('debug-panel')).toBeInTheDocument();
    expect(screen.getByText('Routing Debug')).toBeInTheDocument();
  });

  it('should display all metadata fields', () => {
    render(<DebugPanel decision={mockDecision} />);

    expect(screen.getByText('Complexity:')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument(); // complexity
    expect(screen.getByText('Task Type:')).toBeInTheDocument();
    expect(screen.getByText('reasoning')).toBeInTheDocument(); // task type
    expect(screen.getByText(/5,000/)).toBeInTheDocument(); // context length

    // Check specific instances to avoid ambiguity
    const latencyModeLabel = screen.getByText('Latency Mode:');
    expect(latencyModeLabel).toBeInTheDocument();
    expect(screen.getByText('Cost Mode:')).toBeInTheDocument();
  });

  it('should show detected keywords when present', () => {
    render(<DebugPanel decision={mockDecision} />);

    expect(screen.getByText(/analyze, compare, reasoning/)).toBeInTheDocument();
  });

  it('should show token estimate when present', () => {
    render(<DebugPanel decision={mockDecision} />);

    expect(screen.getByText(/1,250/)).toBeInTheDocument();
  });

  it('should display debug explanation', () => {
    render(<DebugPanel decision={mockDecision} />);

    expect(screen.getByText(/High complexity task/)).toBeInTheDocument();
  });
});