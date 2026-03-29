/**
 * VendorDashboard Component
 * 
 * Provides a comprehensive management portal for Vendors/Providers.
 * Features:
 * - Real-time production statistics and earnings overview.
 * - Interactive Order Management with status-tracking and status-flow automation.
 * - 'Smart Design Parser' for production-ready blueprint analysis (DPI, Fonts).
 * - Vendor Profile configuration for materials, capacity, and pricing.
 */
import React, { useState, useEffect } from 'react';
import { vendorService, orderService } from '../../api';
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
    Download,
    Type,
    Trash2
} from 'lucide-react';
import { SUPPORTED_MATERIALS } from '../../utils/constants';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as fabricModule from 'fabric';

const fabric = fabricModule.fabric || fabricModule;

const VendorDashboard = () => {
    const { theme, toggleTheme } = useTheme();
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedDesign, setSelectedDesign] = useState(null);
    const [previewImageModal, setPreviewImageModal] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [earnings, setEarnings] = useState({ totalEarnings: 0, pendingEarnings: 0, completedOrders: 0, totalOrders: 0 });

    const formatStatus = (status) => {
        if (!status) return 'N/A';
        if (status === 'READY_FOR_DELIVERY') return 'Ready for Delivery';
        if (status === 'IN_PRODUCTION') return 'In Production';
        return status
            .toLowerCase()
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // 1. Fetch the vendor's profile details using their user account ID
                const vendorProfile = await vendorService.getVendorByUserId(user.id);
                setProfile(vendorProfile);

                // 2. Fetch orders assigned specifically to this business (using vendor profile ID)
                const data = await orderService.getVendorOrders(vendorProfile.id);

                // Map API DTO to the expected local format
                const mappedData = data.map(o => ({
                    id: o.id,
                    customer: o.customerName || 'Unknown',
                    material: o.material,
                    qty: o.quantity,
                    status: formatStatus(o.status),
                    date: o.orderDate ? o.orderDate.split('T')[0] : 'N/A',
                    expectedDate: o.expectedDate || 'N/A',
                    address: o.address || 'N/A',
                    designUrl: o.designUrl,
                    designJSON: o.designJson
                }));

                // Sort primarily by Expected Date
                const sortedData = mappedData.sort((a, b) => {
                    const dateA = a.expectedDate !== 'N/A' ? a.expectedDate : a.date;
                    const dateB = b.expectedDate !== 'N/A' ? b.expectedDate : b.date;
                    return dateA.localeCompare(dateB);
                });

                setOrders(sortedData);

                // 3. Fetch earnings summary
                const earningsData = await orderService.getVendorEarnings(vendorProfile.id);
                setEarnings(earningsData);
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [user]);

    const [profile, setProfile] = useState({
        businessName: '',
        contact: '',
        location: '',
        description: '',
        materials: [],
        minQty: 0,
        maxQty: 0,
        pricePerUnit: 0
    });

    const stats = {
        new: orders.filter(o => o.status === 'Placed').length,
        production: orders.filter(o => o.status === 'Accepted' || o.status === 'In Production').length,
        completed: earnings.completedOrders || 0,
        earnings: `Rs. ${(earnings.totalEarnings || 0).toLocaleString()}`,
        pending: `Rs. ${(earnings.pendingEarnings || 0).toLocaleString()}`,
    };

    const updateStatus = async (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const statusFlow = ['Placed', 'Accepted', 'In Production', 'Ready for Delivery'];
        const currentIndex = statusFlow.indexOf(order.status);
        const nextStatus = statusFlow[currentIndex + 1];

        if (!nextStatus) return;

        try {
            // Update on backend
            await orderService.updateOrderStatus(orderId, nextStatus.toUpperCase().replace(/ /g, '_'));

            // Update local state and keep sorted by Date (YYYY-MM-DD)
            setOrders(prev => {
                const updated = prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o);
                return [...updated].sort((a, b) => {
                    const dateA = a.expectedDate !== 'N/A' ? a.expectedDate : a.date;
                    const dateB = b.expectedDate !== 'N/A' ? b.expectedDate : b.date;
                    return dateA.localeCompare(dateB);
                });
            });
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to update status on server.");
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;

        try {
            await orderService.deleteOrder(orderId);
            setOrders(prev => prev.filter(o => o.id !== orderId));
        } catch (err) {
            console.error("Failed to delete order:", err);
            alert("Failed to delete order from server.");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const extractAndDownloadLayer = (elementObject, side) => {
        if (!elementObject) return;

        if (elementObject.type === 'image') {
            const a = document.createElement('a');
            a.href = elementObject.src;
            a.download = `order-${selectedDesign.id}-${side}-image.png`;
            a.click();
        } else if (elementObject.type.includes('text')) {
            const tempCanvasElement = document.createElement('canvas');
            const width = Math.round(elementObject.width * elementObject.scaleX) + 40;
            const height = Math.round(elementObject.height * elementObject.scaleY) + 40;

            const tempCanvas = new fabric.StaticCanvas(tempCanvasElement, {
                width: width,
                height: height,
                backgroundColor: 'rgba(0,0,0,0)' // Transparent
            });

            // Center the text inside the bounds
            const clonedObj = {
                ...elementObject,
                left: width / 2,
                top: height / 2,
                originX: 'center',
                originY: 'center',
                angle: 0
            };

            fabric.util.enlivenObjects([clonedObj], (objects) => {
                const textObj = objects[0];
                tempCanvas.add(textObj);
                tempCanvas.renderAll();

                const dataUrl = tempCanvas.toDataURL({
                    format: 'png',
                    quality: 1,
                    multiplier: 2 // High res export
                });

                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = `order-${selectedDesign.id}-${side}-text.png`;
                a.click();
                tempCanvas.dispose();
            });
        }
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
                            transition: '0.2s',
                            border: '1px solid var(--stroke)'
                        }}
                    >
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <LogOut size={14} color="white" />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>Logout</span>
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
                    {activeTab === 'dashboard' ? (
                        <DashboardView stats={stats} orders={orders} updateStatus={updateStatus} handleDeleteOrder={handleDeleteOrder} getStatusColor={getStatusColor} setSelectedDesign={setSelectedDesign} businessName={profile.businessName} />
                    ) : activeTab === 'orders' ? (
                        <OrdersManagementView orders={orders} updateStatus={updateStatus} handleDeleteOrder={handleDeleteOrder} getStatusColor={getStatusColor} setSelectedDesign={setSelectedDesign} />
                    ) : activeTab === 'profile' ? (
                        <ProfileView profile={profile} setProfile={setProfile} />
                    ) : activeTab === 'earnings' ? (
                        <div>
                            <div style={{ marginBottom: '28px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>💰 Earnings Overview</h2>
                                <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Your financial summary based on all orders</p>
                            </div>

                            {/* Earnings Stats Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' }}>
                                {/* Total Earned */}
                                <div className="glass" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(79,70,229,0.3)', background: 'linear-gradient(135deg, rgba(79,70,229,0.12), rgba(16,185,129,0.05))' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #4f46e5, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <DollarSign size={22} color="white" />
                                        </div>
                                        <span style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: '500' }}>Your Net Profit</span>
                                    </div>
                                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>
                                        Rs. {(earnings.totalEarnings || 0).toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>From {earnings.completedOrders || 0} delivered orders (After Platform Fee)</div>
                                </div>

                                {/* Pending Earnings */}
                                <div className="glass" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(245,158,11,0.3)', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(0,0,0,0))' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Clock size={22} color="white" />
                                        </div>
                                        <span style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: '500' }}>Pending Profit</span>
                                    </div>
                                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>
                                        Rs. {(earnings.pendingEarnings || 0).toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>Orders in progress (After Platform Fee)</div>
                                </div>

                                {/* Total Orders */}
                                <div className="glass" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.2)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Package size={22} color="white" />
                                        </div>
                                        <span style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: '500' }}>Total Orders</span>
                                    </div>
                                    <div style={{ fontSize: '28px', fontWeight: '700' }}>{earnings.totalOrders || 0}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>{earnings.completedOrders || 0} completed</div>
                                </div>
                            </div>

                            {/* Per-Order Breakdown Table */}
                            <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--stroke)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Order Revenue Breakdown</h3>
                                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{orders.length} total orders</span>
                                </div>
                                {orders.length === 0 ? (
                                    <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)' }}>
                                        <DollarSign size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                                        <p>No orders yet. Revenue will appear here when you receive orders.</p>
                                    </div>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--stroke)', background: 'rgba(255,255,255,0.02)' }}>
                                                {['Order ID', 'Customer', 'Material', 'Qty', 'Status', 'Revenue'].map(h => (
                                                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order, i) => (
                                                <tr key={order.id} style={{ borderBottom: '1px solid var(--stroke)', transition: '0.15s', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                                                    <td style={{ padding: '14px 20px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--accent2)' }}>{order.id}</td>
                                                    <td style={{ padding: '14px 20px', fontSize: '13px' }}>{order.customer}</td>
                                                    <td style={{ padding: '14px 20px', fontSize: '13px' }}>{order.material}</td>
                                                    <td style={{ padding: '14px 20px', fontSize: '13px' }}>{order.qty}</td>
                                                    <td style={{ padding: '14px 20px' }}>
                                                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: order.status === 'Ready for Delivery' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.1)', color: order.status === 'Ready for Delivery' ? '#10b981' : '#f59e0b' }}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: '700', color: order.status === 'Ready for Delivery' ? '#10b981' : 'var(--muted)' }}>
                                                        {order.totalPrice ? `Rs. ${order.totalPrice.toLocaleString()}` : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
                            <h2 style={{ color: 'var(--muted)' }}>Content for {activeTab} coming soon...</h2>
                        </div>
                    )}
                </div>

                {/* 
                  DESIGN PREVIEW & BLUEPRINT MODAL 
                  Parses order.designJSON to display individual production layers (Image/Text) 
                */}
                {selectedDesign && (
                    <div
                        onClick={() => setSelectedDesign(null)}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)', overflowY: 'auto', padding: '40px 0' }}
                    >
                        <div
                            onClick={e => e.stopPropagation()}
                            className="glass"
                            style={{ padding: '32px', position: 'relative', maxWidth: '600px', width: '90%', animation: 'modalFadeIn 0.3s ease-out', margin: 'auto' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div>
                                    <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>Customer Design Overview</h3>
                                    <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Order: {selectedDesign.id} • Access preview and production master files.</p>
                                </div>
                                <LogOut size={20} style={{ color: 'var(--muted)', cursor: 'pointer' }} onClick={() => setSelectedDesign(null)} />
                            </div>

                            <img
                                src={selectedDesign.designUrl}
                                alt="Design Preview"
                                style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--stroke)', marginBottom: '24px' }}
                            />

                            {/* PRODUCTION BLUEPRINT SECTION */}
                            <div style={{ marginBottom: '24px', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--stroke)' }}>
                                <h4 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--accent2)' }}>Production Blueprint</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {(() => {
                                        let frontElements = [];
                                        let backElements = [];
                                        try {
                                            const parsed = JSON.parse(selectedDesign.designJSON);
                                            frontElements = parsed.front || [];
                                            backElements = parsed.back || [];
                                        } catch (e) { console.error("Could not parse design JSON", e) }

                                        if (frontElements.length === 0 && backElements.length === 0) {
                                            return <p style={{ color: 'var(--muted)', fontSize: '13px' }}>No editable layers found in this design.</p>;
                                        }

                                        const renderLayer = (el, side, i) => {
                                            if (el.type !== 'image' && !el.type.includes('text')) return null;
                                            const isText = el.type.includes('text');
                                            const textContent = isText ? el.text : '';

                                            return (
                                                <div key={`${side}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '8px' }}>
                                                    {el.type === 'image' ? (
                                                        <div
                                                            onClick={() => setPreviewImageModal(el.src)}
                                                            style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--bg2)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
                                                            title="Click to view full image"
                                                        >
                                                            <img src={el.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Element" />
                                                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0 }} className="hover-opacity-1">
                                                                <Eye size={16} color="white" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Type size={24} />
                                                        </div>
                                                    )}

                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                            <span style={{ fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' }}>{isText ? 'Text' : 'Image'} Layer ({side})</span>
                                                        </div>

                                                        {el.type === 'image' && (
                                                            <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Format: Raw • Source Size: {Math.round(el.width * el.scaleX)}x{Math.round(el.height * el.scaleY)}px</p>
                                                        )}
                                                        {isText && (
                                                            <p style={{ fontSize: '13px', color: 'var(--muted)' }}>"{textContent}" • Font: {el.fontFamily} • Size: {Math.round(el.fontSize * el.scaleX)}px</p>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => extractAndDownloadLayer(el, side)}
                                                        className="navBtn"
                                                        style={{ padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                                    >
                                                        <Download size={14} /> Extract PNG
                                                    </button>
                                                </div>
                                            );
                                        };

                                        return (
                                            <>
                                                {frontElements.length > 0 && <h5 style={{ color: 'var(--text)', marginBottom: '12px', marginTop: '8px' }}>Front Design Elements</h5>}
                                                {frontElements.map((el, i) => renderLayer(el, 'Front', i))}

                                                {backElements.length > 0 && <h5 style={{ color: 'var(--text)', marginBottom: '12px', marginTop: '16px' }}>Back Design Elements</h5>}
                                                {backElements.map((el, i) => renderLayer(el, 'Back', i))}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    onClick={() => orderService.downloadHDPreview(selectedDesign.id)}
                                    className="navBtn"
                                    style={{ width: '100%', padding: '14px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <ImageIcon size={18} /> View & Download Full Merged Detail
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* FULLSCREEN COMPONENT VIEWER MODAL */}
            {previewImageModal && (
                <div
                    onClick={() => setPreviewImageModal(null)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}
                >
                    <div style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }} onClick={e => e.stopPropagation()}>
                        <img
                            src={previewImageModal}
                            alt="Component View"
                            style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: '12px', border: '1px solid var(--stroke)' }}
                        />
                        <button
                            onClick={() => setPreviewImageModal(null)}
                            style={{ position: 'absolute', top: '-40px', right: 0, background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <LogOut size={20} /> Close Viewer
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .sidebar-link:hover {
                    background: rgba(255,255,255,0.03) !important;
                    color: white !important;
                }
                .hover-opacity-1:hover {
                    opacity: 1 !important;
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

/**
 * DashboardView - Home screen for vendors showing high-level stats and recent activity.
 */
const DashboardView = ({ stats, orders, updateStatus, handleDeleteOrder, getStatusColor, setSelectedDesign, businessName }) => (
    <>
        <header style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '28px' }}>Welcome back{businessName ? `, ${businessName}` : ''}!</h1>
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
            <OrdersTable
                orders={orders.slice(0, 5)}
                updateStatus={updateStatus}
                handleDeleteOrder={handleDeleteOrder}
                getStatusColor={getStatusColor}
                setSelectedDesign={setSelectedDesign}
            />
        </div>
    </>
);

/**
 * OrdersManagementView - Detailed order pipeline with status-based filtering.
 */
const OrdersManagementView = ({ orders, updateStatus, handleDeleteOrder, getStatusColor, setSelectedDesign }) => {
    const [filter, setFilter] = useState('All');
    const filteredOrders = [...(filter === 'All' ? orders : orders.filter(o => o.status === filter))]
        .sort((a, b) => {
            const dateA = a.expectedDate !== 'N/A' ? a.expectedDate : a.date;
            const dateB = b.expectedDate !== 'N/A' ? b.expectedDate : b.date;
            return dateA.localeCompare(dateB);
        });

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
                <OrdersTable
                    orders={filteredOrders}
                    updateStatus={updateStatus}
                    handleDeleteOrder={handleDeleteOrder}
                    getStatusColor={getStatusColor}
                    setSelectedDesign={setSelectedDesign}
                />
            </div>
        </>
    );
};

/**
 * OrdersTable - Reusable component for rendering order lists across different views.
 */
const OrdersTable = ({ orders, updateStatus, handleDeleteOrder, getStatusColor, setSelectedDesign }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
            <tr style={{ color: 'var(--muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <th style={{ padding: '16px' }}>Order ID</th>
                <th style={{ padding: '16px' }}>Design</th>
                <th style={{ padding: '16px' }}>Customer</th>
                <th style={{ padding: '16px' }}>Detail</th>
                <th style={{ padding: '16px' }}>Expected Date</th>
                <th style={{ padding: '16px' }}>Address</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>Action</th>
            </tr>
        </thead>
        <tbody>
            {orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--stroke)', transition: '0.2s' }} className="table-row">
                    <td style={{ padding: '20px 16px', fontWeight: 'bold' }}>{order.id}</td>
                    <td style={{ padding: '20px 16px' }}>
                        <div
                            onClick={() => setSelectedDesign(order)}
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
                    <td style={{ padding: '20px 16px' }}>{order.expectedDate}</td>
                    <td style={{ padding: '20px 16px' }}>{order.address}</td>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {order.status?.toLowerCase() !== 'ready for delivery' ? (
                                <button
                                    onClick={() => updateStatus(order.id)}
                                    className="navBtn"
                                    style={{ fontSize: '13px', padding: '8px 16px' }}
                                >
                                    {order.status === 'Placed' ? 'Accept Order' : 'Update Status'}
                                </button>
                            ) : (
                                <div style={{ color: '#22c55e', background: '#22c55e15', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle2 size={18} />
                                </div>
                            )}

                            <button
                                onClick={() => handleDeleteOrder(order.id)}
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: 'none',
                                    color: '#ef4444',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: '0.2s',
                                    marginLeft: 'auto'
                                }}
                                title="Delete Order"
                                className="delete-btn"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
            {orders.length === 0 && (
                <tr>
                    <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>No orders found for this status.</td>
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
    const materialsList = SUPPORTED_MATERIALS;

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
