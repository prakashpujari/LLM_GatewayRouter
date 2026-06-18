/**
 * Vercel Serverless Function Entry Point
 * Re-exports the compiled server for serverless deployment
 */
import app from '../dist/server';

// For Vercel serverless functions
export default app;