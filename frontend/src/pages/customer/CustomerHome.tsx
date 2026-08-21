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
        <p>Loading your experience...</p>
      </div>
    );

  return (
    <div className="customer-home">
      <section className="hero-section">
        <h1>Welcome back, {profile?.name || "Customer"}!</h1>
        <p>Ready to find your next perfect look? Our latest collections are waiting for you.</p>
        
        <Link to="/customer/costumes" className="btn btn-primary" style={{ width: 'auto', padding: '16px 32px', fontSize: '1.1rem' }}>
          Explore Costumes
        </Link>
      </section>

      <div className="quick-actions-grid">
        <Link to="/customer/costumes" className="glass-panel action-card">
          <div className="icon-box">🎭</div>
          <h3>Browse Collection</h3>
          <p>Explore our wide range of unique and high-quality costumes for any occasion.</p>
        </Link>

        <Link to="/customer/rentals" className="glass-panel action-card">
          <div className="icon-box">📜</div>
          <h3>My Rentals</h3>
          <p>Track your active rentals, view history, and manage your current orders.</p>
        </Link>

        <Link to="/customer/profile" className="glass-panel action-card">
          <div className="icon-box">👤</div>
          <h3>Account Settings</h3>
          <p>Update your personal information and manage your contact preferences.</p>
        </Link>
      </div>
    </div>
  );
}
