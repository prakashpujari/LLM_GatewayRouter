"use strict";
/**
 * OmniRouter Express Server
 * Provides REST API endpoints for model routing
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("./index");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env.PORT || 8000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
// API Routes
/**
 * POST /api/route
 * Route a request to the optimal model
 */
app.post('/api/route', (req, res) => {
    try {
        const request = req.body;
        if (!request.prompt) {
            return res.status(400).json({ error: 'prompt is required' });
        }
        const decision = index_1.omniRouter.route(request);
        return res.json(decision);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * POST /api/route/override
 * Route with model override
 */
app.post('/api/route/override', (req, res) => {
    try {
        const { prompt, model, ...options } = req.body;
        if (!prompt || !model) {
            return res.status(400).json({ error: 'prompt and model are required' });
        }
        const decision = index_1.omniRouter.routeWithOverride({ prompt, ...options }, model);
        return res.json(decision);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
/**
 * GET /api/models
 * List available models
 */
app.get('/api/models', (_req, res) => {
    const { MODEL_REGISTRY } = require('./models/registry');
    return res.json(MODEL_REGISTRY);
});
/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (_req, res) => {
    return res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Serve frontend
app.get('/', (_req, res) => {
    return res.sendFile(path_1.default.join(__dirname, '..', 'public', 'index.html'));
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
exports.default = app;
//# sourceMappingURL=server.js.map