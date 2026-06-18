/**
 * OmniRouter - Core routing logic
 * Selects optimal AI models based on request characteristics
 */

import { RoutingRequest, RoutingDecision, ModelCategory, RouteMetadata, ModelDefinition } from '../types';
import { getModelsByCategory, getFallbackModel, getModelById } from '../models/registry';
import { analyzeRequest } from './analyzer';

// Category colors for UI
const CATEGORY_COLORS: Record<ModelCategory, string> = {
  fast: '#10b981',      // green
  coding: '#3b82f6',     // blue
  reasoning: '#8b5cf6',  // purple
  'long-context': '#f59e0b' // amber
};

// Category badges for UI
const CATEGORY_BADGES: Record<ModelCategory, string> = {
  fast: 'FAST',
  coding: 'CODE',
  reasoning: 'REASON',
  'long-context': 'LONG'
};

// Category icons for UI
const CATEGORY_ICONS: Record<ModelCategory, string> = {
  fast: 'zap',
  coding: 'code',
  reasoning: 'brain',
  'long-context': 'file-text'
};

export class OmniRouter {
  private defaultModels: Record<ModelCategory, string> = {
    fast: 'fast-claude-haiku',
    coding: 'coding-claude-sonnet',
    reasoning: 'reasoning-claude-opus',
    'long-context': 'long-context-claude'
  };

  /**
   * Route a request to the optimal model
   */
  route(request: RoutingRequest): RoutingDecision {
    const metadata = analyzeRequest(request);
    const { category, primaryModel, fallbackModel, reason } = this.determineRoute(metadata, request);

    return {
      selected_model: primaryModel.id,
      category,
      reason,
      fallback_model: fallbackModel?.id || null,
      metadata,
      ui: {
        color: CATEGORY_COLORS[category],
        badge: CATEGORY_BADGES[category],
        icon: CATEGORY_ICONS[category],
        debug: reason
      }
    };
  }

  /**
   * Determine the best route based on metadata and request context
   */
  private determineRoute(
    metadata: RouteMetadata,
    request: RoutingRequest
  ): { category: ModelCategory; primaryModel: ModelDefinition; fallbackModel?: ModelDefinition; reason: string } {

    // Rule 5 - Cost Sensitivity: Prefer Fast Models
    if (metadata.cost_mode === 'cost-sensitive') {
      const models = getModelsByCategory('fast');
      const primary = models[0];
      return {
        category: 'fast',
        primaryModel: primary,
        reason: 'Cost-sensitive mode: selected fast, low-cost model'
      };
    }

    // Rule 6 - Latency Sensitivity: Prefer Fast Models
    if (metadata.latency_mode === 'low-latency') {
      const models = getModelsByCategory('fast');
      const primary = models.find(m => m.latency_profile === 'fast') || models[0];
      return {
        category: 'fast',
        primaryModel: primary,
        reason: 'Low-latency mode: selected fast-response model'
      };
    }

    // Rule 2 - Coding Tasks
    if (metadata.task_type === 'code') {
      const models = getModelsByCategory('coding');
      const primaryModel = models[0];
      const fallbackModel = getFallbackModel('coding', primaryModel.id);
      return {
        category: 'coding',
        primaryModel: primaryModel,
        fallbackModel: fallbackModel,
        reason: 'Coding task detected: routed to specialized coding model'
      };
    }

    // Rule 4 - Long Context (check before reasoning since complexity can trigger both)
    if (metadata.task_type === 'rag') {
      const models = getModelsByCategory('long-context');
      const primaryModel = models[0];
      const fallbackModel = getFallbackModel('long-context', primaryModel.id);
      return {
        category: 'long-context',
        primaryModel: primaryModel,
        fallbackModel: fallbackModel,
        reason: 'RAG task detected: routed to long-context model'
      };
    }

    // Rule 3 - Complex Reasoning
    if (metadata.task_type === 'reasoning' || metadata.complexity === 'high') {
      const models = getModelsByCategory('reasoning');
      const primaryModel = models[0];
      const fallbackModel = getFallbackModel('reasoning', primaryModel.id);
      return {
        category: 'reasoning',
        primaryModel: primaryModel,
        fallbackModel: fallbackModel,
        reason: 'High complexity or reasoning task: routed to advanced reasoning model'
      };
    }

    // Rule 1 - Simple Tasks
    if (metadata.complexity === 'low' && metadata.context_length < 200) {
      const models = getModelsByCategory('fast');
      const primaryModel = models[0];
      return {
        category: 'fast',
        primaryModel: primaryModel,
        reason: 'Simple task with low complexity: routed to fast model'
      };
    }

    // Default fallback for medium complexity
    const primaryModel = getModelsByCategory('coding')[0];
    return {
      category: 'coding',
      primaryModel: primaryModel,
      reason: 'Medium complexity task: routed to balanced coding model'
    };
  }

  /**
   * Get routing decision for a specific model override
   */
  routeWithOverride(request: RoutingRequest, preferredModel: string): RoutingDecision {
    const metadata = analyzeRequest(request);
    const models = getModelsByCategory('fast'); // Will find the right one
    const primaryModel = getModelById(preferredModel);

    if (!primaryModel) {
      throw new Error(`Model ${preferredModel} not found in registry`);
    }

    const fallback = getFallbackModel(primaryModel.category, primaryModel.id);

    return {
      selected_model: primaryModel.id,
      category: primaryModel.category,
      reason: `Manual override: ${preferredModel} selected`,
      fallback_model: fallback?.id || null,
      metadata,
      ui: {
        color: CATEGORY_COLORS[primaryModel.category],
        badge: CATEGORY_BADGES[primaryModel.category],
        icon: CATEGORY_ICONS[primaryModel.category],
        debug: `Manual routing override to ${primaryModel.name}`
      }
    };
  }
}

// Export singleton instance
export const omniRouter = new OmniRouter();

// Helper function
export function routeRequest(request: RoutingRequest): RoutingDecision {
  return omniRouter.route(request);
}