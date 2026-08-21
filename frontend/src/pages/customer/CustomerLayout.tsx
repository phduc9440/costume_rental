import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { removeToken } from '../../utils/auth';
import { useCart } from '../../context/CartContext';

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems, clearCart } = useCart();

  const handleLogout = () => {
    clearCart();
    removeToken();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/customer/home' },
    { name: 'Costumes', path: '/customer/costumes' },
    { name: 'Rentals', path: '/customer/rentals' },
    { name: 'Profile', path: '/customer/profile' },
  ];

  return (
    <div className="customer-portal">
      <nav className="glass-panel customer-navbar">
        <div className="nav-brand">
          <h2>Costume Rental</h2>
        </div>
        
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
          
          <Link 
            to="/customer/cart" 
            className={`nav-link cart-link ${location.pathname === '/customer/cart' ? 'active' : ''}`}
            style={{ position: 'relative' }}
          >
            🛒 Cart
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>

          <button 
            onClick={handleLogout} 
            className="btn btn-primary" 
            style={{ width: 'auto', marginLeft: '20px', padding: '8px 20px' }}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="main-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
