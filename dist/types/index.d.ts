/**
 * OmniRouter Type Definitions
 * Provider-agnostic AI model routing engine
 */
export type ModelCategory = 'fast' | 'coding' | 'reasoning' | 'long-context';
export type TaskType = 'chat' | 'code' | 'reasoning' | 'rag' | 'summary' | 'analysis';
export type ComplexityLevel = 'low' | 'medium' | 'high';
export type LatencyMode = 'normal' | 'low-latency';
export type CostMode = 'normal' | 'cost-sensitive';
export interface RouteMetadata {
    complexity: ComplexityLevel;
    task_type: TaskType;
    context_length: number;
    latency_mode: LatencyMode;
    cost_mode: CostMode;
    token_estimate?: number;
    detected_keywords?: string[];
}
export interface UIRoutingConfig {
    color: string;
    badge: string;
    icon: string;
    debug: string;
}
export interface RoutingDecision {
    selected_model: string;
    category: ModelCategory;
    reason: string;
    fallback_model: string | null;
    metadata: RouteMetadata;
    ui: UIRoutingConfig;
}
export interface RoutingRequest {
    prompt: string;
    context_length?: number;
    priority?: 'low' | 'medium' | 'high';
    latency_sensitive?: boolean;
    cost_sensitive?: boolean;
    task_hint?: TaskType;
}
export interface ModelDefinition {
    id: string;
    name: string;
    category: ModelCategory;
    provider: string;
    capabilities: string[];
    context_window: number;
    cost_per_1k_tokens?: {
        input: number;
        output: number;
    };
    latency_profile: 'fast' | 'moderate' | 'slow';
}
//# sourceMappingURL=index.d.ts.map