import { useEffect, useState } from "react";
import { costumeApi } from "../../api/costumeApi";
import type { Costume } from "../../types/costume";
import { useCart } from "../../context/CartContext";

export default function CostumeList() {
  const [costumes, setCostumes] = useState<Costume[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    costumeApi
      .getAllCostumes()
      .then((res) => {
        if (res.data.result.data) {
          setCostumes(res.data.result.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (costume: Costume) => {
    addToCart(costume);
    setAddedId(costume.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="costume-list">
      <div className="dashboard-header" style={{ marginBottom: '24px' }}>
        <h2>Our Collection</h2>
      </div>

      {!loading ? (
        <div className="dashboard-grid">
          {costumes.map((costume) => (
            <div key={costume.id} className="glass-panel stat-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'all 0.3s ease' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🎭</div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '8px' }}>{costume.name}</h3>
              <p style={{ fontSize: "1.5rem", fontWeight: 'bold', color: 'var(--primary-color)' }}>${costume.price}</p>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: '4px' }}>
                Available: {costume.quantity}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <button 
                  className={`btn ${addedId === costume.id ? 'btn-success' : 'btn-primary'}`}
                  onClick={() => handleAddToCart(costume)}
                  disabled={costume.quantity <= 0}
                >
                  {addedId === costume.id ? '✓ Added' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Discovering amazing costumes for you...</p>
        </div>
      )}
    </div>
  );
}
