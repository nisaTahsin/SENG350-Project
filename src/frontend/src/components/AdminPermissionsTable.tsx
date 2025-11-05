import React, { useEffect, useState } from 'react';
import UserBookings from './UserBookings';

interface AdminUser {
	id: number;
	username: string;
	email: string;
	role: string;
	disabled: boolean;
}

const AdminPermissionsTable: React.FC = () => {
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
	const [editRole, setEditRole] = useState('');
	const [editDisabled, setEditDisabled] = useState(false);
	const [showBookings, setShowBookings] = useState(false);

	useEffect(() => {
		const fetchUsers = async () => {
			setLoading(true);
			setError('');
			try {
				const response = await fetch('http://localhost:4000/users');
				const data = await response.json();
				const mapped: AdminUser[] = Array.isArray(data)
					? data.map((u: any) => ({
						id: u.id,
						username: u.username || '',
						email: u.email || '',
						role: u.role || '',
						disabled: u.isBlocked || false,
					}))
					: [];
				setUsers(mapped);
			} catch {
				setError('Failed to fetch users');
			}
			setLoading(false);
		};
		fetchUsers();
	}, []);

	const openModal = (userId: number) => {
		const u = users.find(x => x.id === userId);
		if (!u) return;
		setSelectedUserId(userId);
		setEditRole(u.role);
		setEditDisabled(u.disabled);
		setModalOpen(true);
	};

	const openBookings = (userId: number) => {
		setSelectedUserId(userId);
		setShowBookings(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setSelectedUserId(null);
	};

	const closeBookings = () => {
		setShowBookings(false);
		setSelectedUserId(null);
	};

	const handleSave = () => {
		if (selectedUserId === null) return;
		setUsers(prev => prev.map(u => u.id === selectedUserId ? { ...u, role: editRole, disabled: editDisabled } : u));
		closeModal();
	};

	// Filter users based on search term (only existing fields)
	const filteredUsers = users.filter(user =>
		(user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
		(user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
		(user.role?.toLowerCase() || '').includes(searchTerm.toLowerCase())
	);

	return (
		<div style={{ background: 'white', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24, position: 'relative' }}>
			<h2>Users</h2>
			
			{/* Search Bar */}
			<div style={{ marginBottom: 16 }}>
				<input
					type="text"
					placeholder="Search users by name, email, phone, or role..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					style={{
						width: '100%',
						padding: '8px 12px',
						border: '1px solid #ddd',
						borderRadius: 4,
						fontSize: 14
					}}
				/>
			</div>

			{loading ? (
				<div>Loading users...</div>
			) : error ? (
				<div style={{ color: 'red' }}>{error}</div>
			) : (
			<div style={{ overflowX: 'auto' }}>
				<table style={{ width: '100%', borderCollapse: 'collapse' }}>
					<thead>
						<tr style={{ background: '#0a4a7e', color: 'white' }}>
							<th style={{ padding: 8 }}>USERNAME</th>
							<th style={{ padding: 8 }}>E-MAIL</th>
							<th style={{ padding: 8 }}>ROLE</th>
							<th style={{ padding: 8 }}>DISABLED</th>
							<th style={{ padding: 8 }}>ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{filteredUsers.length > 0 ? (
							filteredUsers.map((user) => (
								<tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
									<td style={{ padding: 8 }}>{user.username}</td>
									<td style={{ padding: 8 }}>{user.email}</td>
									<td style={{ padding: 8 }}>{user.role}</td>
									<td style={{ padding: 8 }}>{user.disabled ? 'Yes' : 'No'}</td>
									<td style={{ padding: 8 }}>
											<button 
												style={{ 
													marginRight: 4, 
													background: '#2257bf', 
													color: 'white', 
													border: 'none', 
													borderRadius: 4, 
													padding: '4px 8px',
													cursor: 'pointer'
												}} 
											onClick={() => openBookings(user.id)}
											>
												View Bookings
											</button>
											<button 
												style={{ 
													marginRight: 4, 
													background: '#dc3545', 
													color: 'white', 
													border: 'none', 
													borderRadius: 4, 
													padding: '4px 8px',
													cursor: 'pointer'
												}}
											onClick={() => openModal(user.id)}
											>
												Change Permissions
											</button>
								</td>
							</tr>
							))
						) : (
							<tr>
								<td colSpan={5} style={{ padding: 16, textAlign: 'center', color: '#666' }}>
									No users found matching your search.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			)}
			
			<div style={{ marginTop: 12, textAlign: 'right', color: '#666' }}>
				Showing {filteredUsers.length} of {users.length} users
			</div>

			{showBookings && selectedUserId !== null && (
				<UserBookings userName={(users.find(u => u.id === selectedUserId)?.username) || ''} onClose={closeBookings} />
			)}

			{modalOpen && selectedUserId !== null && (
				<div style={{
					position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
					background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
				}}>
					<div style={{ background: 'white', borderRadius: 8, padding: 32, minWidth: 320, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
						<h3>Change Permissions</h3>
						<div style={{ marginBottom: 16 }}>
							<label style={{ fontWeight: 'bold' }}>Role:&nbsp;</label>
							<select value={editRole} onChange={e => setEditRole(e.target.value)} style={{ padding: 4, width: '100%', marginTop: 4 }}>
								<option value="staff">Staff</option>
								<option value="registrar">Registrar</option>
								<option value="admin">Admin</option>
							</select>
						</div>
						<div style={{ marginBottom: 16 }}>
							<label style={{ fontWeight: 'bold' }}>Disabled:&nbsp;</label>
							<input type="checkbox" checked={editDisabled} onChange={e => setEditDisabled(e.target.checked)} style={{ marginLeft: 8 }} />
						</div>
						<div style={{ textAlign: 'right' }}>
							<button 
								onClick={closeModal} 
								style={{ 
									marginRight: 8, 
									background: '#6c757d', 
									color: 'white', 
									border: 'none', 
									borderRadius: 4, 
									padding: '6px 16px',
									cursor: 'pointer'
								}}
							>
								Cancel
							</button>
							<button 
								onClick={handleSave} 
								style={{ 
									background: '#2257bf', 
									color: 'white', 
									border: 'none', 
									borderRadius: 4, 
									padding: '6px 16px',
									cursor: 'pointer'
								}}
							>
								Save
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminPermissionsTable;
