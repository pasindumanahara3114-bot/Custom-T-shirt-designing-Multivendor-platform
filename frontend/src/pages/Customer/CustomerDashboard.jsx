import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ShoppingBag, Heart, Clock, ChevronRight, Sun, Moon, LogOut, User, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { orderService } from '../../api';

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('orders');
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                // For now, using a hardcoded customerId=1.
                const data = await orderService.getCustomerOrders(1);

                const mappedData = data.map(o => ({
                    id: o.id,
                    date: o.orderDate ? o.orderDate.split('T')[0] : 'N/A',
                    status: o.status,
                    price: `Rs. ${o.totalPrice.toLocaleString()}`,
                    items: o.quantity,
                    image: o.designUrl || '/design/hero-shirt.png'
                }));

                setRecentOrders(mappedData);
            } catch (err) {
                console.error("Failed to fetch customer orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const savedDesigns = [
        { id: 1, name: 'Summer Vibes V1', date: '2 mins ago', image: '/images/t2.jpg' },
        { id: 2, name: 'Team Logo Concept', date: '1 day ago', image: '/images/t3.jpg' },
    ];

    return (
        <div className="app-container">
            <div className="dashboard-root">
                {/* 1. WELCOME HEADER (WITH THEME TOGGLE) */}
                <section className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="welcome-wrap">
                        <h1>Hello, Udula 👋</h1>
                        <p>Manage your custom apparel and track your orders from one place</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                            <div className="theme-toggle-icons">
                                <Moon size={14} />
                                <Sun size={14} />
                            </div>
                            <div className="theme-toggle-thumb">
                                {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
                            </div>
                        </div>

                        <button className="cta-arrow-btn" onClick={() => navigate('/')} title="Logout">
                            <LogOut size={18} />
                        </button>
                    </div>
                </section>

                {/* 2. CALL TO ACTION - START DESIGNING */}
                <section className="dash-cta-section">
                    <div className="cta-card glass" onClick={() => navigate('/design')}>
                        <div className="cta-content">
                            <div className="cta-icon-box">
                                <Plus size={28} />
                            </div>
                            <div className="cta-text">
                                <h3>Create New Design</h3>
                                <p>Launch the interactive studio and build your brand with custom graphics</p>
                            </div>
                        </div>
                        <button className="cta-arrow-btn">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </section>

                {/* 3. TABBED NAVIGATION */}
                <section className="dash-content-section">
                    <div className="dash-tabs">
                        <button
                            className={`tab-item ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <ShoppingBag size={18} />
                            <span>My Orders</span>
                        </button>
                        <button
                            className={`tab-item ${activeTab === 'design' ? 'active' : ''}`}
                            onClick={() => setActiveTab('design')}
                        >
                            <Heart size={18} />
                            <span>My Designs</span>
                        </button>
                        <button
                            className={`tab-item ${activeTab === 'saved' ? 'active' : ''}`}
                            onClick={() => setActiveTab('saved')}
                        >
                            <Clock size={18} />
                            <span>Recently Viewed</span>
                        </button>
                    </div>

                    {/* 4. CONTENT LISTING */}
                    <div className="dash-content-body">
                        {activeTab === 'orders' && (
                            <div className="orders-grid">
                                <div className="section-title-wrap">
                                    <h2>Recent Orders</h2>
                                    <span className="see-all">See All History</span>
                                </div>
                                {recentOrders.map(order => (
                                    <div key={order.id} className="order-card-v2 glass">
                                        <div className="order-img">
                                            <img src={order.image} alt={order.id} />
                                        </div>
                                        <div className="order-details">
                                            <div className="order-row-top">
                                                <span className="order-id">{order.id}</span>
                                                <span className={`status-pill ${order.status.toLowerCase().replace(' ', '-')}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="order-row-mid">
                                                <span className="order-date">{order.date}</span>
                                                <span className="order-items">{order.items} Items</span>
                                            </div>
                                            <div className="order-row-bottom">
                                                <span className="order-price">{order.price}</span>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => orderService.downloadBlueprint(order.id)} className="track-btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--stroke)' }}>
                                                        <Download size={14} />
                                                    </button>
                                                    <button className="track-btn">Track Order</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'design' && (
                            <div className="design-grid">
                                <div className="section-title-wrap">
                                    <h2>Your Creative Assets</h2>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
                                    {savedDesigns.map(d => (
                                        <div key={d.id} className="saved-design-card glass">
                                            <div className="design-preview">
                                                <img src={d.image} alt={d.name} />
                                            </div>
                                            <div className="design-meta">
                                                <h4>{d.name}</h4>
                                                <span>Saved {d.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="add-design-placeholder" onClick={() => navigate('/design')}>
                                        <Plus size={32} />
                                        <span>Start Fresh Design</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'saved' && (
                            <div className="empty-state glass" style={{ padding: '60px', textAlign: 'center' }}>
                                <Clock size={48} style={{ color: 'var(--muted)', marginBottom: '16px' }} />
                                <h3>No recent activity</h3>
                                <p style={{ color: 'var(--muted)' }}>Start exploring the catalog to see your history here.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CustomerDashboard;
