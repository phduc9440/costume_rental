import { useState, useEffect } from "react";
import { rentalApi } from "../../api/rentalApi";
import type { RentalOrder, RentalStatus } from "../../types/rental";
import "./AdminLayout.css";
import { Link, useNavigate } from "react-router-dom";

const STATUS_META: Record<RentalStatus, { label: string; cls: string }> = {
  PENDING: { label: "Chờ xác nhận", cls: "warning" },
  CONFIRMED: { label: "Đã xác nhận", cls: "info" },
  DEPOSIT_PAID: { label: "Đã đặt cọc", cls: "info" },
  RENTING: { label: "Đang thuê", cls: "success" },
  CANCELLED: { label: "Đã hủy", cls: "danger" },
  COMPLETED: { label: "Hoàn thành", cls: "success" },
};

export default function AdminRentalList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const statuses: RentalStatus[] = [
    "PENDING",
    "CONFIRMED",
    "DEPOSIT_PAID",
    "RENTING",
    "CANCELLED",
    "COMPLETED",
  ];

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await rentalApi.getAllOrders({
        page,
        size: 10,
        status: statusFilter || undefined,
      });

      if (response.data.result) {
        setOrders(response.data.result.data);
        setTotalPages(response.data.result.totalPages);
      }
    } catch (err) {
      setError("Failed to fetch rental orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (orderId: string, action: string) => {
    try {
      setLoading(true);
      switch (action) {
        case "confirm":
          await rentalApi.confirmOrder(orderId);
          break;
        case "deposit":
          await rentalApi.confirmDeposit(orderId);
          break;
        case "pickup":
          await rentalApi.pickupOrder(orderId);
          break;
        case "cancel": {
          const reason = window.prompt("Enter cancellation reason:");
          if (reason !== null) await rentalApi.cancelOrder(orderId, reason);
          break;
        }
      }
      fetchOrders();
    } catch (err) {
      alert("Thao tác thất bại");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: RentalStatus) =>
    `badge ${STATUS_META[status]?.cls ?? ""}`;

  return (
    <div className="admin-rental-list">
      <div className="dashboard-header">
        <div>
          <h2>Danh sách đơn thuê</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Xác nhận, giao đồ và theo dõi trạng thái đơn.</p>
        </div>
        <button 
          className="btn btn-primary" 
          style={{ width: 'auto' }}
          onClick={() => navigate("/admin/rentals/new")}
        >
          Tạo đơn hàng Offline
        </button>
      </div>

      <div className="glass-panel admin-card">
        <div className="search-bar">
          <select
            className="form-control"
            style={{ maxWidth: "200px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s as RentalStatus]?.label ?? s}
              </option>
            ))}
          </select>
        </div>

        {loading && orders.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Ngày tạo</th>
                  <th>Hạn trả</th>
                  <th style={{ textAlign: 'right' }}>Tổng tiền</th>
                  <th style={{ textAlign: 'right' }}>Đặt cọc</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <code>{order.id.substring(0, 8)}...</code>
                    </td>
                    <td>
                      <strong>{order.customerResponse?.name}</strong>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {order.customerResponse?.phone}
                      </p>
                    </td>
                     <td>{new Date(order.createDate).toLocaleDateString()}</td>
                     <td style={{ 
                       color: order.dueDate && new Date(order.dueDate) < new Date() && order.status !== 'COMPLETED' ? 'var(--error-color)' : 'inherit',
                       fontWeight: 500
                     }}>
                       {order.dueDate ? new Date(order.dueDate).toLocaleDateString() : "-"}
                     </td>
                     <td style={{ textAlign: "right", fontWeight: 500 }}>{order.totalAmount.toLocaleString()}đ</td>
                     <td style={{ textAlign: "right", fontWeight: 600, color: 'var(--primary-color)' }}>{order.deposit.toLocaleString()}đ</td>
                    <td>
                      <span className={getStatusBadgeClass(order.status)}>
                        {STATUS_META[order.status]?.label ?? order.status}
                      </span>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        {order.status === "PENDING" && (
                          <button
                            className="btn btn-primary"
                            style={{
                              padding: "4px 10px",
                              fontSize: "0.75rem",
                              width: "auto",
                            }}
                            onClick={() => handleAction(order.id, "confirm")}
                          >
                            Xác nhận
                          </button>
                        )}
                        {order.status === "CONFIRMED" && (
                          <button
                            className="btn btn-primary"
                            style={{
                              padding: "4px 10px",
                              fontSize: "0.75rem",
                              width: "auto",
                            }}
                            onClick={() => handleAction(order.id, "deposit")}
                          >
                            Nhận cọc
                          </button>
                        )}
                        {order.status === "DEPOSIT_PAID" && (
                          <button
                            className="btn btn-primary"
                            style={{
                              padding: "4px 10px",
                              fontSize: "0.75rem",
                              width: "auto",
                            }}
                            onClick={() => handleAction(order.id, "pickup")}
                          >
                            Giao đồ
                          </button>
                        )}
                        {["PENDING", "CONFIRMED", "DEPOSIT_PAID"].includes(
                          order.status,
                        ) && (
                          <button
                            className="btn outline"
                            style={{
                              padding: "4px 10px",
                              fontSize: "0.75rem",
                              width: "auto",
                              color: "var(--error-color)",
                            }}
                            onClick={() => handleAction(order.id, "cancel")}
                          >
                            Hủy đơn
                          </button>
                        )}
                        {["PENDING", "CONFIRMED"].includes(order.status) && (
                          <button
                            className="btn btn-primary"
                            style={{
                              padding: "4px 10px",
                              fontSize: "0.75rem",
                              width: "auto",
                              background: "var(--secondary-color)",
                            }}
                            onClick={() => navigate(`/admin/rentals/${order.id}?edit=true`)}
                          >
                            Sửa
                          </button>
                        )}
                        <Link
                          to={`/admin/rentals/${order.id}`}
                          className="btn outline"
                          style={{
                            padding: "4px 10px",
                            fontSize: "0.75rem",
                            width: "auto",
                            textDecoration: "none",
                          }}
                        >
                          Xem
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="page-btn"
                >
                  &lsaquo;
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`page-btn ${page === i + 1 ? "active" : ""}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="page-btn"
                >
                  &rsaquo;
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
