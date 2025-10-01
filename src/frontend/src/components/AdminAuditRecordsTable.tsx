import React, { useState } from 'react';

interface AuditRecord {
	id: string;
	timestamp: string;
	user: string;
	userRole: string;
	action: string;
	details: string;
	category: string;
}

const auditRecords: AuditRecord[] = [
	// Sign-ins
	{
		id: '1',
		timestamp: '2024-01-15 09:30:15',
		user: 'john.smith@example.com',
		userRole: 'Staff',
		action: 'Sign-in',
		details: 'Successful login from office network',
		category: 'Authentication'
	},
	{
		id: '2',
		timestamp: '2024-01-15 08:45:22',
		user: 'jane.doe@example.com',
		userRole: 'Registrar',
		action: 'Sign-in',
		details: 'Successful login from office network',
		category: 'Authentication'
	},
	{
		id: '3',
		timestamp: '2024-01-15 14:20:33',
		user: 'admin@example.com',
		userRole: 'Admin',
		action: 'Sign-in',
		details: 'Successful login from office network',
		category: 'Authentication'
	},
	// Bookings/Cancellations
	{
		id: '4',
		timestamp: '2024-01-15 10:15:45',
		user: 'john.smith@example.com',
		userRole: 'Staff',
		action: 'Booking Created',
		details: 'Booked Room A101 for 2024-01-16 14:00-16:00',
		category: 'Booking Management'
	},
	{
		id: '5',
		timestamp: '2024-01-15 11:30:12',
		user: 'alice.brown@example.com',
		userRole: 'Staff',
		action: 'Booking Cancelled',
		details: 'Cancelled booking for Room B205 on 2024-01-17 10:00-12:00',
		category: 'Booking Management'
	},
	{
		id: '6',
		timestamp: '2024-01-15 13:45:28',
		user: 'bob.johnson@example.com',
		userRole: 'Staff',
		action: 'Booking Created',
		details: 'Booked Room C301 for 2024-01-18 09:00-11:00',
		category: 'Booking Management'
	},
	// Role/Permission Changes
	{
		id: '7',
		timestamp: '2024-01-15 09:15:30',
		user: 'admin@example.com',
		userRole: 'Admin',
		action: 'Role Changed',
		details: 'Changed user mike.wilson@example.com from Staff to Registrar',
		category: 'User Management'
	},
	{
		id: '8',
		timestamp: '2024-01-15 10:30:45',
		user: 'admin@example.com',
		userRole: 'Admin',
		action: 'Account Disabled',
		details: 'Disabled account for user sarah.davis@example.com',
		category: 'User Management'
	},
	{
		id: '9',
		timestamp: '2024-01-15 11:45:12',
		user: 'admin@example.com',
		userRole: 'Admin',
		action: 'Account Enabled',
		details: 'Enabled account for user tom.wilson@example.com',
		category: 'User Management'
	},
	// Escalations
	{
		id: '10',
		timestamp: '2024-01-15 12:00:15',
		user: 'jane.doe@example.com',
		userRole: 'Registrar',
		action: 'Account Blocked',
		details: 'Blocked account for user problematic.user@example.com due to policy violations',
		category: 'Escalations'
	},
	{
		id: '11',
		timestamp: '2024-01-15 14:15:30',
		user: 'jane.doe@example.com',
		userRole: 'Registrar',
		action: 'Account Released',
		details: 'Released booking for user john.smith@example.com after review',
		category: 'Escalations'
	},
	// System Configuration Edits
	{
		id: '12',
		timestamp: '2024-01-15 08:30:45',
		user: 'admin@example.com',
		userRole: 'Admin',
		action: 'Config Changed',
		details: 'Changed max bookings per day from 2 to 3',
		category: 'System Configuration'
	},
	{
		id: '13',
		timestamp: '2024-01-15 15:20:18',
		user: 'admin@example.com',
		userRole: 'Admin',
		action: 'Config Changed',
		details: 'Changed time slot granularity from 60 to 30 minutes',
		category: 'System Configuration'
	},
	{
		id: '14',
		timestamp: '2024-01-15 16:45:22',
		user: 'admin@example.com',
		userRole: 'Admin',
		action: 'Config Changed',
		details: 'Changed default classroom open time from 07:00 to 08:00',
		category: 'System Configuration'
	}
];

