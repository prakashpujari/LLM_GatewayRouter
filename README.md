# OmniRouter - AI Model Routing Engine

A production-grade, enterprise AI Model Routing Engine with React + TypeScript testing interface.

## Features

- **Intelligent Model Selection**: Routes requests to optimal AI models based on rule-based logic
- **Provider-Agnostic**: Works with OpenAI, Anthropic, and other providers
- **UI-Friendly Output**: Structured JSON for easy React rendering
- **Configurable Rules**: Extensible routing logic for different use cases
- **Deterministic**: Same input always produces same output for testing
- **Fallback Support**: Automatic fallback model selection

## Installation

```bash
npm install
```

## Usage

### Basic Routing

```typescript
import { routeRequest, omniRouter } from 'omni-router';

// Simple routing
const decision = routeRequest({
  prompt: 'How do I create a React component?',
});

console.log(decision);
// {
//   selected_model: 'coding-claude-sonnet',
//   category: 'coding',
//   reason: 'Coding task detected: routed to specialized coding model',
//   fallback_model: 'coding-gpt-4',
//   metadata: { ... },
//   ui: { color: '#3b82f6', badge: 'CODE', icon: 'code', debug: '...' }
// }
```

### Advanced Routing with Options

```typescript
const decision = omniRouter.route({
  prompt: 'Analyze this complex system architecture',
  context_length: 50000,
  cost_sensitive: false,
  latency_sensitive: true,
});
```

### Programmatic Override

```typescript
const decision = omniRouter.routeWithOverride(
  { prompt: 'Any request' },
  'reasoning-claude-opus' // Force this model
);
```

### React UI Component

```tsx
import { RoutingBadge, DebugPanel } from 'omni-router/ui';

function ChatInterface() {
  const decision = routeRequest({ prompt: userInput });
  
  return (
    <div>
      <RoutingBadge decision={decision} />
      <DebugPanel decision={decision} />
    </div>
  );
}
```

## Model Categories

| Category | Use Case | Examples | Color |
|----------|----------|----------|-------|
| `fast` | Simple Q&A, high-volume | GPT-3.5, Claude Haiku | ![green](https://placehold.co/16x16/10b981/10b981.png) `#10b981` |
| `coding` | Code generation, debugging | GPT-4, Claude Sonnet | ![blue](https://placehold.co/16x16/3b82f6/3b82f6.png) `#3b82f6` |
| `reasoning` | Multi-step reasoning, planning | Claude Opus, GPT-4 | ![purple](https://placehold.co/16x16/8b5cf6/8b5cf6.png) `#8b5cf6` |
| `long-context` | Document processing, RAG | Claude (200K) | ![amber](https://placehold.co/16x16/f59e0b/f59e0b.png) `#f59e0b` |

## UI Preview

To see the UI, run the server locally and open `http://localhost:8000`.

Once deployed, the web interface provides:
- Live prompt input and routing
- Real-time UI updates
- Metadata visualization
- Fallback model indicators

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔍 OmniRouter - AI Model Routing Engine                             │
│  AI Model Routing Engine - Production Grade                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Prompt: [ How do I create a React component with TypeScript?     ] │
│         [_______________________________][BUTTON] Route Request      │
│                                                                     │
│  ┌── Routing Result ──────────────────────────────────────────────┐ │
│  │                                                              │ │
│  │  [CODE] coding-gpt-4 ⚡ Fallback: coding-claude-sonnet          │ │
│  │                                                              │ │
│  │  "Coding task detected: routed to specialized coding model"    │ │
│  │                                                              │ │
│  │  Metadata:                                                    │ │
│  │    Complexity: low        Task Type: code                     │ │
│  │    Context: 50 chars      Token Est: 13                       │ │
│  │    Keywords: react, typescript, async, await                  │ │
│  │                                                              │ │
│  │  {"selected_model":"coding-gpt-4","category":"coding",...}    │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│                          © 2026 OmniRouter. All rights reserved.   │
│                                Powered by PrakashPujariAI           │
└─────────────────────────────────────────────────────────────────────┘
```

## Routing Rules

1. **Simple Tasks**: Requests <80 chars or low complexity → Fast Model
2. **Coding Tasks**: Programming keywords detected → Coding Model
3. **Complex Reasoning**: Deep reasoning required → Advanced Reasoning Model
4. **Long Context**: Context >100K chars → Long-Context Model
5. **Cost Sensitivity**: cost_sensitive=true → Fast Models
6. **Latency Sensitivity**: latency_sensitive=true → Fast Models
7. **Fallback**: Automatic fallback to secondary model in same category

## Testing

```bash
# Run all tests
npm test

# Run UI tests
npm run test:ui
```

## API Endpoints (Local Server)

Start the server with `npm start`:

```bash
npm start
# Server running on http://localhost:8000
```

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/route` | Route a request to the optimal model |
| POST | `/api/route/override` | Route with manual model override |
| GET | `/api/models` | List all available models |
| GET | `/api/health` | Health check endpoint |

### Example API Usage

```bash
# Route a coding request
curl -X POST http://localhost:8000/api/route \
  -H "Content-Type: application/json" \
  -d '{"prompt": "How do I create a React component with TypeScript?"}'

# Route with latency preference
curl -X POST http://localhost:8000/api/route \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Quick question", "latency_sensitive": true}'

# Manual model override
curl -X POST http://localhost:8000/api/route/override \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Any request", "model": "reasoning-claude-opus"}'
```

### Web Interface

Open `http://localhost:8000` in your browser to use the interactive frontend for testing routing decisions.

## Project Structure

```
src/
├── types/           # Type definitions
├── models/          # Model registry
├── router/          # Core routing logic
│   ├── analyzer.ts  # Request analysis
│   └── router.ts    # Routing decisions
└── ui/              # React components
    └── components/
        ├── RoutingBadge.tsx
        ├── DebugPanel.tsx
        └── ModelSelector.tsx
```

## License

MIT