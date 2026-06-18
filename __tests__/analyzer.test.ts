import { analyzeRequest } from '../src/router/analyzer';
import { RoutingRequest } from '../src/types';

describe('analyzeRequest', () => {
  it('should detect coding keywords and set task type', () => {
    const request: RoutingRequest = {
      prompt: 'How to create a function in TypeScript with async/await?',
    };

    const metadata = analyzeRequest(request);

    expect(metadata.task_type).toBe('code');
    expect(metadata.detected_keywords).toContain('function');
    expect(metadata.detected_keywords).toContain('typescript');
    expect(metadata.detected_keywords).toContain('async');
  });

  it('should detect reasoning keywords', () => {
    const request: RoutingRequest = {
      prompt: 'Analyze and compare the implications of this decision',
    };

    const metadata = analyzeRequest(request);

    expect(metadata.task_type).toBe('reasoning');
    expect(metadata.detected_keywords).toContain('analyze');
    expect(metadata.detected_keywords).toContain('compare');
  });

  it('should detect RAG keywords', () => {
    const request: RoutingRequest = {
      prompt: 'Based on the document content, extract key information and analyze the provided files',
    };

    const metadata = analyzeRequest(request);

    expect(metadata.detected_keywords).toContain('document');
    expect(metadata.detected_keywords).toContain('extract');
  });

  it('should set low complexity for short prompts', () => {
    const request: RoutingRequest = {
      prompt: 'Hi',
    };

    const metadata = analyzeRequest(request);

    expect(metadata.complexity).toBe('low');
  });

  it('should set high complexity for long prompts', () => {
    const request: RoutingRequest = {
      prompt: 'A'.repeat(600),
    };

    const metadata = analyzeRequest(request);

    expect(metadata.complexity).toBe('high');
  });

  it('should respect latency_sensitive flag', () => {
    const request: RoutingRequest = {
      prompt: 'Quick question',
      latency_sensitive: true,
    };

    const metadata = analyzeRequest(request);

    expect(metadata.latency_mode).toBe('low-latency');
  });

  it('should respect cost_sensitive flag', () => {
    const request: RoutingRequest = {
      prompt: 'Question',
      cost_sensitive: true,
    };

    const metadata = analyzeRequest(request);

    expect(metadata.cost_mode).toBe('cost-sensitive');
  });

  it('should calculate token estimate', () => {
    const request: RoutingRequest = {
      prompt: 'This is a test prompt',
    };

    const metadata = analyzeRequest(request);

    expect(metadata.token_estimate).toBeGreaterThan(0);
    // "This is a test prompt" = 22 chars, ceil(22/4) = 6
    expect(metadata.token_estimate).toBe(6);
  });

  it('should use provided context_length', () => {
    const request: RoutingRequest = {
      prompt: 'Short prompt',
      context_length: 50000,
    };

    const metadata = analyzeRequest(request);

    expect(metadata.context_length).toBe(50000);
  });

  it('should detect summary task type', () => {
    const request: RoutingRequest = {
      prompt: 'Please summarize this document for me',
    };

    const metadata = analyzeRequest(request);

    expect(metadata.task_type).toBe('summary');
  });
});