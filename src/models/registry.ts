/**
 * Model Registry - Provider-agnostic model definitions
 * In production, this would be loaded from configuration
 */

import { ModelCategory, ModelDefinition } from '../types';

export const MODEL_REGISTRY: ModelDefinition[] = [
  // Fast / Low-Cost Models
  {
    id: 'fast-gpt-3.5',
    name: 'GPT-3.5 Turbo',
    category: 'fast',
    provider: 'openai',
    capabilities: ['chat', 'summarization', 'simple-qa'],
    context_window: 16385,
    cost_per_1k_tokens: { input: 0.0015, output: 0.002 },
    latency_profile: 'fast'
  },
  {
    id: 'fast-claude-haiku',
    name: 'Claude Haiku',
    category: 'fast',
    provider: 'anthropic',
    capabilities: ['chat', 'summarization', 'speed'],
    context_window: 200000,
    cost_per_1k_tokens: { input: 0.00025, output: 0.00125 },
    latency_profile: 'fast'
  },

  // Coding / Technical Models
  {
    id: 'coding-gpt-4',
    name: 'GPT-4 Turbo',
    category: 'coding',
    provider: 'openai',
    capabilities: ['code-generation', 'debugging', 'api-design'],
    context_window: 128000,
    cost_per_1k_tokens: { input: 0.01, output: 0.03 },
    latency_profile: 'moderate'
  },
  {
    id: 'coding-claude-sonnet',
    name: 'Claude Sonnet',
    category: 'coding',
    provider: 'anthropic',
    capabilities: ['code-generation', 'debugging', 'refactoring'],
    context_window: 200000,
    cost_per_1k_tokens: { input: 0.003, output: 0.015 },
    latency_profile: 'moderate'
  },

  // Advanced Reasoning Models
  {
    id: 'reasoning-claude-opus',
    name: 'Claude Opus',
    category: 'reasoning',
    provider: 'anthropic',
    capabilities: ['multi-step-reasoning', 'planning', 'high-accuracy'],
    context_window: 200000,
    cost_per_1k_tokens: { input: 0.015, output: 0.075 },
    latency_profile: 'slow'
  },
  {
    id: 'reasoning-gpt-4',
    name: 'GPT-4',
    category: 'reasoning',
    provider: 'openai',
    capabilities: ['complex-reasoning', 'analysis', 'planning'],
    context_window: 32768,
    cost_per_1k_tokens: { input: 0.03, output: 0.06 },
    latency_profile: 'slow'
  },

  // Long-Context Models
  {
    id: 'long-context-claude',
    name: 'Claude Long-Context',
    category: 'long-context',
    provider: 'anthropic',
    capabilities: ['document-processing', 'rag', 'multi-file-analysis'],
    context_window: 200000,
    cost_per_1k_tokens: { input: 0.003, output: 0.015 },
    latency_profile: 'moderate'
  },
  {
    id: 'long-context-gpt-4-turbo',
    name: 'GPT-4 Turbo (128K)',
    category: 'long-context',
    provider: 'openai',
    capabilities: ['large-context', 'rag', 'analysis'],
    context_window: 128000,
    cost_per_1k_tokens: { input: 0.01, output: 0.03 },
    latency_profile: 'moderate'
  }
];

// Get models by category
export function getModelsByCategory(category: ModelCategory): ModelDefinition[] {
  return MODEL_REGISTRY.filter(model => model.category === category);
}

// Get fallback model for a category
export function getFallbackModel(category: ModelCategory, excludeId?: string): ModelDefinition | undefined {
  const models = MODEL_REGISTRY.filter(m => m.category === category && m.id !== excludeId);
  return models[1] || models[0]; // Return second or first as fallback
}

// Get model by ID
export function getModelById(id: string): ModelDefinition | undefined {
  return MODEL_REGISTRY.find(model => model.id === id);
}