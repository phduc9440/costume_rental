import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { rentalApi } from "../../api/rentalApi";
import { getUserIdFromToken } from "../../utils/auth";
import { useState } from "react";
import { formatVND } from "../../utils/format";

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
      setError("Vui lòng đăng nhập để hoàn tất đơn thuê.");
      return;
    }

    if (items.length === 0) {
      setError("Giỏ hàng đang trống.");
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
      setError(err.response?.data?.message || "Không thể tạo đơn thuê. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="dashboard-header">
        <div>
          <h2 className="page-title">Giỏ hàng</h2>
          <p className="page-sub">Kiểm tra trang phục và chọn ngày trả trước khi xác nhận.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="glass-panel empty-state">
          <div className="empty-icon">🛒</div>
          <p>Giỏ hàng của bạn đang trống.</p>
          <button className="btn btn-primary" onClick={() => navigate('/customer/costumes')} style={{ width: 'auto', padding: '12px 30px' }}>
            Xem trang phục
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-list">
            {items.map((item) => (
              <div key={item.costume.id} className="glass-panel cart-item-card" style={{ display: 'flex', padding: '16px 20px', marginBottom: '14px', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '2.5rem', background: 'linear-gradient(135deg, #efe9ff, #fbe7f3)', width: '72px', height: '72px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                  🎭
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{item.costume.name}</h3>
                  <p style={{ color: 'var(--primary-color)', fontWeight: '600' }}>{formatVND(item.costume.price)} / ngày</p>
                </div>
                <div className="rd-qty-control">
                  <button
                    className="rd-qty-btn"
                    onClick={() => updateQuantity(item.costume.id, item.quantity - 1)}
                    aria-label="Giảm số lượng"
                  >
                    −
                  </button>
                  <span className="rd-qty-value">{item.quantity}</span>
                  <button
                    className="rd-qty-btn"
                    onClick={() => updateQuantity(item.costume.id, item.quantity + 1)}
                    aria-label="Tăng số lượng"
                  >
                    +
                  </button>
                </div>
                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>{formatVND(item.costume.price * item.quantity)}</p>
                  <button 
                    onClick={() => removeFromCart(item.costume.id)}
                    style={{ color: 'var(--error-color)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', marginTop: '4px' }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel order-summary" style={{ padding: '30px', position: 'sticky', top: '92px' }}>
            <h3 style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>Tóm tắt đơn hàng</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Trang phục ({items.length})</span>
              <span>{formatVND(totalAmount)}</span>
            </div>
            <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>Ngày trả dự kiến</label>
              <input 
                type="date" 
                className="form-control" 
                value={dueDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ 
                  background: 'var(--surface-2)', 
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-color)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  width: '100%'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontSize: '1.25rem', fontWeight: '700' }}>
              <span>Tổng cộng</span>
              <span style={{ color: 'var(--primary-color)' }}>{formatVND(totalAmount)}</span>
            </div>
            
            {error && <p style={{ color: 'var(--error-color)', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>}
            
            <button 
              className="btn btn-primary" 
              onClick={handleCheckout} 
              disabled={loading}
              style={{ width: '100%', padding: '15px' }}
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận thuê'}
            </button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Bằng việc xác nhận, bạn đồng ý với điều khoản thuê của cửa hàng.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
