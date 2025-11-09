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

// Keep existing hardcoded data for testing
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
    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedAction, setSelectedAction] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // New state for backend integration
    const [useRealData, setUseRealData] = useState(false);
    const [realAuditRecords, setRealAuditRecords] = useState<AuditRecord[]>([]);
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
            const token = localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
            console.log('🔑 Retrieved token:', token ? `${token.substring(0, 20)}...` : 'No token found');
            return token;
        };
    }, []);

    const getAuthHeaders = useMemo(() => {
        return () => {
            const token = getAuthToken();
            if (!token) {
                console.error('❌ No authentication token found in storage');
                setError('No authentication token found. Please login again.');
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

    // Fetch real audit records from backend - enhanced with better error handling
    const fetchRealAuditRecords = useCallback(async () => {
        if (!useRealData) return;
        
        const token = getAuthToken();
        if (!token) {
            setError('Authentication token not found. Please login again.');
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
                setRealAuditRecords(response.data.data.logs || []);
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
                // Clear invalid token
                localStorage.removeItem('token');
                localStorage.removeItem('authToken');
                sessionStorage.removeItem('token');
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
    }, [useRealData, searchTerm, selectedUser, selectedRole, selectedAction, selectedCategory, startDate, endDate, currentPage, getAuthToken, getAuthHeaders]);

    // Fetch filter options from backend - enhanced
    useEffect(() => {
        const fetchFilterOptions = async () => {
            if (!useRealData) return;
            
            const token = getAuthToken();
            if (!token) {
                console.warn('⚠️ No token available for fetching filter options');
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
                    setError('Authentication failed while fetching filter options. Please login again.');
                } else if (err.response?.status === 403) {
                    setError('Access denied for filter options. Check your permissions.');
                } else {
                    console.warn('⚠️ Failed to load filter options, but continuing with empty options');
                }
            }
        };

        fetchFilterOptions();
    }, [useRealData, getAuthToken, getAuthHeaders]);

    // Fetch records when filters change (only for real data)
    useEffect(() => {
        if (useRealData) {
            fetchRealAuditRecords();
        }
    }, [useRealData, fetchRealAuditRecords]);

    // Determine which data source to use
    const currentRecords = useRealData ? realAuditRecords : auditRecords;
    
    // Get unique values for filters (use appropriate data source)
    const uniqueUsers = useRealData 
        ? filterOptions.users.map(u => u.email || u.username)
        : Array.from(new Set(auditRecords.map(record => record.user)));
    
    const uniqueRoles = useRealData 
        ? ['Admin', 'Registrar', 'Staff'] 
        : Array.from(new Set(auditRecords.map(record => record.userRole)));
    
    const uniqueActions = useRealData 
        ? filterOptions.actions 
        : Array.from(new Set(auditRecords.map(record => record.action)));
    
    const uniqueCategories = useRealData 
        ? filterOptions.categories 
        : Array.from(new Set(auditRecords.map(record => record.category)));

    // Filter records based on all criteria (for hardcoded data only)
    const filteredRecords = useRealData ? currentRecords : currentRecords.filter(record => {
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

    // Apply client-side role and category filtering for real data
    const finalFilteredRecords = useRealData ? filteredRecords.filter(record => {
        const matchesRole = !selectedRole || record.userRole === selectedRole;
        const matchesCategory = !selectedCategory || record.category === selectedCategory;
        return matchesRole && matchesCategory;
    }) : filteredRecords;

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

    const toggleDataSource = () => {
        setUseRealData(!useRealData);
        clearFilters();
        setError(null);
    };

    return (
        <div style={{ background: 'white', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2>Audit Records</h2>
                
                {/* Data source toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <label style={{ fontSize: 14, color: '#666' }}>
                        <input
                            type="checkbox"
                            checked={useRealData}
                            onChange={toggleDataSource}
                            style={{ marginRight: 8 }}
                        />
                        Use Real Data from Backend
                    </label>
                    
                    {/* Enhanced test connection button */}
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
                    
                    {useRealData && (
                        <button
                            onClick={fetchRealAuditRecords}
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
                    )}
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
                background: useRealData ? '#d1ecf1' : '#fff3cd', 
                color: useRealData ? '#0c5460' : '#856404',
                padding: 8, 
                borderRadius: 4, 
                marginBottom: 16,
                fontSize: 12,
                fontWeight: 'bold'
            }}>
                📊 Currently showing: {useRealData ? 'Real backend data' : 'Test/hardcoded data'}
                {useRealData && getAuthToken() && (
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
                    Showing {finalFilteredRecords.length} of {useRealData ? totalRecords : auditRecords.length} records
                    {loading && <span> (loading...)</span>}
                </div>
                
                {/* Pagination for real data */}
                {useRealData && totalPages > 1 && (
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
                        {finalFilteredRecords.length > 0 ? (
                            finalFilteredRecords.map((record) => (
                                <tr key={record.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <td style={{ padding: 12, fontSize: 12, fontFamily: 'monospace' }}>
                                        {useRealData 
                                            ? new Date(record.timestamp).toLocaleString() 
                                            : record.timestamp
                                        }
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
                                    {useRealData && !loading && (
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
