import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { removeToken } from '../../utils/auth';
import { useCart } from '../../context/CartContext';

const navItems = [
  { name: 'Trang chủ', path: '/customer/home' },
  { name: 'Trang phục', path: '/customer/costumes' },
  { name: 'Đơn thuê', path: '/customer/rentals' },
  { name: 'Tài khoản', path: '/customer/profile' },
];

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems, clearCart } = useCart();

  // Prefix match so /customer/rentals/:id keeps "Đơn thuê" highlighted.
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    clearCart();
    removeToken();
    navigate('/login');
  };

  return (
    <div className="customer-portal">
      <nav className="customer-navbar">
        <Link to="/customer/home" className="nav-brand">
          <span className="nav-logo">🎭</span>
          <span className="nav-brand-text">Costume Rental</span>
        </Link>

        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <Link
            to="/customer/cart"
            className={`nav-cart ${isActive('/customer/cart') ? 'active' : ''}`}
            title="Giỏ hàng"
          >
            🛒
            <span className="nav-cart-label">Giỏ hàng</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          <button onClick={handleLogout} className="btn outline nav-logout">
            Đăng xuất
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="main-container" key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
