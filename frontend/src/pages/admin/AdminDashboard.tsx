import { Link } from "react-router-dom";
import "./AdminLayout.css";

const shortcuts = [
  { icon: "📋", title: "Quản lý Đơn thuê", desc: "Xem và quản lý các đơn thuê trang phục", path: "/admin/rentals" },
  { icon: "🔄", title: "Xử lý Trả đồ", desc: "Tiếp nhận và kiểm tra trang phục trả lại", path: "/admin/returns" },
  { icon: "💰", title: "Thống kê Doanh thu", desc: "Theo dõi doanh thu theo thời gian", path: "/admin/revenue" },
  { icon: "👥", title: "Quản lý Khách hàng", desc: "Xem và quản lý danh sách khách hàng", path: "/admin/customers" },
  { icon: "👤", title: "Quản lý Nhân viên", desc: "Xem và quản lý danh sách nhân viên", path: "/admin/employees" },
  { icon: "👕", title: "Quản lý Trang phục", desc: "Cập nhật kho trang phục cho thuê", path: "/admin/costumes" },
];

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Xin chào 👋</h2>
          <p style={{ color: "var(--text-muted)", marginTop: 4 }}>Chọn một mục để bắt đầu làm việc.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {shortcuts.map((s, i) => (
          <Link
            key={s.path}
            to={s.path}
            className="glass-panel stat-card action-card"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="icon-box">{s.icon}</div>
            <h3 style={{ color: "var(--text-light)", fontSize: "1.05rem" }}>{s.title}</h3>
            <p style={{ fontSize: "0.9rem", fontWeight: 400, color: "var(--text-muted)" }}>{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
