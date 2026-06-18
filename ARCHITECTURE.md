# OmniRouter Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT / UI                                 │
│  ┌─────────────────┐    ┌──────────────────────────────────────┐   │
│  │   Frontend UI   │───▶│ POST /api/route                      │   │
│  │  (index.html)   │    │ { prompt: "...", options }            │   │
│  └─────────────────┘    └──────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         EXPRESS API SERVER                            │
│                              (server.ts)                             │
├─────────────────────────────────────────────────────────────────────┤
│  Routes:                                                             │
│  • POST /api/route → omniRouter.route()                             │
│  • POST /api/route/override → omniRouter.routeWithOverride()          │
│  • GET /api/models → MODEL_REGISTRY                                 │
│  • GET /api/health → { status: "ok" }                               │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           OMNIROUTER                                 │
│                              (router.ts)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────┐                                            │
│  │   analyzeRequest()   │────▶ Returns: { complexity, task_type, ... }│
│  │   (analyzer.ts)      │                                            │
│  └─────────────────────┘                                            │
│                │                                                     │
│                ▼                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    determineRoute()                              │ │
│  │  Rule-based routing logic:                                       │ │
│  │  1. Cost-sensitive → fast                                        │ │
│  │  2. Latency-sensitive → fast                                     │ │
│  │  3. task_type='rag' → long-context                               │ │
│  │  4. task_type='code' → coding                                    │ │
│  │  5. complexity='high'/'reasoning' → reasoning                  │ │
│  │  6. Simple → fast                                                │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                │                                                     │
│                ▼                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                 RoutingDecision                                   │ │
│  │  {                                                               │ │
│  │    selected_model: string,      // e.g. "coding-gpt-4"            │ │
│  │    category: ModelCategory,     // "fast" | "coding" | ...       │ │
│  │    reason: string,              // Why this model?                 │ │
│  │    fallback_model: string,      // Backup model                    │ │
│  │    metadata: RouteMetadata,     // For charts/logs                 │ │
│  │    ui: UIRoutingConfig          // For React rendering             │ │
│  │  }                                                               │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         MODEL REGISTRY                                 │
│                        (models/registry.ts)                           │
├─────────────────────────────────────────────────────────────────────┤
│  fast:      fast-gpt-3.5, fast-claude-haiku                          │
│  coding:    coding-gpt-4, coding-claude-sonnet                        │
│  reasoning: reasoning-claude-opus, reasoning-gpt-4                     │
│  long-context: long-context-claude, long-context-gpt-4-turbo           │
└─────────────────────────────────────────────────────────────────────┘
```

## Step-by-Step Execution Flow

### Step 1: User Sends Request
```typescript
// Input
const request = {
  prompt: "How to create a React component?",
  latency_sensitive: false,
  cost_sensitive: false
};
```

### Step 2: Request Analysis
```typescript
// src/router/analyzer.ts
function analyzeRequest(request) {
  // Detects keywords
  const codingMatches = ['react', 'component'];
  
  // Returns structured metadata
  return {
    task_type: 'code',
    complexity: 'low',
    context_length: 35,
    latency_mode: 'normal',
    cost_mode: 'normal',
    detected_keywords: ['react', 'component'],
    token_estimate: 9
  };
}
```

### Step 3: Routing Decision
```typescript
// src/router/router.ts
determineRoute(metadata) {
  // Rule 2: Coding task → coding model
  if (metadata.task_type === 'code') {
    return {
      category: 'coding',
      selected_model: 'coding-gpt-4',
      fallback_model: 'coding-claude-sonnet',
      reason: 'Coding task detected: routed to specialized coding model'
    };
  }
}
```

### Step 4: UI-Friendly Response
```json
{
  "selected_model": "coding-gpt-4",
  "category": "coding",
  "reason": "Coding task detected: routed to specialized coding model",
  "fallback_model": "coding-claude-sonnet",
  "metadata": {
    "complexity": "low",
    "task_type": "code",
    "context_length": 35,
    "latency_mode": "normal",
    "cost_mode": "normal",
    "token_estimate": 9
  },
  "ui": {
    "color": "#3b82f6",
    "badge": "CODE",
    "icon": "code",
    "debug": "Coding task detected: routed to specialized coding model"
  }
}
```

## Test Coverage

```
Core Logic Tests (20):
├── Simple requests → fast models
├── Coding requests → coding models  
├── Reasoning requests → reasoning models
├── RAG requests → long-context models
├── Cost-sensitive mode → fast models
├── Latency-sensitive mode → fast models
└── Deterministic routing

UI Component Tests (10):
├── RoutingBadge rendering
├── DebugPanel metadata display
└── Fallback indicators
```

## Project Structure

```
src/
├── types/index.ts           # TypeScript interfaces
├── models/registry.ts       # Model definitions
├── router/
│   ├── analyzer.ts          # Keyword detection
│   └── router.ts            # OmniRouter class
├── server.ts                # Express API
└── ui/components/           # React components
    ├── RoutingBadge.tsx
    ├── DebugPanel.tsx
    └── ModelSelector.tsx
```

## API Endpoints

```bash
# Route a request
POST /api/route
{"prompt": "...", "cost_sensitive": false}

# Override model selection
POST /api/route/override
{"prompt": "...", "model": "reasoning-claude-opus"}

# List models
GET /api/models

# Health check
GET /api/health
```

## Deployment

### Render (render.yaml)
```yaml
services:
  - type: web
    name: omni-router-api
    buildCommand: npm install && npm run build
    startCommand: npm start
```

### Vercel (vercel.json)
```json
{
  "version": 2,
  "builds": [{ "src": "api/index.ts", "use": "@vercel/node" }]
}
```

### Manual Deploy
```bash
# Render
git push origin main

# Vercel
vercel --prod
```

## License

© 2026 OmniRouter. All rights reserved.
Powered by PrakashPujariAI