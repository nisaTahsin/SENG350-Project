import React, { useState, useEffect, useCallback } from 'react';

interface AuditRecord {
    id: string;
    timestamp: string;
    user: string;
    userRole: string;
    action: string;
    details: string;
    category: string;
    targetType?: string;
    targetId?: number;
}

interface FilterOptions {
    actions: string[];
    targetTypes: string[];
    users: Array<{ id: number; username: string; email: string; role: string }>;
    categories: string[];
}

const API_BASE_URL = 'http://localhost:4000';

const AdminAuditRecordsTable: React.FC = () => {
    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedAction, setSelectedAction] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Backend integration state
    const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        actions: [],
        targetTypes: [],
        users: [],
        categories: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // Test backend connection - no authentication needed
    const testBackendConnection = async () => {
        console.log('=== Testing Backend Connection ===');

        try {
            // Test 1: Backend health check
            console.log('🔍 Testing backend health...');
            const healthResponse = await fetch(`${API_BASE_URL}/auth/test`);
            console.log('✅ Backend health status:', healthResponse.status);
            
            if (!healthResponse.ok) {
                const healthText = await healthResponse.text();
                console.log('Health response body:', healthText);
                throw new Error(`Backend health check failed: ${healthResponse.status} - ${healthText}`);
            }
        } catch (error) {
            console.error('❌ Backend health check failed:', error);
            alert('❌ Backend server is not responding. Please ensure your backend is running on port 4000.');
            return;
        }

        try {
            // Test 2: Public audit filters endpoint
            console.log('🔍 Testing public audit filters endpoint...');
            
            const filtersResponse = await fetch(`${API_BASE_URL}/audit/filters`);
            console.log('Filters response status:', filtersResponse.status);
            
            const filtersData = await filtersResponse.json();
            console.log('✅ Filters endpoint response:', filtersData);
            
            if (filtersData.success) {
                alert(`✅ Audit endpoint works! Found ${filtersData.data.users?.length || 0} users and ${filtersData.data.actions?.length || 0} actions.`);
            } else {
                alert(`❌ Audit endpoint failed: ${filtersData.message || 'Unknown error'}`);
            }
        } catch (error: any) {
            console.error('❌ Audit endpoint failed:', error);
            alert(`❌ Audit endpoint failed: ${error.message}`);
        }
    };

    // Fetch audit records without authentication
    const fetchAuditRecords = useCallback(async () => {
        setLoading(true);
        setError('');
        
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (selectedUser) params.append('userEmail', selectedUser);
            if (selectedRole) params.append('role', selectedRole);
            if (selectedAction) params.append('action', selectedAction);
            if (selectedCategory) params.append('category', selectedCategory);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            params.append('page', currentPage.toString());
            params.append('limit', '50');

            console.log('🔍 Fetching audit records with params:', params.toString());

            const response = await fetch(`${API_BASE_URL}/audit?${params}`);

            console.log('Audit records response status:', response.status);

            const data = await response.json();
            console.log('✅ Audit records response:', data);

            if (!data.success) {
                setError(data.message || 'Failed to load audit records');
                return;
            }

            const records: AuditRecord[] = data.data?.logs || [];
            setAuditRecords(records);
            setTotalPages(data.data?.pagination?.totalPages || 1);
            setTotalRecords(data.data?.pagination?.total || 0);
            
            if (records.length === 0 && currentPage === 1) {
                setError('No audit records found. This might be because the database is empty or your filters are too restrictive.');
            }
        } catch (err: any) {
            console.error('❌ Error fetching audit records:', err);
            if (err.message.includes('Failed to fetch')) {
                setError('Cannot connect to backend server. Please check if the backend is running.');
            } else {
                setError(err.message || 'Unexpected error loading audit records');
            }
        } finally {
            setLoading(false);
        }
    }, [searchTerm, selectedUser, selectedRole, selectedAction, selectedCategory, startDate, endDate, currentPage]);

    // Fetch filter options without authentication
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                console.log('🔍 Fetching filter options...');
                const response = await fetch(`${API_BASE_URL}/audit/filters`);
                
                console.log('Filter options response status:', response.status);
                
                const data = await response.json();
                console.log('✅ Filter options response:', data);
                
                if (data.success) {
                    setFilterOptions(data.data);
                } else {
                    console.warn('⚠️ Filter options request succeeded but returned success: false', data);
                }
            } catch (err: any) {
                console.error('❌ Error fetching filter options:', err);
                console.warn('⚠️ Failed to load filter options, but continuing with empty options');
            }
        };

        fetchFilterOptions();
    }, []);

    // Fetch records when filters change
    useEffect(() => {
        fetchAuditRecords();
    }, [fetchAuditRecords]);

    // Get unique values for filters
    const uniqueUsers = Array.from(new Set(filterOptions.users.map((u: { email?: string; username: string }) => u.email || u.username)));
    const uniqueRoles = ['admin', 'registrar', 'staff'];
    const uniqueActions = filterOptions.actions;
    const uniqueCategories = filterOptions.categories;

    // Apply client-side role and category filtering
    const filteredRecords = auditRecords.filter((record: AuditRecord) => {
        const matchesRole = !selectedRole || record.userRole.toLowerCase() === selectedRole.toLowerCase();
        const matchesCategory = !selectedCategory || record.category === selectedCategory;
        return matchesRole && matchesCategory;
    });

    const getCategoryColor = (category: string): string => {
        switch (category) {
            case 'Authentication': return '#007bff';
            case 'Booking Management': return '#28a745';
            case 'User Management': return '#ffc107';
            case 'Room Management': return '#17a2b8';
            case 'Maintenance': return '#fd7e14';
            case 'Escalations': return '#dc3545';
            case 'System Configuration': return '#6f42c1';
            default: return '#6c757d';
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
        setCurrentPage(1);
    };

    if (loading && auditRecords.length === 0) {
        return (
            <div style={{ background: 'white', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24 }}>
                <h2>Audit Records</h2>
                <p>Loading audit records...</p>
            </div>
        );
    }

    return (
        <div style={{ background: 'white', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2>Audit Records</h2>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                        onClick={testBackendConnection}
                        style={{
                            padding: '6px 12px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 12
                        }}
                    >
                        Test Connection
                    </button>
                    
                    <button
                        onClick={fetchAuditRecords}
                        disabled={loading}
                        style={{
                            padding: '6px 12px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: 12
                        }}
                    >
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* Error display */}
            {error && (
                <div style={{ 
                    background: '#f8d7da', 
                    color: '#721c24', 
                    padding: 12, 
                    borderRadius: 4, 
                    marginBottom: 16,
                    border: '1px solid #f5c6cb'
                }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Data source indicator */}
            <div style={{ 
                background: '#d1ecf1', 
                color: '#0c5460',
                padding: 8, 
                borderRadius: 4, 
                marginBottom: 16,
                fontSize: 12,
                fontWeight: 'bold'
            }}>
                📊 Showing audit data from database
            </div>
            
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
                            {uniqueUsers.map((user: string) => (
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
                            {uniqueRoles.map((role: string) => (
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
                            {uniqueActions.map((action: string) => (
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
                            {uniqueCategories.map((category: string) => (
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

            {/* Results Summary and Pagination */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ color: '#666', fontSize: 14 }}>
                    Showing {filteredRecords.length} of {totalRecords} records
                    {loading && <span> (loading...)</span>}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button
                            onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                            disabled={currentPage === 1 || loading}
                            style={{
                                padding: '4px 8px',
                                border: '1px solid #ddd',
                                background: currentPage === 1 ? '#f8f9fa' : 'white',
                                borderRadius: 4,
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Previous
                        </button>
                        <span style={{ fontSize: 12 }}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || loading}
                            style={{
                                padding: '4px 8px',
                                border: '1px solid #ddd',
                                background: currentPage === totalPages ? '#f8f9fa' : 'white',
                                borderRadius: 4,
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Audit Records Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#0a4a7e', color: 'white' }}>
                            <th style={{ padding: 12, textAlign: 'left', fontSize: 12 }}>Timestamp</th>
                            <th style={{ padding: 12, textAlign: 'left', fontSize: 12 }}>User</th>
                            <th style={{ padding: 12, textAlign: 'left', fontSize: 12 }}>Role</th>
                            <th style={{ padding: 12, textAlign: 'left', fontSize: 12 }}>Action</th>
                            <th style={{ padding: 12, textAlign: 'left', fontSize: 12 }}>Category</th>
                            <th style={{ padding: 12, textAlign: 'left', fontSize: 12 }}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: 20, textAlign: 'center', color: '#666' }}>
                                    {loading ? 'Loading audit records...' : 'No audit records found'}
                                </td>
                            </tr>
                        ) : (
                            filteredRecords.map((record: AuditRecord) => (
                                <tr key={record.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <td style={{ padding: 8, fontSize: 11 }}>
                                        {new Date(record.timestamp).toLocaleString()}
                                    </td>
                                    <td style={{ padding: 8, fontSize: 11 }}>{record.user}</td>
                                    <td style={{ padding: 8, fontSize: 11 }}>
                                        <span style={{
                                            padding: '2px 6px',
                                            borderRadius: 4,
                                            background: record.userRole.toLowerCase() === 'admin' ? '#dc3545' : 
                                                       record.userRole.toLowerCase() === 'registrar' ? '#ffc107' : '#28a745',
                                            color: record.userRole.toLowerCase() === 'registrar' ? '#000' : '#fff',
                                            fontSize: 10
                                        }}>
                                            {record.userRole}
                                        </span>
                                    </td>
                                    <td style={{ padding: 8, fontSize: 11 }}>{record.action}</td>
                                    <td style={{ padding: 8, fontSize: 11 }}>
                                        <span style={{
                                            padding: '2px 6px',
                                            borderRadius: 4,
                                            background: getCategoryColor(record.category),
                                            color: 'white',
                                            fontSize: 10
                                        }}>
                                            {record.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: 8, fontSize: 11, maxWidth: 300 }}>{record.details}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAuditRecordsTable;
