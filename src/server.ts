/**
 * OmniRouter Express Server
 * Provides REST API endpoints for model routing
 */

import express, { Request, Response } from 'express';
import { omniRouter, RoutingRequest, RoutingDecision } from './index';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes

/**
 * POST /api/route
 * Route a request to the optimal model
 */
app.post('/api/route', (req: Request, res: Response) => {
  try {
    const request: RoutingRequest = req.body;

    if (!request.prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const decision: RoutingDecision = omniRouter.route(request);
    return res.json(decision);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/route/override
 * Route with model override
 */
app.post('/api/route/override', (req: Request, res: Response) => {
  try {
    const { prompt, model, ...options } = req.body;

    if (!prompt || !model) {
      return res.status(400).json({ error: 'prompt and model are required' });
    }

    const decision: RoutingDecision = omniRouter.routeWithOverride(
      { prompt, ...options },
      model
    );
    return res.json(decision);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/models
 * List available models
 */
app.get('/api/models', (_req: Request, res: Response) => {
  const { MODEL_REGISTRY } = require('./models/registry');
  return res.json(MODEL_REGISTRY);
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  return res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend
app.get('/', (_req: Request, res: Response) => {
  return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Only start server if not imported (for serverless compatibility)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 OmniRouter API server running on http://localhost:${PORT}`);
    console.log(`📊 Routes:`);
    console.log(`  POST /api/route - Route a request`);
    console.log(`  POST /api/route/override - Route with override`);
    console.log(`  GET /api/models - List models`);
    console.log(`  GET /api/health - Health check`);
  });
}

export { app };
export default app;