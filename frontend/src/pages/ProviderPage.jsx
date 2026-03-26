import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProviderPage = () => {
  const { state } = useLocation();
  const { material, quantity } = state || {};
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    if (material && quantity) {
      fetchProviders();
    }
  }, [material, quantity]);

  const fetchProviders = async () => {
    try {
      const res = await axios.get(`/api/providers/eligible?material=${material}&quantity=${quantity}`);
      setProviders(res.data);
    } catch (error) {
      console.error("Error fetching providers", error);
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>Available Providers</h2>

      {providers.length === 0 ? (
        <p>No providers match your requirements</p>
      ) : (
        providers.map((p, index) => (
          <div key={index} style={{ background: '#eee', padding: '10px', margin: '10px' }}>
            <h3>{p.name}</h3>
            <p>Email: {p.email}</p>
            <p>Rating: {p.rating}</p>
            <p>Materials: {p.materials?.map(pm => pm.material.name).join(', ')}</p>
            <p>Capacity: {p.capacities?.[0]?.minQty} - {p.capacities?.[0]?.maxQty}</p>
            <p>Pricing: {p.pricingTiers?.map(pt => `${pt.minQty}-${pt.maxQty}: Rs.${pt.pricePerUnit}`).join(', ')}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProviderPage;