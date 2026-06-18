import { omniRouter, routeRequest } from '../src';
import { RoutingRequest } from '../src/types';

describe('OmniRouter', () => {
  describe('route', () => {
    it('should route simple requests to fast models', () => {
      const request: RoutingRequest = {
        prompt: 'What is the weather today?',
      };

      const decision = omniRouter.route(request);

      expect(decision.category).toBe('fast');
      expect(decision.selected_model).toBe('fast-gpt-3.5'); // First model in fast category
      expect(decision.fallback_model).toBeNull();
      expect(decision.reason).toContain('low complexity');
    });

    it('should route coding requests to coding models', () => {
      const request: RoutingRequest = {
        prompt: 'How do I create a React component with TypeScript that fetches data using async/await?',
      };

      const decision = omniRouter.route(request);

      expect(decision.category).toBe('coding');
      expect(decision.selected_model).toBe('coding-gpt-4'); // First model in coding category
      expect(decision.fallback_model).toBe('coding-claude-sonnet');
      expect(decision.reason).toContain('Coding task detected');
    });

    it('should route complex reasoning requests to reasoning models', () => {
      const request: RoutingRequest = {
        prompt: 'Analyze the implications of quantum computing on blockchain cryptography and propose a multi-step framework for migration',
      };

      const decision = omniRouter.route(request);

      expect(decision.category).toBe('reasoning');
      expect(decision.selected_model).toBe('reasoning-claude-opus');
    });

    it('should respect cost-sensitive mode', () => {
      const request: RoutingRequest = {
        prompt: 'Write a complex algorithm for distributed systems',
        cost_sensitive: true,
      };

      const decision = omniRouter.route(request);

      expect(decision.category).toBe('fast');
      expect(decision.reason).toContain('Cost-sensitive');
    });

    it('should respect latency-sensitive mode', () => {
      const request: RoutingRequest = {
        prompt: 'Debug this Python error in my API endpoint',
        latency_sensitive: true,
      };

      const decision = omniRouter.route(request);

      expect(decision.category).toBe('fast');
      expect(decision.reason).toContain('Low-latency');
    });

    it('should route RAG requests to long-context models', () => {
      const request: RoutingRequest = {
        prompt: 'Based on the provided document, summarize the key findings from the long context document for analysis',
        task_hint: 'rag',
      };

      const decision = omniRouter.route(request);

      expect(decision.category).toBe('long-context');
      expect(decision.selected_model).toBe('long-context-claude');
    });

    it('should provide UI metadata with valid color and icon', () => {
      const request: RoutingRequest = {
        prompt: 'Create a function',
      };

      const decision = omniRouter.route(request);

      expect(decision.ui.color).toMatch(/^#[0-9a-f]{6}$/);
      expect(decision.ui.badge).toBeDefined();
      expect(decision.ui.icon).toBeDefined();
    });

    it('should provide deterministic results for same input', () => {
      const request: RoutingRequest = {
        prompt: 'Write a React hook',
      };

      const decision1 = omniRouter.route(request);
      const decision2 = omniRouter.route(request);

      expect(decision1.selected_model).toBe(decision2.selected_model);
      expect(decision1.category).toBe(decision2.category);
    });
  });

  describe('routeWithOverride', () => {
    it('should route to specified model when override is provided', () => {
      const request: RoutingRequest = {
        prompt: 'Simple question',
      };

      const decision = omniRouter.routeWithOverride(request, 'reasoning-claude-opus');

      expect(decision.selected_model).toBe('reasoning-claude-opus');
      expect(decision.category).toBe('reasoning');
    });

    it('should throw error for invalid model id', () => {
      const request: RoutingRequest = {
        prompt: 'Simple question',
      };

      expect(() => omniRouter.routeWithOverride(request, 'invalid-model')).toThrow(
        'Model invalid-model not found in registry'
      );
    });
  });
});

describe('routeRequest helper', () => {
  it('should route a request using the helper function', () => {
    const decision = routeRequest({ prompt: 'Hello world' });

    expect(decision.selected_model).toBe('fast-gpt-3.5');
    expect(decision.category).toBe('fast');
  });
});