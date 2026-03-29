import React, { useState, useEffect } from 'react';
import { adminService } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Package,
    Settings,
    LogOut,
    DollarSign,
    TrendingUp,
    ShieldAlert,
    Trash2,
    Sun,
    Moon,
    Bell,
    CheckCircle2,
    Clock
} from 'lucide-react';

const AdminDashboard = () => {
    const { theme, toggleTheme } = useTheme();
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalUsers: 0, totalVendors: 0, totalOrders: 0, globalRevenue: 0, vendorPayouts: 0, platformProfit: 0 });
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    
    // Configurations state
    const [config, setConfig] = useState(null);
    const [newPercentage, setNewPercentage] = useState('');
    const [savingConfig, setSavingConfig] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsData, usersData, ordersData, configData] = await Promise.all([
                adminService.getPlatformStats(),
                adminService.getAllUsers(),
                adminService.getAllOrders(),
                adminService.getAppConfig()
            ]);
            setStats(statsData);
            setUsers(usersData);
            setOrders(ordersData);
            setConfig(configData);
            setNewPercentage(configData?.vendorProfitPercentage || '');
        } catch (err) {
            console.error("Failed to load admin data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, role) => {
        const confirmMsg = role === 'PROVIDER' 
            ? "Are you sure? This will delete the Vendor and their entire profile."
            : "Are you sure you want to delete this customer account?";
            
        if (!window.confirm(confirmMsg)) return;

        try {
            await adminService.deleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
            // Refresh stats since a user (and potentially their orders/revenue) was removed
            const newStats = await adminService.getPlatformStats();
            setStats(newStats);
        } catch (err) {
            console.error("Failed to delete user:", err);
            alert("Failed to delete user.");
        }
    };

    const handleSaveConfig = async () => {
        setSavingConfig(true);
        try {
            const val = parseFloat(newPercentage);
            if(isNaN(val) || val < 0 || val > 100) {
                alert("Please enter a valid percentage between 0 and 100.");
                return;
            }
            const updated = await adminService.updateAppConfig(val);
            setConfig(updated);
            alert("Settings saved successfully!");
            // Reload stats to reflect new math
            const newStats = await adminService.getPlatformStats();
            setStats(newStats);
        } catch(err) {
            alert("Failed to save configuration.");
        } finally {
            setSavingConfig(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const SidebarItem = ({ icon: Icon, label, id }) => (
        <div
            onClick={() => setActiveTab(id)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                cursor: 'pointer',
                background: activeTab === id ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                color: activeTab === id ? 'var(--accent)' : 'var(--muted)',
                transition: '0.2s',
                marginBottom: '4px'
            }}
            className="sidebar-link"
        >
            <Icon size={20} />
            <span style={{ fontWeight: activeTab === id ? '600' : '400' }}>{label}</span>
        </div>
    );

    if (loading) {
        return (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg1)' }}>
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="admin-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg1)', color: 'white' }}>
            {/* TOP NAVBAR */}
            <div className="glass" style={{ height: '70px', borderBottom: '1px solid var(--stroke)', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '0', zIndex: '10' }}>
                <h2 className="logo">PrintHub <span style={{ fontSize: '12px', color: '#ef4444', padding: '2px 8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', marginLeft: '8px' }}>Admin Space</span></h2>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                        <div className="theme-toggle-icons">
                            <Moon size={14} />
                            <Sun size={14} />
                        </div>
                        <div className="theme-toggle-thumb">
                            {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><Bell size={18} /></div>

                    <div
                        className="glass logout-trigger"
                        onClick={handleLogout}
                        title="Click to Logout"
                        style={{
                            padding: '6px 12px',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            border: '1px solid var(--stroke)'
                        }}
                    >
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(45deg, #ef4444, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldAlert size={14} color="white" />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{user?.name || 'Admin'}</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1 }}>
                {/* SIDEBAR */}
                <div className="glass" style={{ width: '240px', borderRadius: '0', borderRight: '1px solid var(--stroke)', padding: '32px 16px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1 }}>
                        <SidebarItem icon={LayoutDashboard} label="Platform Overview" id="overview" />
                        <SidebarItem icon={Users} label="User Management" id="users" />
                        <SidebarItem icon={Package} label="Global Orders" id="orders" />
                        <SidebarItem icon={Settings} label="System Settings" id="settings" />
                    </div>

                    <div style={{ borderTop: '1px solid var(--stroke)', paddingTop: '20px' }}>
                        <div
                            onClick={handleLogout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                color: '#ef4444',
                                transition: '0.2s',
                                marginBottom: '4px'
                            }}
                            className="sidebar-link logout-btn"
                        >
                            <LogOut size={20} />
                            <span style={{ fontWeight: '500' }}>Logout</span>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div style={{ flex: 1, padding: '32px 48px', overflowY: 'auto' }}>
                    
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                            <div style={{ marginBottom: '28px' }}>
                                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Platform Capabilities</h1>
                                <p style={{ color: 'var(--muted)', fontSize: '15px' }}>System-wide metrics and performance overview.</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                                <div className="glass hover-card" style={{ padding: '24px', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Users size={20} color="#4f46e5" />
                                        </div>
                                        <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: '500' }}>Total Customers</span>
                                    </div>
                                    <div style={{ fontSize: '28px', fontWeight: '700' }}>{stats.totalUsers - stats.totalVendors}</div>
                                </div>
                                <div className="glass hover-card" style={{ padding: '24px', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ShieldAlert size={20} color="#ec4899" />
                                        </div>
                                        <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: '500' }}>Active Vendors</span>
                                    </div>
                                    <div style={{ fontSize: '28px', fontWeight: '700' }}>{stats.totalVendors}</div>
                                </div>
                                <div className="glass hover-card" style={{ padding: '24px', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <DollarSign size={20} color="#10b981" />
                                        </div>
                                        <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: '500' }}>Global Revenue</span>
                                    </div>
                                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>Rs. {(stats.globalRevenue || 0).toLocaleString()}</div>
                                </div>
                                <div className="glass hover-card" style={{ padding: '24px', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Package size={20} color="#f59e0b" />
                                        </div>
                                        <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: '500' }}>Total Orders Processed</span>
                                    </div>
                                    <div style={{ fontSize: '28px', fontWeight: '700' }}>{stats.totalOrders}</div>
                                </div>
                            </div>
                            
                            {/* REVENUE BREAKDOWN */}
                            <div className="glass" style={{ padding: '32px', borderRadius: '16px', display: 'flex', gap: '32px' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--muted)', marginBottom: '8px' }}>Total Gross Revenue</h3>
                                    <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Rs. {(stats.globalRevenue || 0).toLocaleString()}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Total value of all items ordered across the entire platform.</div>
                                </div>
                                <div style={{ width: '1px', background: 'var(--stroke)' }}></div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--muted)', marginBottom: '8px' }}>Vendor Payouts ({(100 - (config?.vendorProfitPercentage || 0))}%)</h3>
                                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#ec4899', marginBottom: '8px' }}>Rs. {(stats.vendorPayouts || 0).toLocaleString()}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Total earnings awarded to vendors for manufacturing/design.</div>
                                </div>
                                <div style={{ width: '1px', background: 'var(--stroke)' }}></div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--muted)', marginBottom: '8px' }}>Platform Profit ({(config?.vendorProfitPercentage || 0)}%)</h3>
                                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>Rs. {(stats.platformProfit || 0).toLocaleString()}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Net profit kept by PrintHub admin ecosystem.</div>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                            <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>User Management</h2>
                                    <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Oversee and control access for all platform accounts.</p>
                                </div>
                                <span style={{ padding: '6px 16px', background: 'rgba(79,70,229,0.1)', color: 'var(--accent)', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>{users.length} Total</span>
                            </div>

                            {/* ROLE FILTERS */}
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                                {['ALL', 'ADMIN', 'PROVIDER', 'CUSTOMER'].map(role => (
                                    <button
                                        key={role}
                                        onClick={() => setRoleFilter(role)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            border: '1px solid',
                                            borderColor: roleFilter === role ? 'transparent' : 'var(--stroke)',
                                            background: roleFilter === role ? 'rgba(79,70,229,0.15)' : 'transparent',
                                            color: roleFilter === role ? '#818cf8' : 'var(--muted)',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            transition: '0.2s',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {role === 'PROVIDER' ? 'Vendors' : role.toLowerCase()}
                                    </button>
                                ))}
                            </div>

                            <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--stroke)', background: 'rgba(255,255,255,0.02)' }}>
                                            {['ID', 'Name', 'Email', 'Role', 'Profile Status', 'Actions'].map(h => (
                                                <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.filter(u => roleFilter === 'ALL' || u.role === roleFilter).map((u, i) => (
                                            <tr key={u.id} style={{ borderBottom: '1px solid var(--stroke)', transition: '0.15s', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                                                <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--muted)' }}>#{u.id}</td>
                                                <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500' }}>{u.name}</td>
                                                <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--muted)' }}>{u.email}</td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <span style={{ 
                                                        padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', 
                                                        background: u.role === 'PROVIDER' ? 'rgba(236,72,153,0.1)' : u.role === 'ADMIN' ? 'rgba(239,68,68,0.1)' : 'rgba(79,70,229,0.1)', 
                                                        color: u.role === 'PROVIDER' ? '#ec4899' : u.role === 'ADMIN' ? '#ef4444' : '#4f46e5' 
                                                    }}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 20px', fontSize: '14px' }}>
                                                    {u.profileComplete ? <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16}/> Complete</span> : <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16}/> Pending</span>}
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <button 
                                                        onClick={() => handleDeleteUser(u.id, u.role)}
                                                        disabled={u.role === 'ADMIN'}
                                                        style={{ 
                                                            padding: '6px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', 
                                                            border: 'none', cursor: u.role === 'ADMIN' ? 'not-allowed' : 'pointer', opacity: u.role === 'ADMIN' ? 0.4 : 1,
                                                            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '500'
                                                        }}
                                                    >
                                                        <Trash2 size={14} /> Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* GLOBAL ORDERS TAB */}
                    {activeTab === 'orders' && (
                        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                            <div style={{ marginBottom: '28px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Global Order Tracking</h2>
                                <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Every order placed across the entire PrintHub network.</p>
                            </div>

                            <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                {orders.length === 0 ? (
                                    <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)' }}>No orders placed yet.</div>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--stroke)', background: 'rgba(255,255,255,0.02)' }}>
                                                {['Order ID', 'Date', 'Customer', 'Vendor ID', 'Amount', 'Status'].map(h => (
                                                    <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((o, i) => (
                                                <tr key={o.id} style={{ borderBottom: '1px solid var(--stroke)', transition: '0.15s', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                                                    <td style={{ padding: '16px 20px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--accent2)' }}>{o.id}</td>
                                                    <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--muted)' }}>{o.orderDate ? o.orderDate.split('T')[0] : 'N/A'}</td>
                                                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500' }}>{o.customerName || 'Anonymous'}</td>
                                                    <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--muted)' }}>Vendor #{o.vendorId}</td>
                                                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '700' }}>Rs. {(o.totalPrice || 0).toLocaleString()}</td>
                                                    <td style={{ padding: '16px 20px' }}>
                                                        <span style={{ 
                                                            padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', 
                                                            background: o.status === 'READY_FOR_DELIVERY' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.1)', 
                                                            color: o.status === 'READY_FOR_DELIVERY' ? '#10b981' : '#f59e0b' 
                                                        }}>
                                                            {o.status.replace(/_/g, ' ')}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === 'settings' && (
                        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                            <div style={{ marginBottom: '28px' }}>
                                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>System Configurations</h1>
                                <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Manage platform-wide financial parameters.</p>
                            </div>

                            <div className="glass" style={{ padding: '32px', borderRadius: '16px', maxWidth: '600px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <DollarSign size={20} color="#10b981" /> Platform Commission Fee
                                </h3>
                                <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                                    Set the global percentage of gross revenue that the Admin retains as a platform fee per order. The remainder is paid out to vendors for manufacturing.
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Commission Fee (%)</label>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <input 
                                            type="number" 
                                            className="field" 
                                            value={newPercentage} 
                                            onChange={(e) => setNewPercentage(e.target.value)} 
                                            min="0" max="100" step="0.1"
                                            style={{ maxWidth: '150px', fontSize: '18px', fontWeight: '600' }}
                                        />
                                        <div style={{ flex: 1, height: '8px', background: 'var(--stroke)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${Math.min(100, Math.max(0, newPercentage || 0))}%`, background: '#10b981', transition: 'width 0.3s' }}></div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>
                                        Current Split: <span style={{ color: '#10b981', fontWeight: '600' }}>Admin keeps {newPercentage || 0}%</span> | <span style={{ color: '#ec4899', fontWeight: '600' }}>Vendor takes {100 - (newPercentage || 0)}%</span>
                                    </div>
                                </div>

                                <button 
                                    className="primaryBtn" 
                                    onClick={handleSaveConfig} 
                                    disabled={savingConfig}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <CheckCircle2 size={16} /> {savingConfig ? 'Saving...' : 'Apply Global Configuration'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
