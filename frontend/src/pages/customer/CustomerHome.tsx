import { useNavigate, Link } from "react-router-dom";
import { getUserIdFromToken } from "../../utils/auth";
import { useEffect, useState } from "react";
import { customerApi } from "../../api/customerApi";
import type { Customer } from "../../types/customer";

export default function CustomerHome() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) {
      navigate("/login");
      return;
    }

    customerApi.getMyProfile()
      .then((profileRes) => {
        setProfile(profileRes.data.result);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading)
    return (
      <div className="dashboard-container">
        <div className="loading-spinner"></div>
      </div>
    );

  return (
    <div className="customer-home">
      <section className="hero-section">
        <h1>Xin chào, {profile?.name || "bạn"}! 👋</h1>
        <p>Tìm bộ trang phục hoàn hảo cho sự kiện sắp tới — bộ sưu tập mới nhất đang chờ bạn.</p>
        
        <Link to="/customer/costumes" className="btn btn-primary" style={{ width: 'auto', padding: '16px 32px', fontSize: '1.1rem' }}>
          Khám phá trang phục
        </Link>
      </section>

      <div className="quick-actions-grid">
        <Link to="/customer/costumes" className="glass-panel action-card">
          <div className="icon-box">🎭</div>
          <h3>Xem bộ sưu tập</h3>
          <p>Hàng trăm trang phục độc đáo, chất lượng cho mọi dịp.</p>
        </Link>

        <Link to="/customer/rentals" className="glass-panel action-card">
          <div className="icon-box">📜</div>
          <h3>Đơn thuê của tôi</h3>
          <p>Theo dõi đơn đang thuê, lịch sử và quản lý đơn hiện tại.</p>
        </Link>

        <Link to="/customer/profile" className="glass-panel action-card">
          <div className="icon-box">👤</div>
          <h3>Tài khoản</h3>
          <p>Xem và cập nhật thông tin cá nhân, liên hệ.</p>
        </Link>
      </div>
    </div>
  );
}
