import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { vendorService } from '../../api';
import { SUPPORTED_MATERIALS } from '../../utils/constants';
import MainLayout from '../../layouts/MainLayout.jsx';
import ProviderCard from '../../components/shared/ProviderCard.jsx';

/**
 * ProductConfigPage Component - Manages material/qty selection and vendor filtering.
 * Persists design blueprints from location state.
 */
const ProductConfigPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { designs } = location.state || { designs: null };

    const [material, setMaterial] = useState(SUPPORTED_MATERIALS[0].toLowerCase());
    const [quantity, setQuantity] = useState(10);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true);
            try {
                // Fetch eligible vendors from backend
                const data = await vendorService.getEligibleVendors(material, quantity);
                setProviders(data);
            } catch (err) {
                console.error("Failed to fetch providers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, [material, quantity]);

    // Local filtering can still be applied if the backend returns all vendors but frontend wants to refine,
    // though getEligibleVendors should ideally handle most of it.
    const filteredProviders = providers || [];

    return (
        <MainLayout>
            <div style={{ display: 'flex', minHeight: '80vh', background: 'var(--bg1)', color: 'var(--text)', padding: '20px' }}>
                {/* LEFT PANEL */}
                <div style={{
                    width: '320px',
                    padding: '24px',
                    borderRight: '1px solid var(--stroke)'
                }}>
                    <h2 style={{ marginBottom: '20px' }}>Customize Product</h2>
                    <label>Material</label>
                    <select
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        className="field"
                    >
                        {SUPPORTED_MATERIALS.map(m => (
                            <option key={m} value={m.toLowerCase()}>{m}</option>
                        ))}
                    </select>
                    <label style={{ marginTop: '16px' }}>Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="field"
                    />
                    <div style={{ marginTop: '20px', fontSize: '14px', color: 'var(--muted)', background: 'var(--card)', border: '1px solid var(--stroke)', padding: '10px', borderRadius: '8px' }}>
                        Vendors are automatically filtered based on your selection.
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div style={{ flex: 1, padding: '24px' }}>
                    <h2 style={{ marginBottom: '16px' }}>
                        Available Providers ({filteredProviders.length})
                    </h2>
                    <button
                        className="primaryBtn"
                        style={{ marginBottom: '16px', padding: '10px 16px' }}
                        onClick={() => navigate('/providers', { state: { material, quantity } })}
                    >
                        View All Eligible Providers
                    </button>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>Fetching the best printing providers...</div>
                    ) : filteredProviders.length === 0 && (
                        <div style={{
                            padding: '40px',
                            background: 'var(--card)',
                            border: '1px solid var(--stroke)',
                            borderRadius: '12px',
                            textAlign: 'center',
                            color: 'var(--muted)'
                        }}>
                            ❌ No providers match your requirements
                        </div>
                    )}

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '20px'
                    }}>
                        {filteredProviders.map(p => (
                            <ProviderCard key={p.id} provider={p} config={{ material, quantity, designs }} />
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProductConfigPage;