"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugPanel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const DebugPanel = ({ decision }) => {
    const { metadata, ui } = decision;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "omni-router-debug-panel", style: {
            backgroundColor: '#f5f5f5',
            padding: '1rem',
            borderRadius: '0.5rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
        }, "data-testid": "debug-panel", children: [(0, jsx_runtime_1.jsx)("h4", { style: { margin: '0 0 0.5rem 0' }, children: "Routing Debug" }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: '0.25rem' }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Complexity:" }), " ", metadata.complexity] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Task Type:" }), " ", metadata.task_type] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Context Length:" }), " ", metadata.context_length.toLocaleString(), " chars"] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Latency Mode:" }), " ", metadata.latency_mode] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Cost Mode:" }), " ", metadata.cost_mode] }), metadata.token_estimate && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Token Estimate:" }), " ", metadata.token_estimate.toLocaleString()] })), metadata.detected_keywords && metadata.detected_keywords.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Detected Keywords:" }), " ", metadata.detected_keywords.join(', ')] })), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: '0.5rem', fontStyle: 'italic' }, children: ui.debug })] })] }));
};
exports.DebugPanel = DebugPanel;
//# sourceMappingURL=DebugPanel.js.map