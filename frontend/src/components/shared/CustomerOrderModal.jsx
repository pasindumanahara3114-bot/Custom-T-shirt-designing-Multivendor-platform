import React from 'react';
import { X, Calendar, Package, MapPin, Layers, Ruler, DollarSign, Tag, Clock } from 'lucide-react';

const CustomerOrderModal = ({ order, onClose }) => {
    if (!order) return null;

    const raw = order.raw; // Full DTO from backed
    const statusVal = raw.status || 'UNKNOWN';
    const statusString = statusVal.toLowerCase().replace(/_/g, ' ');

    let statusColor = '#4f46e5';
    let statusBg = 'rgba(79, 70, 229, 0.1)';
    if (statusVal === 'READY_FOR_DELIVERY') {
        statusColor = '#10b981';
        statusBg = 'rgba(16, 185, 129, 0.1)';
    } else if (statusVal === 'IN_PRODUCTION' || statusVal === 'ACCEPTED') {
        statusColor = '#f59e0b';
        statusBg = 'rgba(245, 158, 11, 0.1)';
    }

    const providerName = raw.vendorName || `Vendor #${raw.vendorId || 'Unknown'}`;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
        }}>
            <div className="glass" style={{
                width: '100%', maxWidth: '600px',
                padding: '0',
                borderRadius: '24px',
                position: 'relative',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                overflow: 'hidden',
                display: 'flex', flexDirection: 'column', maxHeight: '90vh'
            }}>
                {/* Header Image Area */}
                <div style={{
                    width: '100%',
                    height: '240px',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    borderBottom: '1px solid var(--stroke)'
                }}>
                    <img
                        src={order.image}
                        alt="Design Preview"
                        style={{ height: '90%', width: 'auto', objectFit: 'contain' }}
                    />
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute', top: '24px', right: '24px',
                            background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white',
                            cursor: 'pointer', borderRadius: '50%', padding: '8px',
                            backdropFilter: 'blur(4px)'
                        }}
                    >
                        <X size={20} />
                    </button>
                    
                    <div style={{
                        position: 'absolute', bottom: '16px', left: '24px',
                        background: statusBg, color: statusColor,
                        padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
                        fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px',
                        display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                        {statusVal === 'PLACED' ? <Clock size={14}/> : <Tag size={14}/>}
                        {statusString}
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ padding: '32px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Order {order.id}</h2>
                            <p style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                                <Calendar size={14} /> Placed on {order.date}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent2)' }}>{order.price}</div>
                            <div style={{ color: 'var(--muted)', fontSize: '13px' }}>Total Amount</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                        <div className="glass" style={{ padding: '16px', borderRadius: '12px' }}>
                            <div style={{ color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><Layers size={14}/> Material</div>
                            <div style={{ fontWeight: '500', textTransform: 'capitalize' }}>{raw.material || 'N/A'}</div>
                        </div>
                        <div className="glass" style={{ padding: '16px', borderRadius: '12px' }}>
                            <div style={{ color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><Ruler size={14}/> Dimensions</div>
                            <div style={{ fontWeight: '500' }}>Size {raw.size || 'N/A'} • {raw.quantity} Units</div>
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--muted)' }}>
                            <Package size={16} /> Production & Delivery
                        </h4>
                        
                        <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <div style={{ minWidth: '120px', color: 'var(--muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14}/> Ship To</div>
                                <div style={{ fontSize: '15px', lineHeight: '1.4', flex: 1 }}>
                                    <strong>{raw.name || 'Customer'}</strong><br/>
                                    {raw.address || 'No address provided, please contact support.'}<br/>
                                    <span style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px', display: 'block' }}>{raw.email}</span>
                                </div>
                            </div>
                            
                            <div style={{ height: '1px', background: 'var(--stroke)' }}></div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ minWidth: '120px', color: 'var(--muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}><Tag size={14}/> Fulfilling By</div>
                                <div style={{ fontSize: '15px', fontWeight: '600', color: 'white', flex: 1 }}>
                                    {providerName}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button className="primaryBtn" style={{ flex: 1, padding: '14px', borderRadius: '12px', display: 'flex', justifyContent: 'center' }} onClick={onClose}>
                            Close Details
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};

export default CustomerOrderModal;
