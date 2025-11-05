import React, { useEffect, useState } from 'react';
import UserBookings from './UserBookings';

interface RegistrarUser {
	id: number;
	username: string;
	email: string;
	role: string;
	disabled: boolean;
}

// Remove static users array, only use backend data
// const users: User[] = [
// 	{
// 		Name: 'FirstName LastName',
// 		phone: '123-456-7890',
// 		email: 'staff@example.com',
// 		disabled: false,
// 	},
// 	{
// 		Name: 'John Smith',
// 		phone: '234-567-8901',
// 		email: 'john.smith@example.com',
// 		disabled: false,
// 	},
// 	{
// 		Name: 'Jane Doe',
// 		phone: '345-678-9012',
// 		email: 'jane.doe@example.com',
// 		disabled: false,
// 	},
// 	{
// 		Name: 'Bob Johnson',
// 		phone: '456-789-0123',
// 		email: 'bob.johnson@example.com',
// 		disabled: true,
// 	},
// 	{
// 		Name: 'Alice Brown',
// 		phone: '567-890-1234',
// 		email: 'alice.brown@example.com',
// 		disabled: false,
// 	},
// ];

const RegistrarAccountManagementTable: React.FC = () => {
	const [users, setUsers] = useState<RegistrarUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
	const [editDisabled, setEditDisabled] = useState(false);
	const [showBookings, setShowBookings] = useState(false);

	const fetchUsers = async () => {
		setLoading(true);
		setError('');
		try {
			const response = await fetch('http://localhost:4000/users');
			const data = await response.json();
			const mapped: RegistrarUser[] = Array.isArray(data)
				? data
					.map((u: any) => ({
						id: u.id,
						username: u.username || '',
						email: u.email || '',
						role: u.role || '',
						disabled: u.isBlocked || false,
					}))
					.filter((u: RegistrarUser) => u.role.toLowerCase() === 'staff')
				: [];
			setUsers(mapped);
		} catch {
			setError('Failed to fetch users');
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const openModal = (userId: number) => {
		const u = users.find(x => x.id === userId);
		if (!u) return;
		setSelectedUserId(userId);
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

	const handleSave = async () => {
		if (selectedUserId === null) return;
		const currentUser = users.find(u => u.id === selectedUserId);
		if (!currentUser) return;

		// Only make API call if the disabled state actually changed
		if (currentUser.disabled !== editDisabled) {
			try {
				if (editDisabled) {
					// Block the user
					await fetch(`http://localhost:4000/users/${selectedUserId}/block`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ blockedBy: 1 }),
					});
				} else {
					// Unblock the user
					await fetch(`http://localhost:4000/users/${selectedUserId}/unblock`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ unblockedBy: 1 }),
					});
				}
				// Refresh the user list to get the updated state from backend
				await fetchUsers();
			} catch {
				setError('Failed to update user status');
			}
		}
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
											Block User
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
						<h3>Block User</h3>
						<p style={{ marginTop: 8, marginBottom: 12 }}>Tick the box to block this user, then press Confirm.</p>
						<div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
							<input id="block-user-checkbox" type="checkbox" checked={editDisabled} onChange={e => setEditDisabled(e.target.checked)} />
							<label htmlFor="block-user-checkbox" style={{ marginLeft: 8 }}>Block this user</label>
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
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default RegistrarAccountManagementTable;
