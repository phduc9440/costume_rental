import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { rentalApi } from "../../api/rentalApi";
import { getUserIdFromToken } from "../../utils/auth";
import { useState } from "react";

export default function CartPage() {
  const { items, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  const handleCheckout = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setError("Please login to complete your rental.");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError(null);

    const request = {
      customerId: userId,
      items: items.map((item) => ({
        costumeId: item.costume.id,
        quantity: item.quantity,
      })),
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined
    };

    try {
      await rentalApi.createOnlineOrder(request);
      clearCart();
      navigate("/customer/rentals");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create rental order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="dashboard-header" style={{ marginBottom: '32px' }}>
        <h2>Shopping Cart</h2>
      </div>

      {items.length === 0 ? (
        <div className="glass-panel stat-card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛒</div>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Your cart is feeling a bit lonely.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/customer/costumes')} style={{ width: 'auto', padding: '12px 30px' }}>
            Browse Costumes
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', alignItems: 'start' }}>
          <div className="cart-items-list">
            {items.map((item) => (
              <div key={item.costume.id} className="glass-panel cart-item-card" style={{ display: 'flex', padding: '20px', marginBottom: '20px', alignItems: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginRight: '24px', background: '#f1f5f9', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                  🎭
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{item.costume.name}</h3>
                  <p style={{ color: 'var(--primary-color)', fontWeight: '600' }}>${item.costume.price} / day</p>
                </div>
                <div className="quantity-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '0 40px' }}>
                  <button 
                    className="btn-icon" 
                    onClick={() => updateQuantity(item.costume.id, item.quantity - 1)}
                    style={{ background: '#f1f5f9', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                  <button 
                    className="btn-icon" 
                    onClick={() => updateQuantity(item.costume.id, item.quantity + 1)}
                    style={{ background: '#f1f5f9', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>
                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>${item.costume.price * item.quantity}</p>
                  <button 
                    onClick={() => removeFromCart(item.costume.id)}
                    style={{ color: 'var(--error-color)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', marginTop: '4px' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel order-summary" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Items ({items.length})</span>
              <span>${totalAmount}</span>
            </div>
            <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>Return Date (Hạn trả):</label>
              <input 
                type="date" 
                className="form-control" 
                value={dueDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-color)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  width: '100%'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontSize: '1.25rem', fontWeight: '700' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary-color)' }}>${totalAmount}</span>
            </div>
            
            {error && <p style={{ color: 'var(--error-color)', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>}
            
            <button 
              className="btn btn-primary" 
              onClick={handleCheckout} 
              disabled={loading}
              style={{ width: '100%', padding: '15px' }}
            >
              {loading ? 'Processing...' : 'Confirm Rental'}
            </button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              By confirming, you agree to our Terms of Service
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
