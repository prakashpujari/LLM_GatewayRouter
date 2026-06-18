/**
 * OmniRouter Type Definitions
 * Provider-agnostic AI model routing engine
 */

// Model Categories
export type ModelCategory = 'fast' | 'coding' | 'reasoning' | 'long-context';

// Task Types
export type TaskType = 'chat' | 'code' | 'reasoning' | 'rag' | 'summary' | 'analysis';

// Complexity Levels
export type ComplexityLevel = 'low' | 'medium' | 'high';

// Latency Modes
export type LatencyMode = 'normal' | 'low-latency';

// Cost Modes
export type CostMode = 'normal' | 'cost-sensitive';

// Route Metadata for UI/charts/logs
export interface RouteMetadata {
  complexity: ComplexityLevel;
  task_type: TaskType;
  context_length: number;
  latency_mode: LatencyMode;
  cost_mode: CostMode;
  token_estimate?: number;
  detected_keywords?: string[];
}

// UI Configuration
export interface UIRoutingConfig {
  color: string; // hex or semantic color
  badge: string; // short label
  icon: string; // generic icon name
  debug: string; // short explanation for developers
}

// Unified Routing Response
export interface RoutingDecision {
  selected_model: string;
  category: ModelCategory;
  reason: string;
  fallback_model: string | null;
  metadata: RouteMetadata;
  ui: UIRoutingConfig;
}

// Request Context for routing decisions
export interface RoutingRequest {
  prompt: string;
  context_length?: number;
  priority?: 'low' | 'medium' | 'high';
  latency_sensitive?: boolean;
  cost_sensitive?: boolean;
  task_hint?: TaskType;
}

// Model Definition
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