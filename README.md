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

| Category | Use Case | Examples |
|----------|----------|----------|
| `fast` | Simple Q&A, high-volume | GPT-3.5, Claude Haiku |
| `coding` | Code generation, debugging | GPT-4, Claude Sonnet |
| `reasoning` | Multi-step reasoning, planning | Claude Opus, GPT-4 |
| `long-context` | Document processing, RAG | Claude (200K) |

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