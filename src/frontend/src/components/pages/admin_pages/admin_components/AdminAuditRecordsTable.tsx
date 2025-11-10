import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

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

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const AdminAuditRecordsTable: React.FC = () => {
    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedAction, setSelectedAction] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // State for backend integration
    const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        actions: [],
        targetTypes: [],
        users: [],
        categories: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // Memoize auth functions to prevent dependency issues
    const getAuthToken = useMemo(() => {
        return () => {
            // Primary token storage location
            const token = localStorage.getItem('token');
            console.log('🔑 Retrieved token:', token ? `${token.substring(0, 20)}...` : 'No token found');
            return token;
        };
    }, []);

    const getAuthHeaders = useMemo(() => {
        return () => {
            const token = getAuthToken();
            if (!token) {
                console.error('❌ No authentication token found in storage');
                return {};
            }
            
            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
        };
    }, [getAuthToken]);

    // Enhanced backend connection test
    const testBackendConnection = async () => {
        console.log('=== ENHANCED DEBUGGING BACKEND CONNECTION ===');
        console.log('API_BASE_URL:', API_BASE_URL);
        
        const token = getAuthToken();
        console.log('Auth token exists:', !!token);
        console.log('Auth token preview:', token ? `${token.substring(0, 50)}...` : 'No token');
        
        if (!token) {
            console.log('🔍 All localStorage keys:', Object.keys(localStorage));
            console.log('🔍 All sessionStorage keys:', Object.keys(sessionStorage));
            alert('❌ No authentication token found! Please login first.');
            return;
        }

        try {
            // Test 1: Backend health check
            console.log('🔍 Testing backend health...');
            const healthResponse = await fetch(`${API_BASE_URL}/auth/test`);
            console.log('✅ Backend health status:', healthResponse.status);
            
            if (!healthResponse.ok) {
                throw new Error(`Backend health check failed: ${healthResponse.status}`);
            }
        } catch (error) {
            console.error('❌ Backend health check failed:', error);
            alert('❌ Backend server is not responding. Please ensure your backend is running on port 4000.');
            return;
        }

        try {
            // Test 2: Protected endpoint with token
            console.log('🔍 Testing protected auth profile endpoint...');
            const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
                headers: getAuthHeaders()
            });
            
            console.log('✅ Profile endpoint response:', profileResponse.data);
            
            if (profileResponse.data.success) {
                const user = profileResponse.data.user;
                console.log('👤 Current user info:', user);
                
                if (user.role !== 'admin' && user.role !== 'registrar') {
                    alert(`⚠️ Access denied. Your role (${user.role}) doesn't have permission to view audit logs. Only admin and registrar roles can access audit records.`);
                    return;
                }
                
                alert(`✅ Authentication successful! Logged in as: ${user.username} (${user.role})`);
            }
        } catch (error: any) {
            console.error('❌ Profile endpoint failed:', error);
            
            if (error.response?.status === 401) {
                alert('❌ Authentication failed! Your session may have expired. Please login again.');
                // Clear invalid token
                localStorage.removeItem('token');
                localStorage.removeItem('authToken');
                sessionStorage.removeItem('token');
            } else {
                alert(`❌ Profile test failed: ${error.response?.data?.message || error.message}`);
            }
            return;
        }

        try {
            // Test 3: Audit endpoint
            console.log('🔍 Testing audit endpoint...');
            const auditResponse = await axios.get(`${API_BASE_URL}/audit/filters`, {
                headers: getAuthHeaders()
            });
            
            console.log('✅ Audit filters response:', auditResponse.data);
            
            if (auditResponse.data.success) {
                alert(`✅ Audit endpoint works! Found ${auditResponse.data.data.users?.length || 0} users and ${auditResponse.data.data.actions?.length || 0} actions.`);
            }
        } catch (error: any) {
            console.error('❌ Audit endpoint failed:', error);
            
            if (error.response?.status === 401) {
                alert('❌ Audit endpoint authentication failed. Token may be invalid.');
            } else if (error.response?.status === 403) {
                alert('❌ Access forbidden. Your role may not have audit access permissions.');
            } else {
                alert(`❌ Audit endpoint failed: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    // Fetch audit records from backend
    const fetchAuditRecords = useCallback(async () => {
        const token = getAuthToken();
        if (!token) {
            console.error('❌ No token found during fetchAuditRecords');
            console.log('🔍 Current storage state:', {
                localStorage: Object.keys(localStorage),
                sessionStorage: Object.keys(sessionStorage)
            });
            setError('Authentication token not found. Please check if you are logged in.');
            return;
        }

        setLoading(true);
        setError(null);
        
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
            console.log('🔑 Using token:', token.substring(0, 20) + '...');

            const response = await axios.get(`${API_BASE_URL}/audit?${params}`, {
                headers: getAuthHeaders(),
                timeout: 10000 // 10 second timeout
            });

            console.log('✅ Audit records response:', response.data);

            if (response.data.success) {
                setAuditRecords(response.data.data.logs || []);
                setTotalPages(response.data.data.pagination?.totalPages || 1);
                setTotalRecords(response.data.data.pagination?.total || 0);
                
                if (response.data.data.logs?.length === 0) {
                    setError('No audit records found. This might be because the database is empty or your filters are too restrictive.');
                }
            } else {
                setError(response.data.message || 'Failed to fetch audit records');
            }
        } catch (err: any) {
            console.error('❌ Error fetching audit records:', err);
            
            let errorMessage = 'Error fetching audit records';
            
            if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
                errorMessage = 'Cannot connect to backend server. Please ensure your backend is running on port 4000.';
            } else if (err.response?.status === 401) {
                errorMessage = 'Authentication failed. Please login again.';
                // Clear invalid token from all possible locations
                ['token', 'authToken'].forEach(key => {
                    localStorage.removeItem(key);
                    sessionStorage.removeItem(key);
                });
            } else if (err.response?.status === 403) {
                errorMessage = 'Access denied. You need admin or registrar role to view audit records.';
            } else if (err.response?.status === 404) {
                errorMessage = 'Audit endpoint not found. Please check your backend routes.';
            } else if (err.timeout) {
                errorMessage = 'Request timeout. Backend server may be overloaded.';
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, selectedUser, selectedRole, selectedAction, selectedCategory, startDate, endDate, currentPage, getAuthToken, getAuthHeaders]);

    // Fetch filter options from backend
    useEffect(() => {
        const fetchFilterOptions = async () => {
            const token = getAuthToken();
            if (!token) {
                console.warn('⚠️ No token available for fetching filter options');
                console.log('🔍 Storage state during filter options fetch:', {
                    localStorage: Object.keys(localStorage),
                    sessionStorage: Object.keys(sessionStorage)
                });
                return;
            }
            
            try {
                console.log('🔍 Fetching filter options...');
                const response = await axios.get(`${API_BASE_URL}/audit/filters`, {
                    headers: getAuthHeaders(),
                    timeout: 5000
                });
                
                console.log('✅ Filter options response:', response.data);
                
                if (response.data.success) {
                    setFilterOptions(response.data.data);
                } else {
                    console.warn('⚠️ Filter options request succeeded but returned success: false');
                }
            } catch (err: any) {
                console.error('❌ Error fetching filter options:', err);
                
                if (err.response?.status === 401) {
                    console.error('❌ 401 error during filter options fetch');
                    // Don't set error here, let the main fetch handle it
                } else if (err.response?.status === 403) {
                    console.error('❌ 403 error during filter options fetch');
                } else {
                    console.warn('⚠️ Failed to load filter options, but continuing with empty options');
                }
            }
        };

        fetchFilterOptions();
    }, [getAuthToken, getAuthHeaders]);

    // Add a token verification on component mount
    useEffect(() => {
        console.log('🔍 AdminAuditRecordsTable mounted, checking auth state...');
        const token = getAuthToken();
        if (!token) {
            console.error('❌ No token found on component mount');
            setError('No authentication token found. Please ensure you are logged in.');
        } else {
            console.log('✅ Token found on component mount');
        }
    }, [getAuthToken]);

    // Fetch records when filters change
    useEffect(() => {
        fetchAuditRecords();
    }, [fetchAuditRecords]);

    // Load initial data on component mount
    useEffect(() => {
        fetchAuditRecords();
    }, []);
    
    // Get unique values for filters from backend data
    const uniqueUsers = filterOptions.users.map((u: { id: number; username: string; email: string; role: string }) => u.email || u.username);
    const uniqueRoles = ['Admin', 'Registrar', 'Staff'];
    const uniqueActions = filterOptions.actions;
    const uniqueCategories = filterOptions.categories;

    // Apply client-side role and category filtering
    const filteredRecords = auditRecords.filter((record: AuditRecord) => {
        const matchesRole = !selectedRole || record.userRole === selectedRole;
        const matchesCategory = !selectedCategory || record.category === selectedCategory;
        return matchesRole && matchesCategory;
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

    return (
        <div style={{ background: 'white', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2>Audit Records</h2>
                
                {/* Backend connection controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Test connection button */}
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

            {/* Enhanced error display */}
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
                📊 Showing real backend audit data
                {getAuthToken() && (
                    <span style={{ marginLeft: 8 }}>
                        🔑 Authenticated
                    </span>
                )}
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
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
                            filteredRecords.map((record: AuditRecord) => (
                                <tr key={record.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <td style={{ padding: 12, fontSize: 12, fontFamily: 'monospace' }}>
                                        {new Date(record.timestamp).toLocaleString()}
                                    </td>
                                    <td style={{ padding: 12, fontWeight: 'bold' }}>
                                        {record.user}
                                    </td>
                                    <td style={{ padding: 12 }}>
                                        <span style={{
                                            background: record.userRole === 'Admin' ? '#000000ff' : 
                                                        record.userRole === 'Registrar' ? '#6f6f6fff' : '#a3a3a3ff',
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
                                    {loading 
                                        ? 'Loading audit records...' 
                                        : 'No audit records found matching your criteria.'
                                    }
                                    {!loading && (
                                        <div style={{ marginTop: 8, fontSize: 12 }}>
                                            Try clicking "Test Connection" to check your backend setup.
                                        </div>
                                    )}
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
