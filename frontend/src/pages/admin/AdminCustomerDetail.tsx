import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { customerApi } from "../../api/customerApi";
import type { Customer } from "../../types/customer";
import type { RentalOrder, RentalStatus } from "../../types/rental";
import "./AdminLayout.css";

// --- Constants ---
const STATUS_CONFIG: Record<RentalStatus, { label: string; cls: string; icon: string }> = {
  PENDING:      { label: "Chờ xác nhận", cls: "warning", icon: "⏳" },
  CONFIRMED:    { label: "Đã xác nhận",  cls: "info",    icon: "✅" },
  DEPOSIT_PAID: { label: "Đã đặt cọc",   cls: "info",    icon: "💰" },
  RENTING:      { label: "Đang thuê",    cls: "success", icon: "👗" },
  CANCELLED:    { label: "Đã hủy",       cls: "danger",  icon: "❌" },
  COMPLETED:    { label: "Hoàn thành",   cls: "success", icon: "🎉" },
};

function StatusBadge({ status }: { status: RentalStatus }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, cls: "", icon: "●" };
  return (
    <span className={`badge ${cfg.cls}`} style={{ fontSize: "0.8rem", padding: "4px 10px" }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

export default function AdminCustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchCustomer = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await customerApi.getCustomerById(id, page);
      if (res.data.result) {
        setCustomer(res.data.result);
      }
    } catch (err) {
      setError("Không thể tải thông tin khách hàng.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, page]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  if (loading && !customer) {
    return <div className="admin-page"><div className="loading-spinner" /></div>;
  }

  if (error || !customer) {
    return (
      <div className="admin-page">
        <div className="glass-panel admin-card" style={{ textAlign: "center", padding: 60 }}>
          <p style={{ color: "var(--error-color)" }}>{error ?? "Khách hàng không tồn tại."}</p>
          <button className="btn outline" style={{ marginTop: 16, width: "auto" }} onClick={() => navigate("/admin/customers")}>Quay lại danh sách</button>
        </div>
      </div>
    );
  }

  const rentalHistory = customer.rentalHistory;

  return (
    <div className="admin-page">
      <div className="admin-header" style={{ padding: 0, marginBottom: 24 }}>
        <div>
          <button 
            className="btn outline" 
            style={{ width: "auto", marginBottom: 12, padding: "6px 16px", fontSize: '0.85rem' }} 
            onClick={() => navigate("/admin/customers")}
          >
            Quay lại danh sách
          </button>
          <h1 style={{ fontSize: "1.8rem" }}>Chi tiết khách hàng</h1>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button 
            className="btn btn-primary" 
            style={{ width: "auto", padding: '10px 24px' }} 
            onClick={() => {
              alert("Tính năng chỉnh sửa đang được phát triển.");
            }}
          >
            Sửa thông tin
          </button>
          <button 
            className="btn outline" 
            style={{ 
              width: "auto", 
              padding: '10px 24px', 
              color: 'var(--error-color)',
              borderColor: 'rgba(239, 68, 68, 0.3)'
            }} 
            onClick={async () => {
              if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
                try {
                  await customerApi.deleteCustomer(customer.id);
                  navigate("/admin/customers");
                } catch (err) {
                  alert("Xóa khách hàng thất bại.");
                }
              }
            }}
          >
            Xóa khách hàng
          </button>
        </div>
      </div>

      <div className="admin-grid" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
        {/* Left Column: Profile Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="glass-panel admin-card profile-card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div className="avatar-placeholder" style={{ 
              width: 100, 
              height: 100, 
              borderRadius: '50%', 
              background: 'var(--primary-gradient)', 
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              color: 'white',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
            }}>
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ margin: '0 0 8px' }}>{customer.name}</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>@{customer.username}</p>
            
            <div style={{ marginTop: 24, padding: '20px 0', borderTop: '1px solid var(--border-color)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Số điện thoại</span>
                <strong style={{ fontSize: '1.05rem' }}>{customer.phone || "N/A"}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Email</span>
                <strong style={{ fontSize: '1.05rem' }}>{customer.email || "N/A"}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Địa chỉ</span>
                <strong style={{ fontSize: '1.05rem' }}>{customer.address || "N/A"}</strong>
              </div>
            </div>
          </div>

          <div className="glass-panel admin-card">
            <h3 style={{ marginBottom: 16 }}>📊 Thống kê nhanh</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
              <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tổng số đơn hàng</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: 4 }}>{rentalHistory?.totalElements || 0}</div>
              </div>
              <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tổng chi tiêu</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: 4, color: 'var(--success-color)' }}>
                  {(customer.totalSpent || 0).toLocaleString()}đ
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Rental History */}
        <div className="glass-panel admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ margin: 0 }}>📜 Lịch sử thuê đồ</h3>
            <span className="badge info">{rentalHistory?.totalElements || 0} đơn hàng</span>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày tạo</th>
                  <th>Hạn trả</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: "right" }}>Tổng tiền</th>
                  <th style={{ textAlign: "center" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {rentalHistory?.data.map((order: RentalOrder) => (
                  <tr key={order.id}>
                    <td>
                      <strong style={{ color: 'var(--primary-color)' }}>#{order.id.substring(0, 8).toUpperCase()}</strong>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.type}</p>
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {new Date(order.createDate).toLocaleDateString()}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: order.dueDate && new Date(order.dueDate) < new Date() && order.status !== 'COMPLETED' ? 'var(--error-color)' : 'inherit' }}>
                      {order.dueDate ? new Date(order.dueDate).toLocaleDateString() : "-"}
                    </td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>
                      {order.totalAmount.toLocaleString()}đ
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '6px 16px', fontSize: '0.8rem', width: 'auto' }}
                        onClick={() => navigate(`/admin/rentals/${order.id}`)}
                      >
                        Chi tiết đơn
                      </button>
                    </td>
                  </tr>
                ))}
                {(!rentalHistory || rentalHistory.data.length === 0) && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
                      Chưa có lịch sử thuê đồ.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {rentalHistory && rentalHistory.totalPages > 1 && (
            <div className="pagination" style={{ marginTop: 24 }}>
              <button 
                disabled={page === 1} 
                className="page-btn" 
                onClick={() => setPage(p => p - 1)}
              >
                &lsaquo;
              </button>
              {[...Array(rentalHistory.totalPages)].map((_, i) => (
                <button 
                  key={i + 1} 
                  className={`page-btn ${page === i + 1 ? "active" : ""}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                disabled={page === rentalHistory.totalPages} 
                className="page-btn" 
                onClick={() => setPage(p => p + 1)}
              >
                &rsaquo;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
