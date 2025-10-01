
import React, { useState } from 'react';
import UserBookings from './UserBookings';

interface User {
	Name: string;
	phone: string;
	email: string;
	role: string;
	disabled: boolean;
}

const users: User[] = [
	{
		Name: 'FirstName LastName',
		phone: '123-456-7890',
		email: 'staff@example.com',
		role: 'Staff',
		disabled: false,
	},
];


const AccountManagementTable: React.FC = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedUserIdx, setSelectedUserIdx] = useState<number | null>(null);
	const [editRole, setEditRole] = useState('');
	const [editDisabled, setEditDisabled] = useState(false);
	const [showBookings, setShowBookings] = useState(false);


	const openModal = (idx: number) => {
		setSelectedUserIdx(idx);
		setEditRole(users[idx].role);
		setEditDisabled(users[idx].disabled);
		setModalOpen(true);
	};

	const openBookings = (idx: number) => {
		setSelectedUserIdx(idx);
		setShowBookings(true);
	};


	const closeModal = () => {
		setModalOpen(false);
		setSelectedUserIdx(null);
	};

	const closeBookings = () => {
		setShowBookings(false);
		setSelectedUserIdx(null);
	};

	const handleSave = () => {
		if (selectedUserIdx !== null) {
			users[selectedUserIdx].role = editRole;
			users[selectedUserIdx].disabled = editDisabled;
		}
		closeModal();
	};

	return (
		<div style={{ background: 'white', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24, position: 'relative' }}>
			<h2>Users</h2>
			<button style={{ background: '#2257bf', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px', marginBottom: 16 }}>Add User</button>
			<div style={{ overflowX: 'auto' }}>
				<table style={{ width: '100%', borderCollapse: 'collapse' }}>
					<thead>
						<tr style={{ background: '#0a4a7e', color: 'white' }}>
							<th style={{ padding: 8 }}>NAME</th>
							<th style={{ padding: 8 }}>PHONE</th>
							<th style={{ padding: 8 }}>E-MAIL</th>
							<th style={{ padding: 8 }}>ROLE</th>
							<th style={{ padding: 8 }}>DISABLED</th>
							<th style={{ padding: 8 }}>ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user, idx) => (
							<tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
								<td style={{ padding: 8 }}>{user.Name}</td>
								<td style={{ padding: 8 }}>{user.phone}</td>
								<td style={{ padding: 8 }}>{user.email}</td>
								<td style={{ padding: 8 }}>{user.role}</td>
								<td style={{ padding: 8 }}>{user.disabled ? 'Yes' : 'No'}</td>
								<td style={{ padding: 8 }}>
									<button style={{ marginRight: 4 }} onClick={() => openBookings(idx)}>View Bookings</button>
			{showBookings && selectedUserIdx !== null && (
				<UserBookings userName={users[selectedUserIdx].Name} onClose={closeBookings} />
			)}
									<button style={{ marginRight: 4 }}>Edit Info</button>
									<button style={{ marginRight: 4 }} onClick={() => openModal(idx)}>Change Permissions</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div style={{ marginTop: 12, textAlign: 'right', color: '#666' }}>1</div>

			{modalOpen && selectedUserIdx !== null && (
				<div style={{
					position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
					background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
				}}>
					<div style={{ background: 'white', borderRadius: 8, padding: 32, minWidth: 320, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
						<h3>Change Permissions</h3>
						<div style={{ marginBottom: 16 }}>
							<label style={{ fontWeight: 'bold' }}>Role:&nbsp;</label>
							<select value={editRole} onChange={e => setEditRole(e.target.value)} style={{ padding: 4 }}>
								<option value="Staff">Staff</option>
								<option value="Registrar">Registrar</option>
								<option value="Admin">Admin</option>
							</select>
						</div>
						<div style={{ marginBottom: 16 }}>
							<label style={{ fontWeight: 'bold' }}>Disabled:&nbsp;</label>
							<input type="checkbox" checked={editDisabled} onChange={e => setEditDisabled(e.target.checked)} />
						</div>
						<div style={{ textAlign: 'right' }}>
							<button onClick={closeModal} style={{ marginRight: 8 }}>Cancel</button>
							<button onClick={handleSave} style={{ background: '#2257bf', color: 'white', border: 'none', borderRadius: 4, padding: '6px 16px' }}>Save</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AccountManagementTable;


