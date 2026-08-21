import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { removeToken, getUserIdFromToken } from '../../utils/auth';
import './AdminLayout.css';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = getUserIdFromToken();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Rentals', path: '/admin/rentals', icon: '📋' },
    { name: 'Returns', path: '/admin/returns', icon: '🔄' },
    { name: 'Errors', path: '/admin/errors', icon: '⚖️' },
    { name: 'Revenue', path: '/admin/revenue', icon: '💰' },
    { name: 'Customers', path: '/admin/customers', icon: '👥' },
    { name: 'Employees', path: '/admin/employees', icon: '👤' },
    { name: 'Costumes', path: '/admin/costumes', icon: '👕' },
    { name: 'Suppliers', path: '/admin/suppliers', icon: '🏭' },
  ];

  return (
    <div className="admin-layout">
      <aside className="glass-panel admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Portal</h2>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn outline" style={{ color: 'var(--error-color)' }}>
            🚪 <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="glass-panel admin-header">
          <div className="header-left">
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {navItems.find(item => item.path === location.pathname)?.name || 'Admin'}
            </h1>
          </div>
          
          <div className="user-info">
            <div className="user-avatar">
              {userId?.substring(0, 1).toUpperCase() || 'A'}
            </div>
            <div className="user-details">
              <p style={{ fontWeight: 500 }}>{userId || 'Administrator'}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Admin Account</p>
            </div>
          </div>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
