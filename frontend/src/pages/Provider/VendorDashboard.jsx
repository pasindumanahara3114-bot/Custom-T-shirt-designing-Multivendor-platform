import React, { useState } from 'react';
import {
    LayoutDashboard,
    Package,
    Settings,
    DollarSign,
    User,
    LogOut,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronRight,
    Search,
    Bell,
    Sun,
    Moon,
    Eye,
    ImageIcon,
    Download
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const VendorDashboard = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedDesign, setSelectedDesign] = useState(null);

    // Mock States
    const [orders, setOrders] = useState([
        { id: 'ORD-1045', customer: 'Udula', material: 'Cotton', qty: 5, status: 'Placed', date: '2024-03-27', designUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200', designJSON: '{"objects":[]}' },
        { id: 'ORD-1042', customer: 'Saman', material: 'Polyester', qty: 10, status: 'Accepted', date: '2024-03-26', designUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=200', designJSON: '{"objects":[]}' },
        { id: 'ORD-1039', customer: 'Kamal', material: 'Cotton', qty: 2, status: 'In Production', date: '2024-03-25', designUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200', designJSON: '{"objects":[]}' },
        { id: 'ORD-1035', customer: 'Nimal', material: 'Linen', qty: 8, status: 'Ready for Delivery', date: '2024-03-24', designUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=200', designJSON: '{"objects":[]}' },
    ]);

    const [profile, setProfile] = useState({
        businessName: 'FastPrint Designs',
        contact: '+94 77 123 4567',
        location: 'Colombo, Sri Lanka',
        description: 'Premium T-shirt printing with high-quality materials and fast delivery.',
        materials: ['Cotton', 'Polyester'],
        minQty: 1,
        maxQty: 500,
        pricePerUnit: 850
    });

    const stats = {
        new: orders.filter(o => o.status === 'Placed').length,
        production: orders.filter(o => o.status === 'Accepted' || o.status === 'In Production').length,
        completed: orders.filter(o => o.status === 'Ready for Delivery').length,
        earnings: 'Rs. 45,200'
    };

    const updateStatus = (orderId) => {
        setOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                const statusFlow = ['Placed', 'Accepted', 'In Production', 'Ready for Delivery'];
                const currentIndex = statusFlow.indexOf(order.status);
                const nextStatus = statusFlow[currentIndex + 1] || order.status;
                return { ...order, status: nextStatus };
            }
            return order;
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Placed': return '#6366f1';
            case 'Accepted': return '#fbbf24';
            case 'In Production': return '#f97316';
            case 'Ready for Delivery': return '#22c55e';
            default: return 'var(--muted)';
        }
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
                background: activeTab === id ? 'rgba(255,255,255,0.05)' : 'none',
                color: activeTab === id ? 'var(--accent)' : 'var(--muted)',
                transition: '0.2s',
                marginBottom: '4px'
            }}
            className="sidebar-link"
        >
            <Icon size={20} />
            <span style={{ fontWeight: activeTab === id ? '600' : '400' }}>{label}</span>
            {activeTab === id && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
        </div>
    );

    return (
        <div className="vendor-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg1)', color: 'white' }}>
            {/* TOP NAVBAR */}
            <div className="glass" style={{ height: '70px', borderBottom: '1px solid var(--stroke)', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '0', zIndex: '10' }}>
                <h2 className="logo">PrintHub <span style={{ fontSize: '12px', color: 'var(--accent)' }}>Vendor</span></h2>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    {/* Theme Toggle */}
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

                    <div className="glass" style={{ padding: '6px 12px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent), var(--accent2))' }}></div>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>FastPrint Admin</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1 }}>
                {/* SIDEBAR */}
                <div className="glass" style={{ width: '240px', borderRadius: '0', borderRight: '1px solid var(--stroke)', padding: '32px 16px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1 }}>
                        <SidebarItem icon={LayoutDashboard} label="Dashboard" id="dashboard" />
                        <SidebarItem icon={Package} label="Orders" id="orders" />
                        <SidebarItem icon={DollarSign} label="Earnings" id="earnings" />
                        <SidebarItem icon={User} label="Profile" id="profile" />
                    </div>

                    <div style={{ borderTop: '1px solid var(--stroke)', paddingTop: '20px' }}>
                        <SidebarItem icon={LogOut} label="Logout" id="logout" />
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div style={{ flex: 1, padding: '32px 48px', overflowY: 'auto' }}>
                    {activeTab === 'dashboard' ? (
                        <DashboardView stats={stats} orders={orders} updateStatus={updateStatus} getStatusColor={getStatusColor} setSelectedDesign={setSelectedDesign} />
                    ) : activeTab === 'orders' ? (
                        <OrdersManagementView orders={orders} updateStatus={updateStatus} getStatusColor={getStatusColor} setSelectedDesign={setSelectedDesign} />
                    ) : activeTab === 'profile' ? (
                        <ProfileView profile={profile} setProfile={setProfile} />
                    ) : (
                        <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
                            <h2 style={{ color: 'var(--muted)' }}>Content for {activeTab} coming soon...</h2>
                        </div>
                    )}
                </div>

                {selectedDesign && (
                    <div
                        onClick={() => setSelectedDesign(null)}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}
                    >
                        <div
                            onClick={e => e.stopPropagation()}
                            className="glass"
                            style={{ padding: '32px', position: 'relative', maxWidth: '500px', width: '90%', animation: 'modalFadeIn 0.3s ease-out' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div>
                                    <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>Customer Design Overview</h3>
                                    <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Access preview and production master files.</p>
                                </div>
                                <LogOut size={20} style={{ color: 'var(--muted)', cursor: 'pointer' }} onClick={() => setSelectedDesign(null)} />
                            </div>

                            <img
                                src={selectedDesign}
                                alt="Design Preview"
                                style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--stroke)', marginBottom: '24px' }}
                            />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    onClick={() => alert(`Initiating download of Backend-Rendered HD Print File for ${selectedDesign}...`)}
                                    className="navBtn"
                                    style={{ width: '100%', padding: '14px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <Download size={18} /> Download Print-Ready File (High Res)
                                </button>

                                <button
                                    onClick={() => alert(`Initiating download of raw Master JSON data for ${selectedDesign}...`)}
                                    style={{
                                        width: '100%', padding: '14px', fontSize: '14px', fontWeight: '500',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--stroke)',
                                        borderRadius: '12px', cursor: 'pointer', transition: '0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                >
                                    <Download size={18} /> Download Source JSON (Editable)
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .sidebar-link:hover {
                    background: rgba(255,255,255,0.03) !important;
                    color: white !important;
                }
                .table-row:hover {
                    background: rgba(255,255,255,0.02);
                }
                .table-row:hover .design-hover {
                    opacity: 1 !important;
                }
                th {
                    font-weight: 500;
                }
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

// Sub-components
const DashboardView = ({ stats, orders, updateStatus, getStatusColor, setSelectedDesign }) => (
    <>
        <header style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '28px' }}>Welcome back!</h1>
            <p style={{ color: 'var(--muted)' }}>Here's what's happening with your shop today.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
            <StatCard label="New Orders" value={stats.new} icon={AlertCircle} color="#6366f1" />
            <StatCard label="In Production" value={stats.production} icon={Clock} color="#fbbf24" />
            <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} color="#22c55e" />
            <StatCard label="Total Earnings" value={stats.earnings} icon={DollarSign} color="#f97316" />
        </div>

        <div className="glass" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>Recent Orders</h3>
            <OrdersTable orders={orders.slice(0, 5)} updateStatus={updateStatus} getStatusColor={getStatusColor} setSelectedDesign={setSelectedDesign} />
        </div>
    </>
);

const OrdersManagementView = ({ orders, updateStatus, getStatusColor, setSelectedDesign }) => {
    const [filter, setFilter] = useState('All');
    const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    return (
        <>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '28px' }}>Orders Management</h1>
                <p style={{ color: 'var(--muted)' }}>Filter and manage your production pipeline.</p>
            </header>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                {['All', 'Placed', 'Accepted', 'In Production', 'Ready for Delivery'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            border: filter === status ? 'none' : '1px solid var(--stroke)',
                            background: filter === status ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                            color: filter === status ? 'white' : 'var(--muted)',
                            transition: '0.2s'
                        }}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="glass" style={{ padding: '32px' }}>
                <OrdersTable orders={filteredOrders} updateStatus={updateStatus} getStatusColor={getStatusColor} setSelectedDesign={setSelectedDesign} />
            </div>
        </>
    );
};

const OrdersTable = ({ orders, updateStatus, getStatusColor, setSelectedDesign }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
            <tr style={{ color: 'var(--muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <th style={{ padding: '16px' }}>Order ID</th>
                <th style={{ padding: '16px' }}>Design</th>
                <th style={{ padding: '16px' }}>Customer</th>
                <th style={{ padding: '16px' }}>Detail</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Action</th>
            </tr>
        </thead>
        <tbody>
            {orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--stroke)', transition: '0.2s' }} className="table-row">
                    <td style={{ padding: '20px 16px', fontWeight: 'bold' }}>{order.id}</td>
                    <td style={{ padding: '20px 16px' }}>
                        <div
                            onClick={() => setSelectedDesign(order.designUrl)}
                            style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--stroke)', position: 'relative' }}
                        >
                            <img src={order.designUrl} alt="design" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s' }} className="design-hover">
                                <Eye size={16} color="white" />
                            </div>
                        </div>
                    </td>
                    <td style={{ padding: '20px 16px' }}>{order.customer}</td>
                    <td style={{ padding: '20px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '14px' }}>{order.material} T-shirt</span>
                            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Qty: {order.qty}</span>
                        </div>
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            background: `${getStatusColor(order.status)}20`,
                            color: getStatusColor(order.status),
                            border: `1px solid ${getStatusColor(order.status)}40`
                        }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(order.status) }}></div>
                            {order.status}
                        </div>
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                        {order.status !== 'Ready for Delivery' ? (
                            <button
                                onClick={() => updateStatus(order.id)}
                                className="navBtn"
                                style={{ fontSize: '13px', padding: '8px 16px' }}
                            >
                                {order.status === 'Placed' ? 'Accept Order' : 'Update Status'}
                            </button>
                        ) : (
                            <CheckCircle2 color="#22c55e" size={24} />
                        )}
                    </td>
                </tr>
            ))}
            {orders.length === 0 && (
                <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>No orders found for this status.</td>
                </tr>
            )}
        </tbody>
    </table>
);

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            border: `1px solid ${color}30`
        }}>
            <Icon size={28} />
        </div>
        <div>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '4px' }}>{label}</p>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</h2>
        </div>
    </div>
);

