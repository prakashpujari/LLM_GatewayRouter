/**
 * Request Analyzer - Analyzes prompts for routing decisions
 * Detects intent, complexity, keywords, and task type
 */

import { RoutingRequest, TaskType, ComplexityLevel, RouteMetadata } from '../types';

// Programming keywords for coding detection
const CODING_KEYWORDS = [
  'function', 'class', 'const', 'let', 'var', 'import', 'export',
  'async', 'await', 'promise', 'typescript', 'javascript', 'python',
  'java', 'csharp', 'go', 'rust', 'debug', 'error', 'exception',
  'api', 'endpoint', 'request', 'response', 'http', 'fetch',
  'react', 'vue', 'angular', 'node', 'express', 'sql', 'database',
  'code', 'refactor', 'optimize', 'algorithm', 'data structure'
];

// Reasoning keywords for complex tasks
const REASONING_KEYWORDS = [
  'analyze', 'compare', 'evaluate', 'assess', 'reason', 'logic',
  'why', 'because', 'therefore', 'conclusion', 'implication',
  'multi-step', 'step-by-step', 'plan', 'strategy', 'framework',
  'architecture', 'design', 'complex', 'multiple factors'
];

// RAG/document keywords
const RAG_KEYWORDS = [
  'document', 'pdf', 'text', 'file', 'content', 'extract',
  'summarize', 'summary', 'context', 'knowledge base', 'search',
  'find in', 'based on', 'according to'
];

export function analyzeRequest(request: RoutingRequest): RouteMetadata {
  const prompt = request.prompt.toLowerCase();
  const words = prompt.split(/\s+/);
  const detectedKeywords: string[] = [];

  // Detect coding keywords
  const codingMatches = CODING_KEYWORDS.filter(kw => prompt.includes(kw));
  if (codingMatches.length > 0) detectedKeywords.push(...codingMatches);

  // Detect reasoning keywords
  const reasoningMatches = REASONING_KEYWORDS.filter(kw => prompt.includes(kw));
  if (reasoningMatches.length > 0) detectedKeywords.push(...reasoningMatches);

  // Detect RAG keywords
  const ragMatches = RAG_KEYWORDS.filter(kw => prompt.includes(kw));
  if (ragMatches.length > 0) detectedKeywords.push(...ragMatches);

  // Determine task type
  let taskType: TaskType = request.task_hint ?? 'chat';

  // If task_hint was NOT provided, auto-detect based on keywords
  if (taskType === 'chat') {
    if (codingMatches.length > 0) {
      taskType = 'code';
    } else if (ragMatches.length > 0 && prompt.length > 100) {
      taskType = 'rag';
    } else if (reasoningMatches.length > 2) {
      taskType = 'reasoning';
    } else if (prompt.includes('summarize') || prompt.includes('summary')) {
      taskType = 'summary';
    } else if (detectedKeywords.length > 0) {
      taskType = 'analysis';
    }
  }

  // Determine complexity
  const promptLength = request.prompt.length;
  const keywordCount = detectedKeywords.length;

  let complexity: ComplexityLevel = 'low';

  if (promptLength > 500 || keywordCount > 3) {
    complexity = 'high';
  } else if (promptLength > 200 || keywordCount > 1) {
    complexity = 'medium';
  }

  // Override for simple/short requests
  if (promptLength < 80) {
    complexity = 'low';
  }

  return {
    complexity,
    task_type: taskType,
    context_length: request.context_length ?? promptLength,
    latency_mode: request.latency_sensitive ? 'low-latency' : 'normal',
    cost_mode: request.cost_sensitive ? 'cost-sensitive' : 'normal',
    token_estimate: Math.ceil(promptLength / 4), // Rough estimate
    detected_keywords: [...new Set(detectedKeywords)] // Deduplicate
  };
}