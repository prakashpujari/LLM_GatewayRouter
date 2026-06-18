import React from 'react';
import { render, screen } from '@testing-library/react';
import { RoutingBadge } from '../../src/ui/components/RoutingBadge';
import { RoutingDecision } from '../../src/types';

const mockDecision: RoutingDecision = {
  selected_model: 'coding-claude-sonnet',
  category: 'coding',
  reason: 'Coding task detected: routed to specialized coding model',
  fallback_model: 'coding-gpt-4',
  metadata: {
    complexity: 'medium',
    task_type: 'code',
    context_length: 150,
    latency_mode: 'normal',
    cost_mode: 'normal',
  },
  ui: {
    color: '#3b82f6',
    badge: 'CODE',
    icon: 'code',
    debug: 'Coding task detected',
  },
};

describe('RoutingBadge', () => {
  it('should render the badge with correct category', () => {
    render(<RoutingBadge decision={mockDecision} />);

    const badge = screen.getByTestId('routing-badge');
    expect(badge).toHaveTextContent('CODE');
    expect(badge).toHaveStyle({ backgroundColor: '#3b82f6' });
  });

  it('should display the selected model', () => {
    render(<RoutingBadge decision={mockDecision} />);

    expect(screen.getByText('coding-claude-sonnet')).toBeInTheDocument();
  });

  it('should show fallback indicator when fallback model exists', () => {
    render(<RoutingBadge decision={mockDecision} />);

    expect(screen.getByTestId('fallback-indicator')).toHaveTextContent('coding-gpt-4');
  });

  it('should not show fallback indicator when no fallback', () => {
    const noFallbackDecision: RoutingDecision = {
      ...mockDecision,
      fallback_model: null,
    };

    render(<RoutingBadge decision={noFallbackDecision} />);

    expect(screen.queryByTestId('fallback-indicator')).not.toBeInTheDocument();
  });
});