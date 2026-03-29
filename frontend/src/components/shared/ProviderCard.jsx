import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProviderCard = ({ provider, config }) => {
    const navigate = useNavigate();

    return (
        <div style={{
            background: 'var(--card)',
            padding: '20px',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
            border: '1px solid var(--stroke)',
            transition: '0.3s'
        }}>
            <h3 style={{ color: 'var(--text)', marginBottom: '8px' }}>
                {provider.name}
            </h3>

            {provider.location && (
                <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '6px' }}>
                    📍 {provider.location}
                </p>
            )}

            {provider.description && (
                <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '8px' }}>
                    {provider.description}
                </p>
            )}

            <p style={{ color: 'var(--accent2)', fontSize: '13px', marginBottom: '4px' }}>
                Materials: {provider.materials && provider.materials.length > 0
                    ? provider.materials.join(', ')
                    : 'N/A'}
            </p>

            <p style={{ color: 'var(--text)', marginBottom: '4px' }}>
                💰 Rs. {provider.price != null ? provider.price.toLocaleString() : 'N/A'} / unit
            </p>

            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '12px' }}>
                📦 Min: {provider.minQty} — Max: {provider.maxQty} pcs
            </p>

            <button
                onClick={() => navigate('/order', { state: { provider, config } })}
                style={{
                    marginTop: '4px',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--accent)',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: '0.2s'
                }}
            >
                Select Provider
            </button>
        </div>
    );
};

export default ProviderCard;