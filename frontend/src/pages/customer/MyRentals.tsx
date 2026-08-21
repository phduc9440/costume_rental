import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { rentalApi } from "../../api/rentalApi";
import type { RentalOrder, RentalStatus } from "../../types/rental";
import { getUserIdFromToken } from "../../utils/auth";

const STATUS_CONFIG: Record<
  RentalStatus,
  { label: string; cls: string; icon: string }
> = {
  PENDING: { label: "Chờ xác nhận", cls: "warning", icon: "⏳" },
  CONFIRMED: { label: "Đã xác nhận", cls: "info", icon: "✅" },
  DEPOSIT_PAID: { label: "Đã đặt cọc", cls: "info", icon: "💰" },
  RENTING: { label: "Đang thuê", cls: "success", icon: "👗" },
  CANCELLED: { label: "Đã hủy", cls: "danger", icon: "❌" },
  COMPLETED: { label: "Hoàn thành", cls: "success", icon: "🎉" },
};

function StatusBadge({ status }: { status: RentalStatus }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, cls: "", icon: "●" };
  return (
    <span className={`badge ${cfg.cls}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

export default function MyRentals() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchOrders = useCallback(() => {
    const userId = getUserIdFromToken();
    if (!userId) return;
    setLoading(true);
    rentalApi
      .getMyOrders(userId, 1, 50)
      .then((res) => {
        setOrders(res.data.result?.data ?? []);
        setError(null);
      })
      .catch(() => setError("Không thể tải danh sách đơn hàng."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="my-rentals">
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: "28px" }}>
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700 }}>
            📋 Đơn thuê của tôi
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              marginTop: 4,
              fontSize: "0.9rem",
            }}
          >
            Quản lý và theo dõi các đơn thuê trang phục
          </p>
        </div>
        <button
          className="btn btn-primary"
          style={{ width: "auto", padding: "10px 20px" }}
          onClick={fetchOrders}
        >
          🔄 Làm mới
        </button>
      </div>

      {/* Body */}
      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "60px" }}
        >
          <div className="loading-spinner" />
        </div>
      ) : error ? (
        <div className="glass-panel stat-card" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--error-color)" }}>{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div
          className="glass-panel stat-card"
          style={{ textAlign: "center", padding: "60px" }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎭</div>
          <h3 style={{ color: "var(--text-light)", marginBottom: 8 }}>
            Chưa có đơn thuê nào
          </h3>
          <p style={{ color: "var(--text-muted)" }}>
            Hãy khám phá bộ sưu tập trang phục!
          </p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: "hidden" }}>
          <table className="mr-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Loại</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: "right" }}>Tổng tiền</th>
                <th style={{ textAlign: "right" }}>Số lượng</th>
                <th style={{ textAlign: "center" }}>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="mr-table-row">
                  <td>
                    <span className="mr-order-id">
                      #{order.id.substring(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td
                    style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}
                  >
                    {new Date(order.createDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    <span className="badge">
                      {order.type === "ONLINE" ? "🌐 Online" : "🏪 Offline"}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 700,
                      color: "var(--primary-color)",
                    }}
                  >
                    {(order.totalAmount ?? 0).toLocaleString("vi-VN")}đ
                  </td>
                  <td
                    style={{ textAlign: "right", color: "var(--text-muted)" }}
                  >
                    {order.rentalDetailResponses?.length ?? 0} món
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="mr-action-btn detail"
                      onClick={() => navigate(`/customer/rentals/${order.id}`)}
                    >
                      👁 Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
