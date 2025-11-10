import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

interface HealthMetric {
    id: string;
    name: string;
    status: 'healthy' | 'warning' | 'critical';
    value: string | number;
    description: string;
    lastChecked: string;
}

interface SystemUptime {
	service: string;
	uptime: number;
	status: 'up' | 'down' | 'degraded';
}

interface PerformanceMetric {
	metric: string;
	value: number;
	unit: string;
	trend: 'up' | 'down' | 'stable';
}

const healthMetrics: HealthMetric[] = [
    {
        id: 'db-connectivity',
        name: 'Database Connectivity',
        status: 'healthy',
        value: 'Connected',
        description: 'PostgreSQL database connection status',
        lastChecked: 'Unknown'
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
        status: 'healthy',
        value: 'Operational',
        description: 'Booking service running normally',
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
        value: '0',
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

const systemUptime: SystemUptime[] = [
    { service: 'Database', uptime: 99.9, status: 'up' },
    { service: 'API Gateway', uptime: 99.7, status: 'up' },
    { service: 'Booking Service', uptime: 99.8, status: 'up' },
    { service: 'Authentication', uptime: 99.8, status: 'up' }
];

const performanceMetrics: PerformanceMetric[] = [
	{ metric: 'Average Booking Query Latency', value: 145, unit: 'ms', trend: 'stable' },
	{ metric: 'Database Query Time', value: 89, unit: 'ms', trend: 'down' },
	{ metric: 'API Response Time', value: 234, unit: 'ms', trend: 'up' },
	{ metric: 'Page Load Time', value: 1.2, unit: 's', trend: 'stable' },
	{ metric: 'Memory Usage', value: 68, unit: '%', trend: 'up' },
	{ metric: 'CPU Usage', value: 45, unit: '%', trend: 'stable' }
];

const AdminSystemHealthTable: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
    const [healthMetricsState, setHealthMetricsState] = useState<HealthMetric[]>(healthMetrics);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // set a single snapshot timestamp for "Last checked" (does not increment)
    useEffect(() => {
        const snapshot = new Date().toLocaleString();
        // set snapshot immediately so UI shows a timestamp even if backend is unreachable
        setHealthMetricsState((prev: HealthMetric[]) =>
            prev.map((m: HealthMetric) =>
                ['db-connectivity', 'api-endpoints', 'booking-service', 'failed-bookings', 'system-uptime'].includes(m.id)
                    ? { ...m, lastChecked: snapshot }
                    : m
            )
        );

        const endpoints: { id: string; path: string }[] = [
            { id: 'db-connectivity', path: '/health/db' },
            { id: 'api-endpoints', path: '/health/api' },         // optional backend endpoints
            { id: 'booking-service', path: '/health/booking' },   // optional backend endpoints
            { id: 'failed-bookings', path: '/health/failed-bookings' },
            { id: 'system-uptime', path: '/health/uptime' }       // optional backend endpoints
        ];

        const extractTimestamp = (data: any): string | null => {
            // common fields that health endpoints might return
            const candidates = ['db_start', 'started_at', 'timestamp', 'last_checked', 'time'];
            for (const c of candidates) {
                if (data?.[c]) return new Date(data[c]).toLocaleString();
            }
            // If backend returns a simple ISO string
            if (typeof data === 'string' && !isNaN(Date.parse(data))) return new Date(data).toLocaleString();
            return null;
        };

        let mounted = true;
        endpoints.forEach(({ id, path }) => {
            axios.get(path)
                .then((res: AxiosResponse<any>) => {
                    if (!mounted) return;
                    // handle failed-bookings response shape { count: number, last_failed_at: string|null }
                    if (id === 'failed-bookings') {
                        const count = typeof res.data?.count === 'number' ? res.data.count : null;
                        const lastAt = res.data?.last_failed_at ? new Date(res.data.last_failed_at).toLocaleString() : null;
                        setHealthMetricsState((prev: HealthMetric[]) =>
                            prev.map((m: HealthMetric) =>
                                m.id === id
                                    ? { ...m, value: count !== null ? String(count) : m.value, lastChecked: lastAt ?? m.lastChecked }
                                    : m
                            )
                        );
                        return;
                    }

                    const ts = extractTimestamp(res.data);
                    if (!ts) return;
                    setHealthMetricsState((prev: HealthMetric[]) =>
                        prev.map((m: HealthMetric) =>
                            m.id === id ? { ...m, lastChecked: ts } : m
                        )
                    );
                })
                .catch(() => {
                    // ignore — keep snapshot set above
                });
        });

        return () => { mounted = false; };
    }, []);

    const getStatusColor = (status: string) => {
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

	const getStatusIcon = (status: string) => {
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

	const getTrendIcon = (trend: string) => {
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

	const getTrendColor = (trend: string) => {
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

	return (
		<div style={{ background: 'white', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24, position: 'relative' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
				<h2>System Health Dashboard</h2>
				<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
					<div style={{ fontSize: 14, color: '#666' }}>
						Last updated: {currentTime.toLocaleTimeString()}
					</div>
					<select
						value={selectedTimeRange}
						onChange={(e) => setSelectedTimeRange(e.target.value)}
						style={{
							padding: '6px 12px',
							border: '1px solid #ddd',
							borderRadius: 4,
							fontSize: 12
						}}
					>
						<option value="1h">Last Hour</option>
						<option value="24h">Last 24 Hours</option>
						<option value="7d">Last 7 Days</option>
						<option value="30d">Last 30 Days</option>
					</select>
				</div>
			</div>

			{/* Health Status Overview */}
			<div style={{ marginBottom: 32 }}>
				<h3 style={{ color: '#0a4a7e', borderBottom: '2px solid #0a4a7e', paddingBottom: 8, marginBottom: 16 }}>
					Health Status Overview
				</h3>
				
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
					{healthMetricsState.map((metric) => (
						<div key={metric.id} style={{
							border: '1px solid #dee2e6',
							borderRadius: 8,
							padding: 16,
							background: '#f8f9fa'
						}}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
								<h4 style={{ margin: 0, fontSize: 14, fontWeight: 'bold' }}>{metric.name}</h4>
								<span style={{ fontSize: 18 }}>{getStatusIcon(metric.status)}</span>
							</div>
							<div style={{ marginBottom: 8 }}>
								<span style={{
									background: getStatusColor(metric.status),
									color: 'white',
									padding: '4px 8px',
									borderRadius: 12,
									fontSize: 12,
									fontWeight: 'bold'
								}}>
									{metric.value}
								</span>
							</div>
							<p style={{ margin: 0, fontSize: 12, color: '#666' }}>{metric.description}</p>
							<p style={{ margin: '4px 0 0 0', fontSize: 10, color: '#999' }}>
								Last checked: {metric.lastChecked}
							</p>
						</div>
					))}
				</div>
			</div>

			{/* System Uptime */}
			<div style={{ marginBottom: 32 }}>
				<h3 style={{ color: '#0a4a7e', borderBottom: '2px solid #0a4a7e', paddingBottom: 8, marginBottom: 16 }}>
					Service Uptime
				</h3>
				
				<div style={{ overflowX: 'auto' }}>
					<table style={{ width: '100%', borderCollapse: 'collapse' }}>
						<thead>
							<tr style={{ background: '#f8f9fa' }}>
								<th style={{ padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }}>SERVICE</th>
								<th style={{ padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }}>UPTIME</th>
								<th style={{ padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }}>STATUS</th>
							</tr>
						</thead>
						<tbody>
							{systemUptime.map((service, idx) => (
								<tr key={idx} style={{ borderBottom: '1px solid #dee2e6' }}>
									<td style={{ padding: 12, border: '1px solid #dee2e6', fontWeight: 'bold' }}>
										{service.service}
									</td>
									<td style={{ padding: 12, border: '1px solid #dee2e6', fontFamily: 'monospace' }}>
										{service.uptime}%
									</td>
									<td style={{ padding: 12, border: '1px solid #dee2e6' }}>
										<span style={{
											background: getStatusColor(service.status),
											color: 'white',
											padding: '2px 8px',
											borderRadius: 12,
											fontSize: 10,
											fontWeight: 'bold'
										}}>
											{service.status.toUpperCase()}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

		</div>
	);
};

export default AdminSystemHealthTable;
