import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { removeToken, getUserIdFromToken, getRoleFromToken } from '../../utils/auth';
import './AdminLayout.css';

const navGroups = [
  {
    label: 'Tổng quan',
    items: [
      { name: 'Bảng điều khiển', path: '/admin/dashboard', icon: '📊' },
      { name: 'Doanh thu', path: '/admin/revenue', icon: '💰' },
    ],
  },
  {
    label: 'Nghiệp vụ',
    items: [
      { name: 'Đơn thuê', path: '/admin/rentals', icon: '📋' },
      { name: 'Nhận trả', path: '/admin/returns', icon: '🔄' },
      { name: 'Lỗi & phạt', path: '/admin/errors', icon: '⚖️' },
    ],
  },
  {
    label: 'Danh mục',
    items: [
      { name: 'Khách hàng', path: '/admin/customers', icon: '👥' },
      { name: 'Nhân viên', path: '/admin/employees', icon: '👤' },
      { name: 'Trang phục', path: '/admin/costumes', icon: '👕' },
      { name: 'Nhà cung cấp', path: '/admin/suppliers', icon: '🏭' },
    ],
  },
];

const allItems = navGroups.flatMap((g) => g.items);

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = getUserIdFromToken();
  const roleLabel = getRoleFromToken() === 'ROLE_EMPLOYEE' ? 'Nhân viên' : 'Quản trị viên';

  // Prefix match so detail pages (e.g. /admin/rentals/123) keep their section highlighted.
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');
  const current = allItems.find((item) => isActive(item.path));

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">🎭</span>
          <div className="sidebar-brand">
            <strong>Costume Rental</strong>
            <span>Trang quản trị</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.label} className="sidebar-group">
              <p className="sidebar-group-label">{group.label}</p>
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.name}
                  className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.name}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout" title="Đăng xuất">
            <span className="icon">🚪</span>
            <span className="label">Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="topbar-eyebrow">Costume Rental</p>
            <h1 className="topbar-title">{current?.name || 'Quản trị'}</h1>
          </div>

          <div className="user-info">
            <div className="user-details">
              <p className="user-name">{userId || 'Administrator'}</p>
              <p className="user-role">{roleLabel}</p>
            </div>
            <div className="user-avatar">{userId?.substring(0, 1).toUpperCase() || 'A'}</div>
          </div>
        </header>

        <section className="admin-content" key={location.pathname}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
