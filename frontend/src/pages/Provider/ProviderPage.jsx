import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import MainLayout from "../../layouts/MainLayout";

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
    <MainLayout>
      <div style={{ padding: '40px' }}>
        <h2>Available Providers</h2>
        {providers.length === 0 ? (
          <p>No providers match your requirements</p>
        ) : (
          providers.map((p, index) => (
            <div key={index} style={{ background: 'var(--card)', padding: '20px', margin: '10px 0', borderRadius: '12px', border: '1px solid var(--stroke)' }}>
              <h3>{p.name}</h3>
              <p>Email: {p.email}</p>
              <p>Rating: ⭐ {p.rating}</p>
              <p>Materials: {p.materials?.map(pm => pm.material.name).join(', ')}</p>
              <p>Capacity: {p.capacities?.[0]?.minQty} - {p.capacities?.[0]?.maxQty}</p>
              <p>Pricing: {p.pricingTiers?.map(pt => `${pt.minQty}-${pt.maxQty}: Rs.${pt.pricePerUnit}`).join(', ')}</p>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default ProviderPage;