const ProfileView = ({ profile, setProfile }) => {
    const materialsList = ['Cotton', 'Polyester', 'Dry Fit', 'Oversized Fabric'];

    const toggleMaterial = (mat) => {
        setProfile(prev => ({
            ...prev,
            materials: prev.materials.includes(mat)
                ? prev.materials.filter(m => m !== mat)
                : [...prev.materials, mat]
        }));
    };

    const handleSave = () => {
        alert('✅ Profile Updated Successfully!');
    };

    return (
        <div style={{ maxWidth: '900px' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '28px' }}>Vendor Profile</h1>
                <p style={{ color: 'var(--muted)' }}>Manage your business details and production settings.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
                {/* BUSINESS INFO CARD */}
                <div className="glass" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={20} color="var(--accent)" /> Business Information
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', color: 'var(--muted)' }}>Business Name</label>
                            <input
                                value={profile.businessName}
                                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--stroke)', borderRadius: '10px', color: 'white' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', color: 'var(--muted)' }}>Contact Number</label>
                            <input
                                value={profile.contact}
                                onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--stroke)', borderRadius: '10px', color: 'white' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                            <label style={{ fontSize: '13px', color: 'var(--muted)' }}>Location</label>
                            <input
                                value={profile.location}
                                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--stroke)', borderRadius: '10px', color: 'white' }}
                                placeholder="City, Country"
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                            <label style={{ fontSize: '13px', color: 'var(--muted)' }}>Description</label>
                            <textarea
                                value={profile.description}
                                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--stroke)', borderRadius: '10px', color: 'white', minHeight: '100px', resize: 'vertical' }}
                            />
                        </div>
                    </div>
                </div>

                {/* SERVICE SETTINGS CARD */}
                <div className="glass" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Settings size={20} color="var(--accent)" /> Service Settings
                    </h3>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ fontSize: '14px', marginBottom: '16px', display: 'block' }}>Supported Materials</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {materialsList.map(mat => (
                                <div
                                    key={mat}
                                    onClick={() => toggleMaterial(mat)}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        border: '1px solid var(--stroke)',
                                        background: profile.materials.includes(mat) ? 'rgba(79, 70, 229, 0.2)' : 'rgba(255,255,255,0.03)',
                                        borderColor: profile.materials.includes(mat) ? 'var(--accent)' : 'var(--stroke)',
                                        color: profile.materials.includes(mat) ? 'white' : 'var(--muted)',
                                        transition: '0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        border: '1px solid var(--stroke)',
                                        borderRadius: '4px',
                                        background: profile.materials.includes(mat) ? 'var(--accent)' : 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {profile.materials.includes(mat) && <CheckCircle2 size={12} color="white" />}
                                    </div>
                                    {mat}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', color: 'var(--muted)' }}>Min Order Qty</label>
                            <input
                                type="number"
                                value={profile.minQty}
                                onChange={(e) => setProfile({ ...profile, minQty: Number(e.target.value) })}
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--stroke)', borderRadius: '10px', color: 'white' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', color: 'var(--muted)' }}>Max Print Capacity</label>
                            <input
                                type="number"
                                value={profile.maxQty}
                                onChange={(e) => setProfile({ ...profile, maxQty: Number(e.target.value) })}
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--stroke)', borderRadius: '10px', color: 'white' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', color: 'var(--muted)' }}>Price per Unit (LKR)</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '14px' }}>Rs.</span>
                                <input
                                    type="number"
                                    value={profile.pricePerUnit}
                                    onChange={(e) => setProfile({ ...profile, pricePerUnit: Number(e.target.value) })}
                                    style={{ padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--stroke)', borderRadius: '10px', color: 'white', width: '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button onClick={handleSave} className="navBtn" style={{ padding: '16px 40px', fontSize: '16px', fontWeight: 'bold' }}>
                        Save Profile Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
