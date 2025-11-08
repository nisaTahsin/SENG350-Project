"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const healthMetrics = [
    {
        id: 'db-connectivity',
        name: 'Database Connectivity',
        status: 'healthy',
        value: 'Connected',
        description: 'PostgreSQL database connection status',
        lastChecked: '2024-01-15 16:45:22'
    },
    {
        id: 'api-endpoints',
        name: 'API Endpoints',
        status: 'healthy',
        value: 'All Operational',
        description: 'REST API endpoint availability',
        lastChecked: '2024-01-15 16:45:20'
    },
    {
        id: 'booking-service',
        name: 'Booking Service',
        status: 'warning',
        value: 'Degraded',
        description: 'Booking service experiencing minor delays',
        lastChecked: '2024-01-15 16:45:18'
    },
    {
        id: 'error-rate',
        name: 'Error Rate',
        status: 'healthy',
        value: '0.2%',
        description: 'Failed requests in the last hour',
        lastChecked: '2024-01-15 16:45:15'
    },
    {
        id: 'failed-bookings',
        name: 'Failed Bookings',
        status: 'healthy',
        value: '3',
        description: 'Failed booking attempts in the last 24 hours',
        lastChecked: '2024-01-15 16:45:12'
    },
    {
        id: 'system-uptime',
        name: 'System Uptime',
        status: 'healthy',
        value: '99.8%',
        description: 'System availability over the last 30 days',
        lastChecked: '2024-01-15 16:45:10'
    }
];
const systemUptime = [
    { service: 'Database', uptime: 99.9, status: 'up' },
    { service: 'API Gateway', uptime: 99.7, status: 'up' },
    { service: 'Booking Service', uptime: 98.5, status: 'degraded' },
    { service: 'Authentication', uptime: 99.8, status: 'up' },
    { service: 'File Storage', uptime: 99.6, status: 'up' }
];
const performanceMetrics = [
    { metric: 'Average Booking Query Latency', value: 145, unit: 'ms', trend: 'stable' },
    { metric: 'Database Query Time', value: 89, unit: 'ms', trend: 'down' },
    { metric: 'API Response Time', value: 234, unit: 'ms', trend: 'up' },
    { metric: 'Page Load Time', value: 1.2, unit: 's', trend: 'stable' },
    { metric: 'Memory Usage', value: 68, unit: '%', trend: 'up' },
    { metric: 'CPU Usage', value: 45, unit: '%', trend: 'stable' }
];
const AdminSystemHealthTable = () => {
    const [currentTime, setCurrentTime] = (0, react_1.useState)(new Date());
    const [selectedTimeRange, setSelectedTimeRange] = (0, react_1.useState)('24h');
    // Update time every second
    (0, react_1.useEffect)(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy':
            case 'up':
                return '#28a745';
            case 'warning':
            case 'degraded':
                return '#ffc107';
            case 'critical':
            case 'down':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'healthy':
            case 'up':
                return '✅';
            case 'warning':
            case 'degraded':
                return '⚠️';
            case 'critical':
            case 'down':
                return '❌';
            default:
                return '❓';
        }
    };
    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up':
                return '📈';
            case 'down':
                return '📉';
            case 'stable':
                return '➡️';
            default:
                return '➡️';
        }
    };
    const getTrendColor = (trend) => {
        switch (trend) {
            case 'up':
                return '#dc3545';
            case 'down':
                return '#28a745';
            case 'stable':
                return '#6c757d';
            default:
                return '#6c757d';
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { background: 'white', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24, position: 'relative' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "System Health Dashboard" }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: 16 }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { fontSize: 14, color: '#666' }, children: ["Last updated: ", currentTime.toLocaleTimeString()] }), (0, jsx_runtime_1.jsxs)("select", { value: selectedTimeRange, onChange: (e) => setSelectedTimeRange(e.target.value), style: {
                                    padding: '6px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: 4,
                                    fontSize: 12
                                }, children: [(0, jsx_runtime_1.jsx)("option", { value: "1h", children: "Last Hour" }), (0, jsx_runtime_1.jsx)("option", { value: "24h", children: "Last 24 Hours" }), (0, jsx_runtime_1.jsx)("option", { value: "7d", children: "Last 7 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "30d", children: "Last 30 Days" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 32 }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { color: '#0a4a7e', borderBottom: '2px solid #0a4a7e', paddingBottom: 8, marginBottom: 16 }, children: "Health Status Overview" }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }, children: healthMetrics.map((metric) => ((0, jsx_runtime_1.jsxs)("div", { style: {
                                border: '1px solid #dee2e6',
                                borderRadius: 8,
                                padding: 16,
                                background: '#f8f9fa'
                            }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }, children: [(0, jsx_runtime_1.jsx)("h4", { style: { margin: 0, fontSize: 14, fontWeight: 'bold' }, children: metric.name }), (0, jsx_runtime_1.jsx)("span", { style: { fontSize: 18 }, children: getStatusIcon(metric.status) })] }), (0, jsx_runtime_1.jsx)("div", { style: { marginBottom: 8 }, children: (0, jsx_runtime_1.jsx)("span", { style: {
                                            background: getStatusColor(metric.status),
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: 12,
                                            fontSize: 12,
                                            fontWeight: 'bold'
                                        }, children: metric.value }) }), (0, jsx_runtime_1.jsx)("p", { style: { margin: 0, fontSize: 12, color: '#666' }, children: metric.description }), (0, jsx_runtime_1.jsxs)("p", { style: { margin: '4px 0 0 0', fontSize: 10, color: '#999' }, children: ["Last checked: ", metric.lastChecked] })] }, metric.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 32 }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { color: '#0a4a7e', borderBottom: '2px solid #0a4a7e', paddingBottom: 8, marginBottom: 16 }, children: "Service Uptime" }), (0, jsx_runtime_1.jsx)("div", { style: { overflowX: 'auto' }, children: (0, jsx_runtime_1.jsxs)("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { style: { background: '#f8f9fa' }, children: [(0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }, children: "SERVICE" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }, children: "UPTIME" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }, children: "STATUS" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }, children: "VISUAL" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: systemUptime.map((service, idx) => ((0, jsx_runtime_1.jsxs)("tr", { style: { borderBottom: '1px solid #dee2e6' }, children: [(0, jsx_runtime_1.jsx)("td", { style: { padding: 12, border: '1px solid #dee2e6', fontWeight: 'bold' }, children: service.service }), (0, jsx_runtime_1.jsxs)("td", { style: { padding: 12, border: '1px solid #dee2e6', fontFamily: 'monospace' }, children: [service.uptime, "%"] }), (0, jsx_runtime_1.jsx)("td", { style: { padding: 12, border: '1px solid #dee2e6' }, children: (0, jsx_runtime_1.jsx)("span", { style: {
                                                        background: getStatusColor(service.status),
                                                        color: 'white',
                                                        padding: '2px 8px',
                                                        borderRadius: 12,
                                                        fontSize: 10,
                                                        fontWeight: 'bold'
                                                    }, children: service.status.toUpperCase() }) }), (0, jsx_runtime_1.jsx)("td", { style: { padding: 12, border: '1px solid #dee2e6' }, children: (0, jsx_runtime_1.jsx)("div", { style: {
                                                        width: '100%',
                                                        height: 8,
                                                        background: '#e9ecef',
                                                        borderRadius: 4,
                                                        overflow: 'hidden'
                                                    }, children: (0, jsx_runtime_1.jsx)("div", { style: {
                                                            width: `${service.uptime}%`,
                                                            height: '100%',
                                                            background: getStatusColor(service.status),
                                                            transition: 'width 0.3s ease'
                                                        } }) }) })] }, idx))) })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 32 }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { color: '#0a4a7e', borderBottom: '2px solid #0a4a7e', paddingBottom: 8, marginBottom: 16 }, children: "Performance Metrics" }), (0, jsx_runtime_1.jsx)("div", { style: { overflowX: 'auto' }, children: (0, jsx_runtime_1.jsxs)("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { style: { background: '#f8f9fa' }, children: [(0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }, children: "METRIC" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }, children: "VALUE" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }, children: "TREND" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }, children: "STATUS" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: performanceMetrics.map((metric, idx) => ((0, jsx_runtime_1.jsxs)("tr", { style: { borderBottom: '1px solid #dee2e6' }, children: [(0, jsx_runtime_1.jsx)("td", { style: { padding: 12, border: '1px solid #dee2e6', fontWeight: 'bold' }, children: metric.metric }), (0, jsx_runtime_1.jsxs)("td", { style: { padding: 12, border: '1px solid #dee2e6', fontFamily: 'monospace' }, children: [metric.value, " ", metric.unit] }), (0, jsx_runtime_1.jsx)("td", { style: { padding: 12, border: '1px solid #dee2e6' }, children: (0, jsx_runtime_1.jsxs)("span", { style: { display: 'flex', alignItems: 'center', gap: 4 }, children: [(0, jsx_runtime_1.jsx)("span", { style: { fontSize: 16 }, children: getTrendIcon(metric.trend) }), (0, jsx_runtime_1.jsx)("span", { style: {
                                                                color: getTrendColor(metric.trend),
                                                                fontSize: 12,
                                                                fontWeight: 'bold'
                                                            }, children: metric.trend.toUpperCase() })] }) }), (0, jsx_runtime_1.jsx)("td", { style: { padding: 12, border: '1px solid #dee2e6' }, children: (0, jsx_runtime_1.jsx)("span", { style: {
                                                        background: metric.trend === 'up' ? '#dc3545' :
                                                            metric.trend === 'down' ? '#28a745' : '#6c757d',
                                                        color: 'white',
                                                        padding: '2px 8px',
                                                        borderRadius: 12,
                                                        fontSize: 10,
                                                        fontWeight: 'bold'
                                                    }, children: metric.trend === 'up' ? 'HIGH' :
                                                        metric.trend === 'down' ? 'IMPROVING' : 'STABLE' }) })] }, idx))) })] }) })] })] }));
};
exports.default = AdminSystemHealthTable;
//# sourceMappingURL=AdminSystemHealthTable.js.map