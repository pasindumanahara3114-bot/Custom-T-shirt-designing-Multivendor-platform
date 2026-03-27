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
            <h3 style={{ color: 'var(--text)' }}>{provider.name}</h3>

            <p style={{ color: 'var(--muted)' }}>
                Materials: {provider.materials.join(', ')}
            </p>

            <p style={{ color: 'var(--text)' }}>💰 Rs. {provider.price}</p>
            <p style={{ color: 'var(--text)' }}>⭐ {provider.rating}</p>

            <button
                onClick={() => navigate('/order', { state: { provider, config } })}
                style={{
                    marginTop: '10px',
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--accent)',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '600'
                }}
            >
                Select Provider
            </button>
        </div>
    );
};

export default ProviderCard;