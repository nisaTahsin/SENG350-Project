"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcpInvoke = mcpInvoke;
async function mcpInvoke(tool, input, token) {
    const base = import.meta.env.VITE_API_BASE ?? '';
    const res = await fetch(`${base}/mcp/invoke`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'x-mcp-token': token } : {}),
        },
        body: JSON.stringify({ tool, input }),
        credentials: 'include',
    });
    if (!res.ok)
        throw new Error(`MCP ${res.status}`);
    const json = await res.json();
    if (!json.ok)
        throw new Error(json.error ?? 'MCP invoke failed');
    return json.data;
}
//# sourceMappingURL=mcpClient.js.map