"use strict";
/**
 * OmniRouter - Core routing logic
 * Selects optimal AI models based on request characteristics
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.omniRouter = exports.OmniRouter = void 0;
exports.routeRequest = routeRequest;
const registry_1 = require("../models/registry");
const analyzer_1 = require("./analyzer");
// Category colors for UI
const CATEGORY_COLORS = {
    fast: '#10b981', // green
    coding: '#3b82f6', // blue
    reasoning: '#8b5cf6', // purple
    'long-context': '#f59e0b' // amber
};
// Category badges for UI
const CATEGORY_BADGES = {
    fast: 'FAST',
    coding: 'CODE',
    reasoning: 'REASON',
    'long-context': 'LONG'
};
// Category icons for UI
const CATEGORY_ICONS = {
    fast: 'zap',
    coding: 'code',
    reasoning: 'brain',
    'long-context': 'file-text'
};
class OmniRouter {
    defaultModels = {
        fast: 'fast-claude-haiku',
        coding: 'coding-claude-sonnet',
        reasoning: 'reasoning-claude-opus',
        'long-context': 'long-context-claude'
    };
    /**
     * Route a request to the optimal model
     */
    route(request) {
        const metadata = (0, analyzer_1.analyzeRequest)(request);
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
    determineRoute(metadata, request) {
        // Rule 5 - Cost Sensitivity: Prefer Fast Models
        if (metadata.cost_mode === 'cost-sensitive') {
            const models = (0, registry_1.getModelsByCategory)('fast');
            const primary = models[0];
            return {
                category: 'fast',
                primaryModel: primary,
                reason: 'Cost-sensitive mode: selected fast, low-cost model'
            };
        }
        // Rule 6 - Latency Sensitivity: Prefer Fast Models
        if (metadata.latency_mode === 'low-latency') {
            const models = (0, registry_1.getModelsByCategory)('fast');
            const primary = models.find(m => m.latency_profile === 'fast') || models[0];
            return {
                category: 'fast',
                primaryModel: primary,
                reason: 'Low-latency mode: selected fast-response model'
            };
        }
        // Rule 2 - Coding Tasks
        if (metadata.task_type === 'code') {
            const models = (0, registry_1.getModelsByCategory)('coding');
            const primaryModel = models[0];
            const fallbackModel = (0, registry_1.getFallbackModel)('coding', primaryModel.id);
            return {
                category: 'coding',
                primaryModel: primaryModel,
                fallbackModel: fallbackModel,
                reason: 'Coding task detected: routed to specialized coding model'
            };
        }
        // Rule 4 - Long Context (check before reasoning since complexity can trigger both)
        if (metadata.task_type === 'rag') {
            const models = (0, registry_1.getModelsByCategory)('long-context');
            const primaryModel = models[0];
            const fallbackModel = (0, registry_1.getFallbackModel)('long-context', primaryModel.id);
            return {
                category: 'long-context',
                primaryModel: primaryModel,
                fallbackModel: fallbackModel,
                reason: 'RAG task detected: routed to long-context model'
            };
        }
        // Rule 3 - Complex Reasoning
        if (metadata.task_type === 'reasoning' || metadata.complexity === 'high') {
            const models = (0, registry_1.getModelsByCategory)('reasoning');
            const primaryModel = models[0];
            const fallbackModel = (0, registry_1.getFallbackModel)('reasoning', primaryModel.id);
            return {
                category: 'reasoning',
                primaryModel: primaryModel,
                fallbackModel: fallbackModel,
                reason: 'High complexity or reasoning task: routed to advanced reasoning model'
            };
        }
        // Rule 1 - Simple Tasks
        if (metadata.complexity === 'low' && metadata.context_length < 200) {
            const models = (0, registry_1.getModelsByCategory)('fast');
            const primaryModel = models[0];
            return {
                category: 'fast',
                primaryModel: primaryModel,
                reason: 'Simple task with low complexity: routed to fast model'
            };
        }
        // Default fallback for medium complexity
        const primaryModel = (0, registry_1.getModelsByCategory)('coding')[0];
        return {
            category: 'coding',
            primaryModel: primaryModel,
            reason: 'Medium complexity task: routed to balanced coding model'
        };
    }
    /**
     * Get routing decision for a specific model override
     */
    routeWithOverride(request, preferredModel) {
        const metadata = (0, analyzer_1.analyzeRequest)(request);
        const models = (0, registry_1.getModelsByCategory)('fast'); // Will find the right one
        const primaryModel = (0, registry_1.getModelById)(preferredModel);
        if (!primaryModel) {
            throw new Error(`Model ${preferredModel} not found in registry`);
        }
        const fallback = (0, registry_1.getFallbackModel)(primaryModel.category, primaryModel.id);
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
exports.OmniRouter = OmniRouter;
// Export singleton instance
exports.omniRouter = new OmniRouter();
// Helper function
function routeRequest(request) {
    return exports.omniRouter.route(request);
}
//# sourceMappingURL=router.js.map