const AdminAuditRecordsTable: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedUser, setSelectedUser] = useState('');
	const [selectedRole, setSelectedRole] = useState('');
	const [selectedAction, setSelectedAction] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	// Get unique values for filters
	const uniqueUsers = Array.from(new Set(auditRecords.map(record => record.user)));
	const uniqueRoles = Array.from(new Set(auditRecords.map(record => record.userRole)));
	const uniqueActions = Array.from(new Set(auditRecords.map(record => record.action)));
	const uniqueCategories = Array.from(new Set(auditRecords.map(record => record.category)));

	// Filter records based on all criteria
	const filteredRecords = auditRecords.filter(record => {
		const matchesSearch = record.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
			record.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
			record.details.toLowerCase().includes(searchTerm.toLowerCase());
		
		const matchesUser = !selectedUser || record.user === selectedUser;
		const matchesRole = !selectedRole || record.userRole === selectedRole;
		const matchesAction = !selectedAction || record.action === selectedAction;
		const matchesCategory = !selectedCategory || record.category === selectedCategory;
		
		const recordDate = new Date(record.timestamp);
		const matchesStartDate = !startDate || recordDate >= new Date(startDate);
		const matchesEndDate = !endDate || recordDate <= new Date(endDate + ' 23:59:59');
		
		return matchesSearch && matchesUser && matchesRole && matchesAction && matchesCategory && matchesStartDate && matchesEndDate;
	});

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'Authentication': return '#007bff';
			case 'Booking Management': return '#28a745';
			case 'User Management': return '#ffc107';
			case 'Escalations': return '#dc3545';
			case 'System Configuration': return '#6f42c1';
			default: return '#6c757d';
		}
	};

	const getActionIcon = (action: string) => {
		switch (action) {
			case 'Sign-in': return '🔐';
			case 'Booking Created': return '📅';
			case 'Booking Cancelled': return '❌';
			case 'Role Changed': return '👤';
			case 'Account Disabled': return '🚫';
			case 'Account Enabled': return '✅';
			case 'Account Blocked': return '🔒';
			case 'Account Released': return '🔓';
			case 'Config Changed': return '⚙️';
			default: return '📝';
		}
	};

	const clearFilters = () => {
		setSearchTerm('');
		setSelectedUser('');
		setSelectedRole('');
		setSelectedAction('');
		setSelectedCategory('');
		setStartDate('');
		setEndDate('');
	};

	return (
		<div style={{ background: 'white', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24, position: 'relative' }}>
			<h2>Audit Records</h2>
			
			{/* Search and Filters */}
			<div style={{ marginBottom: 24, padding: 16, background: '#f8f9fa', borderRadius: 8, border: '1px solid #dee2e6' }}>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
					<div>
						<label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>Search</label>
						<input
							type="text"
							placeholder="Search records..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							style={{
								width: '100%',
								padding: '6px 8px',
								border: '1px solid #ddd',
								borderRadius: 4,
								fontSize: 12
							}}
						/>
					</div>
					
					<div>
						<label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>User</label>
						<select
							value={selectedUser}
							onChange={(e) => setSelectedUser(e.target.value)}
							style={{
								width: '100%',
								padding: '6px 8px',
								border: '1px solid #ddd',
								borderRadius: 4,
								fontSize: 12
							}}
						>
							<option value="">All Users</option>
							{uniqueUsers.map(user => (
								<option key={user} value={user}>{user}</option>
							))}
						</select>
					</div>
					
					<div>
						<label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>Role</label>
						<select
							value={selectedRole}
							onChange={(e) => setSelectedRole(e.target.value)}
							style={{
								width: '100%',
								padding: '6px 8px',
								border: '1px solid #ddd',
								borderRadius: 4,
								fontSize: 12
							}}
						>
							<option value="">All Roles</option>
							{uniqueRoles.map(role => (
								<option key={role} value={role}>{role}</option>
							))}
						</select>
					</div>
					
					<div>
						<label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>Action</label>
						<select
							value={selectedAction}
							onChange={(e) => setSelectedAction(e.target.value)}
							style={{
								width: '100%',
								padding: '6px 8px',
								border: '1px solid #ddd',
								borderRadius: 4,
								fontSize: 12
							}}
						>
							<option value="">All Actions</option>
							{uniqueActions.map(action => (
								<option key={action} value={action}>{action}</option>
							))}
						</select>
					</div>
					
					<div>
						<label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>Category</label>
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							style={{
								width: '100%',
								padding: '6px 8px',
								border: '1px solid #ddd',
								borderRadius: 4,
								fontSize: 12
							}}
						>
							<option value="">All Categories</option>
							{uniqueCategories.map(category => (
								<option key={category} value={category}>{category}</option>
							))}
						</select>
					</div>
				</div>
				
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end' }}>
					<div>
						<label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>Start Date</label>
						<input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							style={{
								width: '100%',
								padding: '6px 8px',
								border: '1px solid #ddd',
								borderRadius: 4,
								fontSize: 12
							}}
						/>
					</div>
					
					<div>
						<label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>End Date</label>
						<input
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							style={{
								width: '100%',
								padding: '6px 8px',
								border: '1px solid #ddd',
								borderRadius: 4,
								fontSize: 12
							}}
						/>
					</div>
					
					<button
						onClick={clearFilters}
						style={{
							background: '#6c757d',
							color: 'white',
							border: 'none',
							borderRadius: 4,
							padding: '6px 12px',
							cursor: 'pointer',
							fontSize: 12
						}}
					>
						Clear Filters
					</button>
				</div>
			</div>

			{/* Results Summary */}
			<div style={{ marginBottom: 16, color: '#666', fontSize: 14 }}>
				Showing {filteredRecords.length} of {auditRecords.length} records
			</div>

			{/* Audit Records Table */}
			<div style={{ overflowX: 'auto' }}>
				<table style={{ width: '100%', borderCollapse: 'collapse' }}>
					<thead>
						<tr style={{ background: '#0a4a7e', color: 'white' }}>
							<th style={{ padding: 12, textAlign: 'left' }}>TIMESTAMP</th>
							<th style={{ padding: 12, textAlign: 'left' }}>USER</th>
							<th style={{ padding: 12, textAlign: 'left' }}>ROLE</th>
							<th style={{ padding: 12, textAlign: 'left' }}>ACTION</th>
							<th style={{ padding: 12, textAlign: 'left' }}>DETAILS</th>
							<th style={{ padding: 12, textAlign: 'left', minWidth: 150 }}>CATEGORY</th>
						</tr>
					</thead>
					<tbody>
						{filteredRecords.length > 0 ? (
							filteredRecords.map((record) => (
								<tr key={record.id} style={{ borderBottom: '1px solid #dee2e6' }}>
									<td style={{ padding: 12, fontSize: 12, fontFamily: 'monospace' }}>
										{record.timestamp}
									</td>
									<td style={{ padding: 12, fontWeight: 'bold' }}>
										{record.user}
									</td>
									<td style={{ padding: 12 }}>
										<span style={{
											background: record.userRole === 'Admin' ? '#dc3545' : 
														record.userRole === 'Registrar' ? '#ffc107' : '#28a745',
											color: 'white',
											padding: '2px 6px',
											borderRadius: 12,
											fontSize: 10,
											fontWeight: 'bold'
										}}>
											{record.userRole}
										</span>
									</td>
									<td style={{ padding: 12 }}>
										<span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
											{getActionIcon(record.action)}
											{record.action}
										</span>
									</td>
									<td style={{ padding: 12, maxWidth: 300, wordWrap: 'break-word' }}>
										{record.details}
									</td>
									<td style={{ padding: 12, minWidth: 150, whiteSpace: 'nowrap' }}>
										<span style={{
											background: getCategoryColor(record.category),
											color: 'white',
											padding: '4px 12px',
											borderRadius: 12,
											fontSize: 11,
											fontWeight: 'bold',
											display: 'inline-block'
										}}>
											{record.category}
										</span>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#666' }}>
									No audit records found matching your criteria.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AdminAuditRecordsTable;
