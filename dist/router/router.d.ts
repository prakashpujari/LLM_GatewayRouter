/**
 * OmniRouter - Core routing logic
 * Selects optimal AI models based on request characteristics
 */
import { RoutingRequest, RoutingDecision } from '../types';
export declare class OmniRouter {
    private defaultModels;
    /**
     * Route a request to the optimal model
     */
    route(request: RoutingRequest): RoutingDecision;
    /**
     * Determine the best route based on metadata and request context
     */
    private determineRoute;
    /**
     * Get routing decision for a specific model override
     */
    routeWithOverride(request: RoutingRequest, preferredModel: string): RoutingDecision;
}
export declare const omniRouter: OmniRouter;
export declare function routeRequest(request: RoutingRequest): RoutingDecision;
//# sourceMappingURL=router.d.ts.map