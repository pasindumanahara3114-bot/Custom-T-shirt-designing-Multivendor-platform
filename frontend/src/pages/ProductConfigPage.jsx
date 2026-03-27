import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProviderCard from '../components/ProviderCard';

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

    const [material, setMaterial] = useState('cotton');
    const [size, setSize] = useState('M');
    const [quantity, setQuantity] = useState(10);

    // 🔥 FILTER LOGIC (CORE FEATURE)
    const filteredProviders = mockProviders.filter(p =>
        p.materials.includes(material) &&
        quantity >= p.minQty &&
        quantity <= p.maxQty
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg1)', color: 'var(--text)', padding: '40px' }}>

            {/* LEFT PANEL */}
            <div style={{
                width: '320px',
                padding: '24px',
                borderRight: '1px solid var(--stroke)'
            }}>
                <h2 style={{ marginBottom: '20px' }}>Customize Product</h2>

                {/* MATERIAL */}
                <label>Material</label>
                <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="field"
                >
                    <option value="cotton">Cotton</option>
                    <option value="polyester">Polyester</option>
                </select>

                {/* SIZE */}
                <label style={{ marginTop: '16px' }}>Size</label>
                <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="field"
                >
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                </select>

                {/* QUANTITY */}
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
                    style={{ marginBottom: '16px', padding: '10px 16px', borderRadius: '8px', background: 'var(--good)', border: 'none', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
                    onClick={() => navigate('/providers', { state: { material, quantity } })}
                >
                    View All Eligible Providers
                </button>

                {/* EMPTY STATE */}
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

                {/* GRID */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '20px'
                }}>
                    {filteredProviders.map(p => (
                        <ProviderCard key={p.id} provider={p} />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default ProductConfigPage;