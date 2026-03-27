import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { vendorService } from '../../api';
import MainLayout from "../../layouts/MainLayout";

const ProviderPage = () => {
  const { state } = useLocation();
  const { material, quantity } = state || {};
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (material && quantity) {
      fetchProviders();
    }
  }, [material, quantity]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const data = await vendorService.getEligibleVendors(material, quantity);
      setProviders(data);
    } catch (error) {
      console.error("Error fetching providers", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: '40px' }}>
        <h2>Available Providers</h2>
        {loading ? (
          <p>Finding the best providers for you...</p>
        ) : providers.length === 0 ? (
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