import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api";

const ProviderDashboard = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [minQty, setMinQty] = useState(1);
  const [maxQty, setMaxQty] = useState(100);

  const [pricing, setPricing] = useState([
    { minQty: 1, maxQty: 10, pricePerUnit: 1500 }
  ]);

  // 🔥 LOAD MATERIALS FROM BACKEND
  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`${API_BASE}/providers/materials`);
      setAvailableMaterials(res.data);
    } catch (error) {
      console.error("❌ Error fetching materials", error);
    }
  };

  // ✅ SELECT MATERIAL
  const toggleMaterial = (matId) => {
    setSelectedMaterials(prev =>
      prev.includes(matId)
        ? prev.filter(id => id !== matId)
        : [...prev, matId]
    );
  };

  // ✅ ADD PRICE TIER
  const addPricingTier = () => {
    setPricing([
      ...pricing,
      { minQty: 1, maxQty: 10, pricePerUnit: 1000 }
    ]);
  };

  // ✅ UPDATE PRICE TIER
  const updatePricing = (index, field, value) => {
    const newPricing = [...pricing];
    newPricing[index][field] = Number(value);
    setPricing(newPricing);
  };

  // ✅ SUBMIT PROVIDER
  const handleSubmit = async () => {
    const provider = {
      name,
      email,
      rating: 0.0,

      materials: selectedMaterials.map(matId => ({
        material: { id: matId }
      })),

      capacities: [
        {
          minQty: Number(minQty),
          maxQty: Number(maxQty)
        }
      ],

      pricingTiers: pricing.map(p => ({
        minQty: Number(p.minQty),
        maxQty: Number(p.maxQty),
        pricePerUnit: Number(p.pricePerUnit)
      }))
    };

    try {
      console.log("🚀 Sending:", provider);

      await axios.post(`${API_BASE}/providers`, provider);

      alert("✅ Provider Saved Successfully!");

      // 🔥 RESET FORM
      setName("");
      setEmail("");
      setSelectedMaterials([]);
      setMinQty(1);
      setMaxQty(100);
      setPricing([{ minQty: 1, maxQty: 10, pricePerUnit: 1500 }]);

    } catch (error) {
      console.error("❌ Error saving provider:", error);
      alert("Error saving provider. Check console.");
    }
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h2>🏭 Provider Dashboard</h2>

      {/* BASIC INFO */}
      <input
        placeholder="Provider Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="field"
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="field"
      />

      {/* MATERIALS */}
      <h4>Materials</h4>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {availableMaterials.map(mat => (
          <button
            key={mat.id}
            onClick={() => toggleMaterial(mat.id)}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              background: selectedMaterials.includes(mat.id)
                ? "#22c55e"
                : "#334155",
              color: "white"
            }}
          >
            {mat.name}
          </button>
        ))}
      </div>

      {/* CAPACITY */}
      <h4 style={{ marginTop: "20px" }}>Capacity</h4>

      <input
        type="number"
        placeholder="Min Quantity"
        value={minQty}
        onChange={(e) => setMinQty(e.target.value)}
        className="field"
      />

      <input
        type="number"
        placeholder="Max Quantity"
        value={maxQty}
        onChange={(e) => setMaxQty(e.target.value)}
        className="field"
      />

      {/* PRICING */}
      <h4 style={{ marginTop: "20px" }}>Pricing Tiers</h4>

      {pricing.map((p, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <input
            placeholder="Min Qty"
            value={p.minQty}
            onChange={(e) => updatePricing(i, "minQty", e.target.value)}
            className="field"
          />

          <input
            placeholder="Max Qty"
            value={p.maxQty}
            onChange={(e) => updatePricing(i, "maxQty", e.target.value)}
            className="field"
          />

          <input
            placeholder="Price per Unit"
            value={p.pricePerUnit}
            onChange={(e) => updatePricing(i, "pricePerUnit", e.target.value)}
            className="field"
          />
        </div>
      ))}

      <button className="btn" onClick={addPricingTier}>
        + Add Pricing Tier
      </button>

      {/* SUBMIT */}
      <br /><br />

      <button className="btn btnGood" onClick={handleSubmit}>
        💾 Save Provider
      </button>
    </div>
  );
};

export default ProviderDashboard;