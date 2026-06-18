/**
 * Model Registry - Provider-agnostic model definitions
 * In production, this would be loaded from configuration
 */
import { ModelCategory, ModelDefinition } from '../types';
export declare const MODEL_REGISTRY: ModelDefinition[];
export declare function getModelsByCategory(category: ModelCategory): ModelDefinition[];
export declare function getFallbackModel(category: ModelCategory, excludeId?: string): ModelDefinition | undefined;
export declare function getModelById(id: string): ModelDefinition | undefined;
//# sourceMappingURL=registry.d.ts.map