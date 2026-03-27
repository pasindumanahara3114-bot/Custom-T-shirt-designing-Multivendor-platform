import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import ProviderCard from '../../components/shared/ProviderCard';

const mockProviders = [
    {
        id: 1,
        name: "PrintHub Lanka",
        materials: ["cotton", "polyester"],
        minQty: 10,
        maxQty: 500,
        price: 1200,
        rating: 4.5
    },
    {
        id: 2,
        name: "FastPrint",
        materials: ["cotton"],
        minQty: 1,
        maxQty: 50,
        price: 1500,
        rating: 4.2
    },
    {
        id: 3,
        name: "BulkWear",
        materials: ["polyester"],
        minQty: 50,
        maxQty: 1000,
        price: 900,
        rating: 4.8
    }
];

const ProductConfigPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { designs } = location.state || { designs: null };

    const [material, setMaterial] = useState('cotton');
    const [quantity, setQuantity] = useState(10);

    const filteredProviders = mockProviders.filter(p =>
        p.materials.includes(material) &&
        quantity >= p.minQty &&
        quantity <= p.maxQty
    );

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
                        <option value="cotton">Cotton</option>
                        <option value="polyester">Polyester</option>
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

                    {filteredProviders.length === 0 && (
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