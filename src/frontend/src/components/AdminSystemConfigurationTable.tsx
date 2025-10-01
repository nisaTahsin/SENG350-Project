import React, { useState } from 'react';

interface SystemConfig {
	id: string;
	category: string;
	setting: string;
	value: string | number | boolean;
	description: string;
}

const systemConfigs: SystemConfig[] = [
	// Booking Policies
	{
		id: 'max-bookings-per-day',
		category: 'Booking Policies',
		setting: 'Max Bookings Per Staff Per Day',
		value: 3,
		description: 'Maximum number of bookings a staff member can make per day'
	},
	{
		id: 'cancellation-cutoff-hours',
		category: 'Booking Policies',
		setting: 'Cancellation Cutoff (Hours)',
		value: 24,
		description: 'Hours before booking start time when cancellation is no longer allowed'
	},
	{
		id: 'booking-horizon-days',
		category: 'Booking Policies',
		setting: 'Booking Horizon (Days)',
		value: 30,
		description: 'How many days in advance staff can make bookings'
	},
	// Time Slot Configuration
	{
		id: 'time-slot-granularity',
		category: 'Time Slot Configuration',
		setting: 'Time Slot Granularity (Minutes)',
		value: 30,
		description: 'Duration of each time slot (30 or 60 minutes)'
	},
	// Default Classroom Times
	{
		id: 'default-open-time',
		category: 'Default Classroom Times',
		setting: 'Default Open Time',
		value: '08:00',
		description: 'Global fallback opening time for all classrooms'
	},
	{
		id: 'default-close-time',
		category: 'Default Classroom Times',
		setting: 'Default Close Time',
		value: '22:00',
		description: 'Global fallback closing time for all classrooms'
	},
];

const AdminSystemConfigurationTable: React.FC = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedConfigIdx, setSelectedConfigIdx] = useState<number | null>(null);
	const [editValue, setEditValue] = useState<string | number | boolean>('');
	const [editType, setEditType] = useState<'text' | 'number' | 'boolean' | 'select'>('text');

	const openModal = (idx: number) => {
		setSelectedConfigIdx(idx);
		const config = systemConfigs[idx];
		setEditValue(config.value);
		
		// Determine input type based on setting
		if (config.setting.includes('Enabled') || config.setting.includes('Calendars')) {
			setEditType('boolean');
		} else if (config.setting.includes('Provider')) {
			setEditType('select');
		} else if (config.setting.includes('Time')) {
			setEditType('text');
		} else {
			setEditType('number');
		}
		
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setSelectedConfigIdx(null);
	};

	const handleSave = () => {
		if (selectedConfigIdx !== null) {
			systemConfigs[selectedConfigIdx].value = editValue;
		}
		closeModal();
	};

	// Group configs by category
	const groupedConfigs = systemConfigs.reduce((acc, config) => {
		if (!acc[config.category]) {
			acc[config.category] = [];
		}
		acc[config.category].push(config);
		return acc;
	}, {} as Record<string, SystemConfig[]>);

	const getValueDisplay = (value: string | number | boolean) => {
		if (typeof value === 'boolean') {
			return value ? 'Enabled' : 'Disabled';
		}
		return value.toString();
	};

	const getSelectOptions = (setting: string) => {
		if (setting.includes('Provider')) {
			return ['Internal', 'LDAP', 'OAuth', 'SAML'];
		}
		if (setting.includes('Granularity')) {
			return [15, 30, 60];
		}
		return [];
	};

	return (
		<div style={{ background: 'white', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24, position: 'relative' }}>
			<h2>System Configuration</h2>

			{/* Configuration Sections */}
			{Object.entries(groupedConfigs).map(([category, configs]) => (
				<div key={category} style={{ marginBottom: 32 }}>
					<h3 style={{ 
						color: '#0a4a7e', 
						borderBottom: '2px solid #0a4a7e', 
						paddingBottom: 8, 
						marginBottom: 16 
					}}>
						{category}
					</h3>
					
					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
							<thead>
								<tr style={{ background: '#f8f9fa' }}>
									<th style={{ padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }}>SETTING</th>
									<th style={{ padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }}>CURRENT VALUE</th>
									<th style={{ padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }}>DESCRIPTION</th>
									<th style={{ padding: 12, textAlign: 'center', border: '1px solid #dee2e6' }}>ACTIONS</th>
								</tr>
							</thead>
							<tbody>
								{configs.map((config, idx) => {
									const originalIdx = systemConfigs.findIndex(c => c.id === config.id);
									return (
										<tr key={config.id} style={{ borderBottom: '1px solid #dee2e6' }}>
											<td style={{ padding: 12, border: '1px solid #dee2e6', fontWeight: 'bold' }}>
												{config.setting}
											</td>
											<td style={{ padding: 12, border: '1px solid #dee2e6' }}>
												<span style={{ 
													background: config.value ? '#d4edda' : '#f8d7da', 
													color: config.value ? '#155724' : '#721c24',
													padding: '4px 8px',
													borderRadius: 4,
													fontSize: 12,
													fontWeight: 'bold'
												}}>
													{getValueDisplay(config.value)}
												</span>
											</td>
											<td style={{ padding: 12, border: '1px solid #dee2e6', color: '#666' }}>
												{config.description}
											</td>
											<td style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center' }}>
												<button 
													style={{ 
														background: '#2257bf', 
														color: 'white', 
														border: 'none', 
														borderRadius: 4, 
														padding: '6px 12px',
														cursor: 'pointer',
														fontSize: 12
													}}
													onClick={() => openModal(originalIdx)}
												>
													Edit
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			))}


			{modalOpen && selectedConfigIdx !== null && (
				<div style={{
					position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
					background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
				}}>
					<div style={{ background: 'white', borderRadius: 8, padding: 32, minWidth: 400, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
						<h3>Edit Configuration</h3>
						<p style={{ color: '#666', marginBottom: 16 }}>
							{systemConfigs[selectedConfigIdx]?.description}
						</p>
						
						<div style={{ marginBottom: 16 }}>
							<label style={{ fontWeight: 'bold', display: 'block', marginBottom: 8 }}>
								{systemConfigs[selectedConfigIdx]?.setting}:
							</label>
							
							{editType === 'boolean' ? (
								<label style={{ display: 'flex', alignItems: 'center' }}>
									<input 
										type="checkbox" 
										checked={editValue as boolean} 
										onChange={e => setEditValue(e.target.checked)}
										style={{ marginRight: 8 }}
									/>
									{editValue ? 'Enabled' : 'Disabled'}
								</label>
							) : editType === 'select' ? (
								<select 
									value={editValue as string} 
									onChange={e => setEditValue(e.target.value)}
									style={{ padding: 8, width: '100%', border: '1px solid #ddd', borderRadius: 4 }}
								>
									{getSelectOptions(systemConfigs[selectedConfigIdx]?.setting || '').map(option => (
										<option key={option} value={option}>{option}</option>
									))}
								</select>
							) : (
								<input
									type={editType}
									value={editValue as string | number}
									onChange={e => setEditValue(editType === 'number' ? Number(e.target.value) : e.target.value)}
									style={{ padding: 8, width: '100%', border: '1px solid #ddd', borderRadius: 4 }}
								/>
							)}
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
									padding: '8px 16px',
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
									padding: '8px 16px',
									cursor: 'pointer'
								}}
							>
								Save Changes
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminSystemConfigurationTable;
