"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelSelector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const CATEGORY_LABELS = {
    fast: 'Fast/Low-Cost',
    coding: 'Coding/Technical',
    reasoning: 'Advanced Reasoning',
    'long-context': 'Long-Context'
};
const ModelSelector = ({ decision, onModelChange }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "omni-router-model-selector", "data-testid": "model-selector", children: [(0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '0.5rem' }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Selected Model:" }), " ", decision.selected_model] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '0.5rem' }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Category:" }), " ", CATEGORY_LABELS[decision.category]] }), decision.fallback_model && onModelChange && ((0, jsx_runtime_1.jsxs)("button", { onClick: () => onModelChange(decision.fallback_model), style: {
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                }, "data-testid": "use-fallback-button", children: ["Use Fallback: ", decision.fallback_model] }))] }));
};
exports.ModelSelector = ModelSelector;
//# sourceMappingURL=ModelSelector.js.map