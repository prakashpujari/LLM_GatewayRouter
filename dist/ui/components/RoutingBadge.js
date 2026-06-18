"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingBadge = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const RoutingBadge = ({ decision }) => {
    const { ui, selected_model, fallback_model } = decision;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "omni-router-badge", style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [(0, jsx_runtime_1.jsx)("span", { className: `badge badge-${ui.badge.toLowerCase()}`, style: {
                    backgroundColor: ui.color,
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                }, "data-testid": "routing-badge", children: ui.badge }), (0, jsx_runtime_1.jsx)("span", { style: { fontSize: '0.875rem', color: '#666' }, children: selected_model }), fallback_model && ((0, jsx_runtime_1.jsxs)("span", { title: `Fallback: ${fallback_model}`, style: { fontSize: '0.75rem', color: '#999' }, "data-testid": "fallback-indicator", children: ["\u26A1 Fallback: ", fallback_model] }))] }));
};
exports.RoutingBadge = RoutingBadge;
//# sourceMappingURL=RoutingBadge.js.map