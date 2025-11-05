import React, { useState, useEffect } from 'react';
import UserBookings from './UserBookings';

interface User {
  id: number;
  name: string; // Change Name to name
	phone: string;
	email: string;
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
	const [users, setUsers] = useState<User[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedUserIdx, setSelectedUserIdx] = useState<number | null>(null);
	const [showBookings, setShowBookings] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchUsers = async () => {
			setLoading(true);
			setError('');
			try {
				const response = await fetch('http://localhost:4000/users');
				const data = await response.json();
				// Map backend data to frontend format
				const mappedUsers = Array.isArray(data) ? data.map((user: any) => ({
					id: user.id,
					name: user.username || user.name || '',
					phone: user.phone || '',
					email: user.email || '',
					disabled: user.isBlocked || user.disabled || false
				})) : [];
				setUsers(mappedUsers);
			} catch {
				setError('Failed to fetch users');
			}
			setLoading(false);
		};
		fetchUsers();
	}, []);

	const handleBlockUser = async (id: number) => {
		try {
			await fetch(`http://localhost:4000/users/${id}/block`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ blockedBy: 1 }), // Replace with actual registrar ID
			});
			setUsers(prev => prev.map(u => u.id === id ? { ...u, disabled: true } : u));
		} catch {
			setError('Failed to block user');
		}
	};

	const handleUnblockUser = async (id: number) => {
		try {
			await fetch(`http://localhost:4000/users/${id}/unblock`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ unblockedBy: 1 }), // Replace with actual registrar ID
			});
			setUsers(prev => prev.map(u => u.id === id ? { ...u, disabled: false } : u));
		} catch {
			setError('Failed to unblock user');
		}
	};

	const handleDeleteUser = async (id: number) => {
		try {
			await fetch(`http://localhost:4000/users/${id}`, { method: 'DELETE' });
			setUsers(prev => prev.filter(u => u.id !== id));
		} catch {
			setError('Failed to delete user');
		}
	};


	const openBookings = (idx: number) => {
		setSelectedUserIdx(idx);
		setShowBookings(true);
	};

	const closeBookings = () => {
		setShowBookings(false);
		setSelectedUserIdx(null);
	};

	// Filter users based on search term
	const filteredUsers = users.filter(user =>
		(user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
		(user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
		(user.phone || '').includes(searchTerm)
	);

	return (
		<div style={{ background: 'white', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24, position: 'relative' }}>
			<h2>Users</h2>
			{/* Search Bar */}
			<div style={{ marginBottom: 16 }}>
				<input
					type="text"
					placeholder="Search users by name, email, or phone..."
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
								<th style={{ padding: 8 }}>NAME</th>
								<th style={{ padding: 8 }}>PHONE</th>
								<th style={{ padding: 8 }}>E-MAIL</th>
								<th style={{ padding: 8 }}>DISABLED</th>
								<th style={{ padding: 8 }}>ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.length > 0 ? (
								filteredUsers.map((user, idx) => (
									<tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
										<td style={{ padding: 8 }}>{user.name}</td>
										<td style={{ padding: 8 }}>{user.phone}</td>
										<td style={{ padding: 8 }}>{user.email}</td>
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
												onClick={() => openBookings(idx)}
											>
												View Bookings
											</button>
											{user.disabled ? (
												<button
													style={{
														marginRight: 4,
														background: '#ffc107',
														color: 'black',
														border: 'none',
														borderRadius: 4,
														padding: '4px 8px',
														cursor: 'pointer'
													}}
													onClick={() => handleUnblockUser(user.id)}
												>
													Unblock
												</button>
											) : (
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
													onClick={() => handleBlockUser(user.id)}
												>
													Block
												</button>
											)}
											<button
												style={{
													background: '#6c757d',
													color: 'white',
													border: 'none',
													borderRadius: 4,
													padding: '4px 8px',
													cursor: 'pointer'
												}}
												onClick={() => handleDeleteUser(user.id)}
											>
												Delete
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
			{showBookings && selectedUserIdx !== null && filteredUsers[selectedUserIdx] && (
				<UserBookings userName={filteredUsers[selectedUserIdx].name} onClose={closeBookings} />
			)}
		</div>
	);
};

export default RegistrarAccountManagementTable;
