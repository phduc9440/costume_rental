import "./AdminLayout.css";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <h3>Quản lý Khách hàng</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Xem và quản lý danh sách khách hàng
          </p>
        </div>

        <div className="glass-panel stat-card">
          <h3>Quản lý Nhân viên</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Xem và quản lý danh sách nhân viên
          </p>
        </div>

        <div className="glass-panel stat-card">
          <h3>Quản lý Đơn thuê</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Xem và quản lý các đơn thuê trang phục
          </p>
        </div>
      </div>
    </div>
  );
}
