"use strict";
/**
 * OmniRouter - Main entry point
 * Re-export all public APIs
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeRequest = exports.OmniRouter = exports.routeRequest = exports.omniRouter = void 0;
var router_1 = require("./router/router");
Object.defineProperty(exports, "omniRouter", { enumerable: true, get: function () { return router_1.omniRouter; } });
Object.defineProperty(exports, "routeRequest", { enumerable: true, get: function () { return router_1.routeRequest; } });
var router_2 = require("./router/router");
Object.defineProperty(exports, "OmniRouter", { enumerable: true, get: function () { return router_2.OmniRouter; } });
__exportStar(require("./types"), exports);
__exportStar(require("./models/registry"), exports);
var analyzer_1 = require("./router/analyzer");
Object.defineProperty(exports, "analyzeRequest", { enumerable: true, get: function () { return analyzer_1.analyzeRequest; } });
//# sourceMappingURL=index.js.map