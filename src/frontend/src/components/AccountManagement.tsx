
import React from 'react';

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

const AccountManagementTable: React.FC = () => (
	<div style={{ background: 'white', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24 }}>
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
								<button style={{ marginRight: 4 }}>View Bookings</button>
								<button style={{ marginRight: 4 }}>Edit Info</button>
								<button style={{ marginRight: 4 }}>Change Permissions</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
		<div style={{ marginTop: 12, textAlign: 'right', color: '#666' }}>1</div>
	</div>
);

export default AccountManagementTable;


