import React from 'react';

const ProviderCard = ({ provider }) => {
    return (
        <div style={{
            background: '#020617',
            padding: '20px',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
            transition: '0.3s'
        }}>
            <h3>{provider.name}</h3>

            <p style={{ color: '#94a3b8' }}>
                Materials: {provider.materials.join(', ')}
            </p>

            <p>💰 Rs. {provider.price}</p>
            <p>⭐ {provider.rating}</p>

            <button style={{
                marginTop: '10px',
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: '#6366f1',
                color: '#fff',
                cursor: 'pointer'
            }}>
                Select Provider
            </button>
        </div>
    );
};

export default ProviderCard;