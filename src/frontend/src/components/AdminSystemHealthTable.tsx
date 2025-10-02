import React, { useState, useEffect } from 'react';

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

const systemUptime: SystemUptime[] = [
	{ service: 'Database', uptime: 99.9, status: 'up' },
	{ service: 'API Gateway', uptime: 99.7, status: 'up' },
	{ service: 'Booking Service', uptime: 98.5, status: 'degraded' },
	{ service: 'Authentication', uptime: 99.8, status: 'up' },
	{ service: 'File Storage', uptime: 99.6, status: 'up' }
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

	// Update time every second
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(timer);
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
					{healthMetrics.map((metric) => (
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
								<th style={{ padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }}>VISUAL</th>
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
									<td style={{ padding: 12, border: '1px solid #dee2e6' }}>
										<div style={{
											width: '100%',
											height: 8,
											background: '#e9ecef',
											borderRadius: 4,
											overflow: 'hidden'
										}}>
											<div style={{
												width: `${service.uptime}%`,
												height: '100%',
												background: getStatusColor(service.status),
												transition: 'width 0.3s ease'
											}} />
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Performance Metrics */}
			<div style={{ marginBottom: 32 }}>
				<h3 style={{ color: '#0a4a7e', borderBottom: '2px solid #0a4a7e', paddingBottom: 8, marginBottom: 16 }}>
					Performance Metrics
				</h3>
				
				<div style={{ overflowX: 'auto' }}>
					<table style={{ width: '100%', borderCollapse: 'collapse' }}>
						<thead>
							<tr style={{ background: '#f8f9fa' }}>
								<th style={{ padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }}>METRIC</th>
								<th style={{ padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }}>VALUE</th>
								<th style={{ padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }}>TREND</th>
								<th style={{ padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }}>STATUS</th>
							</tr>
						</thead>
						<tbody>
							{performanceMetrics.map((metric, idx) => (
								<tr key={idx} style={{ borderBottom: '1px solid #dee2e6' }}>
									<td style={{ padding: 12, border: '1px solid #dee2e6', fontWeight: 'bold' }}>
										{metric.metric}
									</td>
									<td style={{ padding: 12, border: '1px solid #dee2e6', fontFamily: 'monospace' }}>
										{metric.value} {metric.unit}
									</td>
									<td style={{ padding: 12, border: '1px solid #dee2e6' }}>
										<span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
											<span style={{ fontSize: 16 }}>{getTrendIcon(metric.trend)}</span>
											<span style={{ 
												color: getTrendColor(metric.trend),
												fontSize: 12,
												fontWeight: 'bold'
											}}>
												{metric.trend.toUpperCase()}
											</span>
										</span>
									</td>
									<td style={{ padding: 12, border: '1px solid #dee2e6' }}>
										<span style={{
											background: metric.trend === 'up' ? '#dc3545' : 
														metric.trend === 'down' ? '#28a745' : '#6c757d',
											color: 'white',
											padding: '2px 8px',
											borderRadius: 12,
											fontSize: 10,
											fontWeight: 'bold'
										}}>
											{metric.trend === 'up' ? 'HIGH' : 
											 metric.trend === 'down' ? 'IMPROVING' : 'STABLE'}
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
