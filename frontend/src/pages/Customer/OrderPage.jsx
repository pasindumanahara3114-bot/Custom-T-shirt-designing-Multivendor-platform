import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, Package, Calendar, User, Mail, Layers, Ruler } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';

/**
 * OrderPage Component - Finalizes the order, consolidating design and quantity data.
 */
const OrderPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { provider, config } = location.state || { provider: { name: 'Universal Printer' }, config: {} };
    const { designs } = config || {};

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        material: config?.material || 'cotton',
        quantity: config?.quantity || 1,
        expectedDate: '',
        size: 'M'
    });

    const [previewImage, setPreviewImage] = useState(designs?.frontPreview || null);
    const [designJSON, setDesignJSON] = useState(designs?.designJSON || '');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Placing order for Vendor:", {
            ...formData,
            providerId: provider.id,
            designUrl: previewImage,
            designJSON: designJSON
        });
        alert(`✅ Order placed successfully with ${provider.name}!`);
        navigate('/dashboard');
    };

    return (
        <MainLayout>
            <div className="dashboard-root" style={{ maxWidth: '900px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--muted)',
                        cursor: 'pointer',
                        marginBottom: '24px'
                    }}
                >
                    <ChevronLeft size={20} />
                    Back to Selection
                </button>

                <div className="section-title-wrap">
                    <h1>Complete Your Order</h1>
                    <p style={{ color: 'var(--muted)' }}>Finalize your request for {provider.name}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', marginTop: '32px' }}>
                    {/* FORM SECTION */}
                    <form onSubmit={handleSubmit} className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="form-group">
                            <label><User size={16} /> Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="field"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label><Mail size={16} /> Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="field"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label><Layers size={16} /> Material</label>
                                <select
                                    name="material"
                                    className="field"
                                    value={formData.material}
                                    onChange={handleInputChange}
                                >
                                    <option value="cotton">Cotton</option>
                                    <option value="polyester">Polyester</option>
                                    <option value="linen">Linen</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label><Ruler size={16} /> Size</label>
                                <select
                                    name="size"
                                    className="field"
                                    value={formData.size}
                                    onChange={handleInputChange}
                                >
                                    <option>S</option>
                                    <option>M</option>
                                    <option>L</option>
                                    <option>XL</option>
                                    <option>XXL</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label><Package size={16} /> Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    className="field"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label><Calendar size={16} /> Expected Date</label>
                                <input
                                    type="date"
                                    name="expectedDate"
                                    required
                                    className="field"
                                    value={formData.expectedDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <button type="submit" className="navBtn" style={{ width: '100%', padding: '16px', marginTop: '10px' }}>
                            Place Order with {provider.name}
                        </button>
                    </form>

                    {/* UPLOAD SECTION */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
                            <h3 style={{ marginBottom: '16px' }}>Upload Design</h3>
                            <div
                                style={{
                                    border: '2px dashed var(--stroke)',
                                    borderRadius: '12px',
                                    padding: '40px 20px',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    background: previewImage ? 'none' : 'rgba(255,255,255,0.02)'
                                }}
                            >
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        style={{ width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'contain' }}
                                    />
                                ) : (
                                    <div style={{ color: 'var(--muted)' }}>
                                        <Upload size={32} style={{ marginBottom: '12px', color: 'var(--accent)' }} />
                                        <p style={{ fontSize: '14px' }}>Drop your JPG/PNG here or click to browse</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={handleImageUpload}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        opacity: 0,
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>
                            {previewImage && (
                                <button
                                    onClick={() => setPreviewImage(null)}
                                    style={{ background: 'none', border: 'none', color: 'var(--accent)', marginTop: '12px', fontSize: '13px', cursor: 'pointer' }}
                                >
                                    Remove and Choose Another
                                </button>
                            )}
                        </div>

                        <div className="glass" style={{ padding: '24px' }}>
                            <h4 style={{ marginBottom: '12px', color: 'var(--accent)' }}>Summary</h4>
                            <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--muted)' }}>Provider</span>
                                    <span>{provider.name}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--muted)' }}>Unit Price</span>
                                    <span>Rs. {provider.price || '1200'}</span>
                                </div>
                                <div style={{
                                    marginTop: '8px',
                                    paddingTop: '8px',
                                    borderTop: '1px solid var(--stroke)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontWeight: 'bold',
                                    fontSize: '16px'
                                }}>
                                    <span>Total Est.</span>
                                    <span style={{ color: 'var(--accent2)' }}>Rs. {(provider.price || 1200) * formData.quantity}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    .form-group {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }
                    .form-group label {
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                `}</style>
            </div>
        </MainLayout>
    );
};

export default OrderPage;
