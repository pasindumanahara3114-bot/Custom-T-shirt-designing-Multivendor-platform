import React, { useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../api';
import MainLayout from '../../layouts/MainLayout';
import { User, Building2, Phone, MapPin, Info, Save, ChevronDown } from 'lucide-react';
import { SUPPORTED_MATERIALS } from '../../utils/constants';

const ProfileSetupPage = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);


    const [vendorData, setVendorData] = useState({
        businessName: '',
        contact: '',
        location: '',
        description: '',
        minQty: 1,
        maxQty: 1000,
        pricePerUnit: 0.0,
        materials: []
    });


    const handleVendorChange = (e) => {
        setVendorData({ ...vendorData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let updatedUser;
            updatedUser = await authService.completeVendorProfile(user.id, vendorData);

            console.log("Profile setup complete. Updated User:", updatedUser);
            updateUser(updatedUser);

            // Robust redirection logic
            const isAdmin = updatedUser.role?.toUpperCase() === 'ADMIN';
            const isProvider = updatedUser.role?.toUpperCase() === 'PROVIDER' || updatedUser.role?.toUpperCase() === 'VENDOR';

            let targetPath = '/dashboard'; // Default for Customers
            if (isProvider) targetPath = '/vendor/dashboard';
            if (isAdmin) targetPath = '/admin';

            console.log("Navigating to:", targetPath);
            navigate(targetPath, { replace: true });
        } catch (err) {
            console.error("Profile update failed:", err);
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    // Role-based redirection guards
    const isProvider = user.role?.toUpperCase() === 'PROVIDER' || user.role?.toUpperCase() === 'VENDOR';
    const isComplete = user.profileComplete || user.isProfileComplete;

    // 1. If profile is already complete, send to dashboard
    if (isComplete && location.pathname === '/complete-profile') {
        return <Navigate to={isProvider ? '/vendor/dashboard' : '/dashboard'} replace />;
    }

    // 2. If customer reaches this page, they don't belong here
    if (user.role?.toUpperCase() === 'CUSTOMER') {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <MainLayout>
            <div className="auth-container">
                <div className="auth-card" style={{ maxWidth: '600px' }}>
                    <div className="auth-header">
                        <h2>Business Setup</h2>
                        <p>Please provide a few more details to get started.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                        <div className="form-group">
                            <label><Building2 size={14} style={{ marginRight: '8px' }} /> Business Name</label>
                            <input
                                type="text"
                                name="businessName"
                                className="field"
                                placeholder="Awesome Prints Ltd."
                                value={vendorData.businessName}
                                onChange={handleVendorChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><Phone size={14} style={{ marginRight: '8px' }} /> Business Contact</label>
                            <input
                                type="text"
                                name="contact"
                                className="field"
                                placeholder="contact@business.com"
                                value={vendorData.contact}
                                onChange={handleVendorChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><MapPin size={14} style={{ marginRight: '8px' }} /> Location</label>
                            <input
                                type="text"
                                name="location"
                                className="field"
                                placeholder="City, Country"
                                value={vendorData.location}
                                onChange={handleVendorChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><Info size={14} style={{ marginRight: '8px' }} /> Business Description</label>
                            <textarea
                                name="description"
                                className="field"
                                placeholder="High quality screen printing since 2010..."
                                style={{ minHeight: '100px', padding: '12px' }}
                                value={vendorData.description}
                                onChange={handleVendorChange}
                                required
                            />
                        </div>

                        {/* Shared Fields (Quantity, Price, Materials) */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label>Min Quantity</label>
                                <input
                                    type="number"
                                    name="minQty"
                                    className="field"
                                    value={vendorData.minQty}
                                    onChange={handleVendorChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Max Quantity</label>
                                <input
                                    type="number"
                                    name="maxQty"
                                    className="field"
                                    value={vendorData.maxQty}
                                    onChange={handleVendorChange}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label>Unit Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="pricePerUnit"
                                    className="field"
                                    value={vendorData.pricePerUnit}
                                    onChange={handleVendorChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Materials (Available/Preferred)</label>
                                <div className="dropdown-root" style={{ position: 'relative' }}>
                                    <div
                                        className="dropdown-trigger"
                                        onClick={() => setIsMaterialsOpen(!isMaterialsOpen)}
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '6px',
                                            minHeight: '48px',
                                            alignItems: 'center',
                                            padding: '8px 12px'
                                        }}
                                    >
                                        {vendorData.materials.length === 0 ? (
                                            <span style={{ color: 'var(--muted)', fontSize: '14px' }}>Select materials...</span>
                                        ) : (
                                            vendorData.materials.map(m => (
                                                <div
                                                    key={m}
                                                    style={{
                                                        background: 'var(--accent)',
                                                        color: 'white',
                                                        padding: '2px 10px',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}
                                                >
                                                    {m}
                                                    <span
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setVendorData({ ...vendorData, materials: vendorData.materials.filter(item => item !== m) });
                                                        }}
                                                        style={{ cursor: 'pointer', opacity: 0.8 }}
                                                    >×</span>
                                                </div>
                                            ))
                                        )}
                                        <ChevronDown size={18} style={{
                                            marginLeft: 'auto',
                                            transform: isMaterialsOpen ? 'rotate(180deg)' : 'rotate(0)',
                                            transition: '0.3s',
                                            color: 'var(--muted)'
                                        }} />
                                    </div>

                                    {isMaterialsOpen && (
                                        <div className="dropdown-menu" style={{ width: '100%', maxHeight: '200px', overflowY: 'auto', zIndex: 100 }}>
                                            {SUPPORTED_MATERIALS.map(m => {
                                                const isSelected = vendorData.materials.includes(m);
                                                return (
                                                    <div
                                                        key={m}
                                                        className={`dropdown-item ${isSelected ? 'active' : ''}`}
                                                        onClick={() => {
                                                            const newMaterials = isSelected
                                                                ? vendorData.materials.filter(item => item !== m)
                                                                : [...vendorData.materials, m];
                                                            setVendorData({ ...vendorData, materials: newMaterials });
                                                        }}
                                                    >
                                                        {m}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {error && <div style={{ color: 'var(--accent)', fontSize: '13px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

                        <button
                            type="submit"
                            className="primaryBtn"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                            disabled={loading}
                        >
                            <Save size={18} />
                            {loading ? 'Saving Profile...' : 'Complete Registration'}
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProfileSetupPage;
