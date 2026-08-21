import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { rentalApi } from "../../api/rentalApi";
import { costumeApi } from "../../api/costumeApi";
import type { RentalOrder, RentalStatus, RentalItem } from "../../types/rental";
import type { Costume } from "../../types/costume";
import "./AdminLayout.css";

// ─── Constants ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<RentalStatus, { label: string; cls: string; icon: string }> = {
  PENDING:      { label: "Chờ xác nhận", cls: "warning", icon: "" },
  CONFIRMED:    { label: "Đã xác nhận",  cls: "info",    icon: "" },
  DEPOSIT_PAID: { label: "Đã đặt cọc",   cls: "info",    icon: "" },
  RENTING:      { label: "Đang thuê",    cls: "success", icon: "" },
  CANCELLED:    { label: "Đã hủy",       cls: "danger",  icon: "" },
  COMPLETED:    { label: "Hoàn thành",   cls: "success", icon: "" },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: RentalStatus }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, cls: "", icon: "●" };
  return (
    <span className={`badge ${cfg.cls}`} style={{ fontSize: "0.9rem", padding: "6px 14px" }}>
      {cfg.label}
    </span>
  );
}

// ─── Edit Section (Adapted for Admin) ──────────────────────────────────────────

function AdminEditSection({
  order,
  onSaved,
  onCancel,
}: {
  order: RentalOrder;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [items, setItems] = useState<{ costumeId: string; name: string; quantity: number; price: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [costumes, setCostumes] = useState<Costume[]>([]);
  const [costumeSearchTerm, setCostumeSearchTerm] = useState("");
  const [costumePage, setCostumePage] = useState(1);
  const [costumeTotalPages, setCostumeTotalPages] = useState(1);

  useEffect(() => {
    setItems(
      order.rentalDetailResponses.map((d) => ({
        costumeId: d.costumeResponse?.id ?? "",
        name: d.costumeResponse?.name ?? "Trang phục",
        quantity: d.quantity,
        price: d.costumeResponse?.price ?? 0,
      }))
    );
  }, [order]);

  useEffect(() => {
    loadCostumes();
  }, [costumeSearchTerm, costumePage]);

  const loadCostumes = async () => {
    try {
      setLoading(true);
      const res = await costumeApi.getAllCostumes(costumeSearchTerm, costumePage, 10);
      if (res.data.result) {
        setCostumes(res.data.result.data);
        setCostumeTotalPages(res.data.result.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = (idx: number, delta: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalPreview = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  const addItemByCostume = (costume: Costume) => {
    const existingIdx = items.findIndex(it => it.costumeId === costume.id);
    if (existingIdx >= 0) {
      updateQty(existingIdx, 1);
    } else {
      setItems(prev => [...prev, {
        costumeId: costume.id,
        name: costume.name,
        quantity: 1,
        price: costume.price
      }]);
    }
  };

  const handleSave = async () => {
    if (items.length === 0) {
      alert("Đơn hàng phải có ít nhất 1 trang phục.");
      return;
    }

    setLoading(true);
    try {
      await rentalApi.updateOrder(order.id, {
        customerId: order.customerResponse?.id ?? "",
        items: items.map((it) => ({ costumeId: it.costumeId, quantity: it.quantity })),
      });
      
      onSaved();
    } catch (err) {
      alert("Cập nhật đơn hàng thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel admin-card" style={{ marginTop: 24, border: "1px solid var(--primary-color)", padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ margin: 0 }}>Chế độ chỉnh sửa đơn hàng</h3>
        <button className="btn outline" style={{ width: 'auto' }} onClick={onCancel}>Thoát chỉnh sửa</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 1.2fr', gap: 24 }}>
        {/* Left Column: Costume Search & Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="search-bar" style={{ margin: 0 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></span>
              <input 
                className="form-control" 
                placeholder="Tìm tên trang phục để thêm..." 
                style={{ paddingLeft: 40 }}
                value={costumeSearchTerm}
                onChange={(e) => { setCostumeSearchTerm(e.target.value); setCostumePage(1); }}
              />
            </div>
          </div>

          <div className="admin-table-container" style={{ 
            maxHeight: '500px', 
            overflowY: 'auto', 
            background: 'rgba(0,0,0,0.1)', 
            borderRadius: 16,
            padding: 12,
            border: '1px solid var(--border-color)'
          }}>
            {costumes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {costumes.map(c => (
                  <div 
                    key={c.id} 
                    className="costume-pick-item" 
                    style={{ 
                      padding: '14px 18px', 
                      borderRadius: 14, 
                      background: 'rgba(255,255,255,0.04)', 
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <strong style={{ fontSize: '1rem' }}>{c.name}</strong>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{c.price.toLocaleString()}đ</span>
                        <span className={`badge ${c.quantity > 5 ? 'success' : c.quantity > 0 ? 'warning' : 'danger'}`} style={{ fontSize: '0.75rem' }}>
                          Kho: {c.quantity}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="btn btn-primary" 
                      style={{ width: 'auto', padding: '8px 16px', fontSize: '0.9rem' }} 
                      onClick={() => addItemByCostume(c)}
                      disabled={c.quantity <= 0}
                    >
                      Thêm
                    </button>
                  </div>
                ))}
                
                {costumeTotalPages > 1 && (
                  <div className="pagination" style={{ padding: '12px 0', borderTop: '1px solid var(--border-color)', marginTop: 10 }}>
                    <button disabled={costumePage === 1} className="page-btn" onClick={() => setCostumePage(p => p - 1)}>&lsaquo;</button>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{costumePage} / {costumeTotalPages}</span>
                    <button disabled={costumePage === costumeTotalPages} className="page-btn" onClick={() => setCostumePage(p => p + 1)}>&rsaquo;</button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                {loading ? <div className="loading-spinner"></div> : "Không tìm thấy trang phục nào."}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Current Items & Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ 
            flex: 1, 
            background: 'rgba(255,255,255,0.02)', 
            borderRadius: 16, 
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                Danh sách chỉnh sửa
              </h4>
              <span className="badge info">{items.length} món</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Trang phục</th>
                    <th style={{ textAlign: 'center' }}>Số lượng</th>
                    <th style={{ textAlign: 'right' }}>Thành tiền</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <strong>{item.name}</strong>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.price.toLocaleString()}đ</p>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                          <button className="mr-close-btn" style={{ width: 26, height: 26, fontSize: 12 }} onClick={() => updateQty(idx, -1)}>−</button>
                          <span style={{ fontWeight: 600, minWidth: 20 }}>{item.quantity}</span>
                          <button className="mr-close-btn" style={{ width: 26, height: 26, fontSize: 12 }} onClick={() => updateQty(idx, 1)}>+</button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{(item.price * item.quantity).toLocaleString()}đ</td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="mr-close-btn" style={{ width: 32, height: 32 }} onClick={() => removeItem(idx)}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Chưa có trang phục nào trong đơn.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ padding: 24, background: 'rgba(255,255,255,0.03)', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tổng thanh toán:</span>
                  <strong style={{ fontSize: '1.25rem' }}>{totalPreview.toLocaleString()}đ</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tiền đặt cọc (50%):</span>
                  <strong style={{ fontSize: '1.4rem', color: 'var(--primary-color)' }}>{(totalPreview * 0.5).toLocaleString()}đ</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <button className="btn outline" style={{ flex: 1 }} onClick={onCancel}>Hủy bỏ</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSave} disabled={loading || items.length === 0}>
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminRentalDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<RentalOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("edit") === "true") {
      setIsEditing(true);
    }
  }, [location.search]);

  const fetchOrder = useCallback(() => {
    if (!orderId || orderId === "new") return;
    setLoading(true);
    rentalApi
      .getOrderDetails(orderId)
      .then((res) => {
        setOrder(res.data.result);
        setError(null);
      })
      .catch(() => setError("Không tìm thấy đơn hàng."))
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const handleAction = async (action: string) => {
    if (!order) return;
    try {
      setLoading(true);
      switch (action) {
        case "confirm": await rentalApi.confirmOrder(order.id); break;
        case "deposit": await rentalApi.confirmDeposit(order.id); break;
        case "pickup":  await rentalApi.pickupOrder(order.id); break;
        case "cancel": {
          const reason = window.prompt("Nhập lý do hủy:");
          if (reason !== null) await rentalApi.cancelOrder(order.id, reason);
          break;
        }
      }
      fetchOrder();
    } catch (err) {
      alert("Thao tác thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const canEdit = order?.status === "PENDING" || order?.status === "CONFIRMED";

  if (loading && !order) {
    return <div className="admin-main"><div className="loading-spinner" /></div>;
  }

  if (error || !order) {
    return (
      <div className="admin-main">
        <div className="glass-panel admin-card" style={{ textAlign: "center", padding: 60 }}>
          <p style={{ color: "var(--error-color)" }}>{error ?? "Đơn hàng không tồn tại."}</p>
          <button className="btn outline" style={{ marginTop: 16, width: "auto" }} onClick={() => navigate("/admin/rentals")}>Quay lại danh sách</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-main">
      <div className="admin-header" style={{ padding: 0, marginBottom: 24 }}>
        <div>
          <button className="btn outline" style={{ width: "auto", marginBottom: 12, padding: "4px 12px" }} onClick={() => navigate("/admin/rentals")}>Quay lại danh sách</button>
          <h1 style={{ fontSize: "1.8rem" }}>Chi tiết đơn hàng #{order.id.substring(0, 8).toUpperCase()}</h1>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {canEdit && !isEditing && (
            <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => setIsEditing(true)}>Sửa đơn</button>
          )}
          {!["CANCELLED", "COMPLETED"].includes(order.status) && (
            <button className="btn outline" style={{ width: "auto", color: "var(--error-color)" }} onClick={() => handleAction("cancel")}>Hủy đơn</button>
          )}
        </div>
      </div>

      {isEditing ? (
        <AdminEditSection 
          order={order} 
          onSaved={() => { setIsEditing(false); fetchOrder(); }} 
          onCancel={() => setIsEditing(false)} 
        />
      ) : (
        <div className="admin-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          {/* Left Column: Items */}
          <div className="glass-panel admin-card">
            <h3 style={{ marginBottom: 20 }}>Danh sách trang phục</h3>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Trang phục</th>
                    <th style={{ textAlign: "center" }}>Số lượng</th>
                    <th style={{ textAlign: "right" }}>Đơn giá</th>
                    <th style={{ textAlign: "right" }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.rentalDetailResponses.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{item.costumeResponse?.name}</strong>
                      </td>
                      <td style={{ textAlign: "center" }}>{item.quantity}</td>
                      <td style={{ textAlign: "right" }}>{(item.costumeResponse?.price ?? 0).toLocaleString()}đ</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>{(item.amount ?? 0).toLocaleString()}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 24, textAlign: "right", borderTop: "1px solid var(--border-color)", paddingTop: 16 }}>
               <div style={{ marginBottom: 8 }}>
                 <span style={{ color: "var(--text-muted)", marginRight: 16 }}>Tổng tiền đơn hàng:</span>
                 <strong style={{ fontSize: "1.1rem" }}>{(order.totalAmount ?? 0).toLocaleString()}đ</strong>
               </div>
               <div>
                 <span style={{ fontSize: "1.1rem", color: "var(--text-muted)", marginRight: 16 }}>Tiền đặt cọc:</span>
                 <strong style={{ fontSize: "1.5rem", color: "var(--primary-color)" }}>{(order.deposit ?? 0).toLocaleString()}đ</strong>
               </div>
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="glass-panel admin-card">
              <h3 style={{ marginBottom: 16 }}>Thông tin đơn</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <span className="rd-meta-label">Trạng thái:</span>
                  <div style={{ marginTop: 4 }}><StatusBadge status={order.status} /></div>
                </div>
                <div>
                  <span className="rd-meta-label">Loại đơn:</span>
                  <div style={{ fontWeight: 600 }}>{order.type === "ONLINE" ? "🌐 Online" : "🏪 Offline"}</div>
                </div>
                <div>
                  <span className="rd-meta-label">Ngày tạo:</span>
                  <div style={{ fontWeight: 600 }}>{new Date(order.createDate).toLocaleString()}</div>
                </div>
                <div>
                  <span className="rd-meta-label">Hạn trả:</span>
                  <div style={{ 
                    fontWeight: 700, 
                    color: order.dueDate && new Date(order.dueDate) < new Date() && order.status !== 'COMPLETED' ? 'var(--error-color)' : 'var(--primary-color)' 
                  }}>
                    {order.dueDate ? new Date(order.dueDate).toLocaleDateString() : "Chưa có"}
                  </div>
                </div>
                {order.cancelReason && (
                   <div style={{ background: "rgba(239, 68, 68, 0.1)", padding: 12, borderRadius: 8, borderLeft: "4px solid var(--error-color)" }}>
                     <span style={{ fontSize: "0.8rem", color: "var(--error-color)", display: "block" }}>Lý do hủy:</span>
                     <span style={{ fontSize: "0.9rem" }}>{order.cancelReason}</span>
                   </div>
                )}
              </div>
            </div>

            <div className="glass-panel admin-card">
              <h3 style={{ marginBottom: 16 }}>Khách hàng</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                 <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{order.customerResponse?.name}</div>
                 <div style={{ color: "var(--text-muted)" }}>📞 {order.customerResponse?.phone}</div>
                 <div style={{ color: "var(--text-muted)" }}>📧 {order.customerResponse?.email}</div>
              </div>
            </div>

            <div className="glass-panel admin-card">
              <h3 style={{ marginBottom: 16 }}>Xử lý đơn hàng</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {order.status === "PENDING" && (
                  <button className="btn btn-primary" onClick={() => handleAction("confirm")}>Xác nhận đơn</button>
                )}
                {order.status === "CONFIRMED" && (
                  <button className="btn btn-primary" onClick={() => handleAction("deposit")}>Nhận tiền cọc</button>
                )}
                {order.status === "DEPOSIT_PAID" && (
                  <button className="btn btn-primary" onClick={() => handleAction("pickup")}>Giao trang phục</button>
                )}
                {order.status === "RENTING" && (
                  <button className="btn btn-primary" onClick={() => navigate("/admin/rentals")}>Hoàn tất (Xử lý tại kho)</button>
                )}
                {["CANCELLED", "COMPLETED"].includes(order.status) && (
                   <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 12 }}>Đơn hàng đã kết thúc.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
