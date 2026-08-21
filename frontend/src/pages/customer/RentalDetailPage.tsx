import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { rentalApi } from "../../api/rentalApi";
import { costumeApi } from "../../api/costumeApi";
import type { RentalOrder, RentalStatus, RentalItem } from "../../types/rental";
import type { Costume } from "../../types/costume";
import { getUserIdFromToken } from "../../utils/auth";

// ─── Constants ─────────────────────────────────────────────────────────────────

const CANCEL_REASONS = [
  "Tôi đã đổi ý, không muốn thuê nữa",
  "Tôi tìm được trang phục phù hợp hơn",
  "Ngày thuê bị thay đổi",
  "Đặt nhầm trang phục",
  "Vấn đề tài chính cá nhân",
  "Lý do khác",
];

const STATUS_CONFIG: Record<RentalStatus, { label: string; cls: string; icon: string }> = {
  PENDING:      { label: "Chờ xác nhận", cls: "warning", icon: "⏳" },
  CONFIRMED:    { label: "Đã xác nhận",  cls: "info",    icon: "✅" },
  DEPOSIT_PAID: { label: "Đã đặt cọc",   cls: "info",    icon: "💰" },
  RENTING:      { label: "Đang thuê",    cls: "success", icon: "👗" },
  CANCELLED:    { label: "Đã hủy",       cls: "danger",  icon: "❌" },
  COMPLETED:    { label: "Hoàn thành",   cls: "success", icon: "🎉" },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: RentalStatus }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, cls: "", icon: "●" };
  return (
    <span className={`badge ${cfg.cls}`} style={{ fontSize: "0.9rem", padding: "6px 14px" }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ─── Cancel Section ────────────────────────────────────────────────────────────

function CancelSection({
  order,
  onCancelled,
}: {
  order: RentalOrder;
  onCancelled: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);

  const finalReason = selectedReason === "Lý do khác" ? customReason.trim() : selectedReason;
  const canSubmit = finalReason.length > 0 && !loading;

  const handleCancel = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await rentalApi.cancelOrder(order.id, finalReason);
      onCancelled();
    } catch {
      alert("Hủy đơn thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        className="btn"
        style={{ width: "auto", background: "var(--error-color)", color: "white" }}
        onClick={() => setOpen(true)}
      >
        🚫 Hủy đơn hàng
      </button>
    );
  }

  return (
    <div className="rd-cancel-section">
      <div className="rd-cancel-header">
        <h4 style={{ color: "var(--error-color)" }}>🚫 Xác nhận hủy đơn hàng</h4>
        <button
          className="mr-close-btn"
          onClick={() => { setOpen(false); setSelectedReason(""); setCustomReason(""); }}
        >✕</button>
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 16 }}>
        Vui lòng chọn lý do hủy. Hành động này <strong>không thể hoàn tác</strong>.
      </p>

      <div className="mr-reason-list">
        {CANCEL_REASONS.map((reason) => (
          <label key={reason} className="mr-reason-item">
            <input
              type="radio"
              name={`cancel_${order.id}`}
              value={reason}
              checked={selectedReason === reason}
              onChange={() => setSelectedReason(reason)}
            />
            <span>{reason}</span>
          </label>
        ))}
      </div>

      {selectedReason === "Lý do khác" && (
        <textarea
          className="form-control"
          placeholder="Mô tả lý do của bạn..."
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
          rows={3}
          style={{ marginTop: 12, resize: "vertical" }}
        />
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "flex-end" }}>
        <button
          className="btn outline"
          style={{ width: "auto" }}
          onClick={() => { setOpen(false); setSelectedReason(""); setCustomReason(""); }}
          disabled={loading}
        >
          Quay lại
        </button>
        <button
          className="btn"
          style={{
            width: "auto",
            background: canSubmit ? "var(--error-color)" : "#94a3b8",
            color: "white",
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
          disabled={!canSubmit}
          onClick={handleCancel}
        >
          {loading ? "Đang xử lý..." : "✓ Xác nhận hủy"}
        </button>
      </div>
    </div>
  );
}

// ─── Edit Section ──────────────────────────────────────────────────────────────

function EditSection({
  order,
  onSaved,
}: {
  order: RentalOrder;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<{ costumeId: string; name: string; quantity: number; price: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [costumes, setCostumes] = useState<Costume[]>([]);
  const [costumeSearchTerm, setCostumeSearchTerm] = useState("");
  const [costumePage, setCostumePage] = useState(1);
  const [costumeTotalPages, setCostumeTotalPages] = useState(1);

  useEffect(() => {
    if (open) {
      setItems(
        order.rentalDetailResponses.map((d) => ({
          costumeId: d.costumeResponse?.id ?? "",
          name: d.costumeResponse?.name ?? "Trang phục",
          quantity: d.quantity,
          price: d.costumeResponse?.price ?? 0,
        }))
      );
    }
  }, [open, order]);

  useEffect(() => {
    if (open) {
      loadCostumes();
    }
  }, [open, costumeSearchTerm, costumePage]);

  const loadCostumes = async () => {
    try {
      setLoading(true);
      const res = await costumeApi.getAllCostumes(costumeSearchTerm, costumePage, 8);
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
    const customerId = getUserIdFromToken();
    if (!customerId) return;

    setLoading(true);
    try {
      await rentalApi.updateOrder(order.id, {
        customerId,
        items: items.map((it) => ({ costumeId: it.costumeId, quantity: it.quantity })),
      });
      onSaved();
    } catch {
      alert("Cập nhật đơn hàng thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        className="btn btn-primary"
        style={{ width: "auto" }}
        onClick={() => setOpen(true)}
      >
        ✏️ Sửa đơn hàng
      </button>
    );
  }

  return (
    <div className="rd-edit-section" style={{ maxWidth: '1000px', width: '90vw' }}>
      <div className="rd-cancel-header" style={{ marginBottom: 24 }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>✏️</span> Sửa đơn hàng
        </h3>
        <button className="mr-close-btn" style={{ fontSize: '1.2rem' }} onClick={() => setOpen(false)}>✕</button>
      </div>

      <div className="rd-edit-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: 24 
      }}>
        {/* Left: Costume Discovery */}
        <div className="rd-discovery-card" style={{ 
          background: 'rgba(255,255,255,0.03)', 
          borderRadius: 20, 
          padding: 20, 
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          <div style={{ position: 'relative' }}>
             <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}>🔍</span>
             <input 
               className="form-control" 
               placeholder="Tìm thêm trang phục..." 
               style={{ paddingLeft: 40, background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}
               value={costumeSearchTerm}
               onChange={(e) => { setCostumeSearchTerm(e.target.value); setCostumePage(1); }}
             />
          </div>

          <div style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: 4 }}>
            {costumes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {costumes.map(c => (
                  <div key={c.id} style={{ 
                    padding: 14, 
                    borderRadius: 16, 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>{c.name}</div>
                      <div style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 600 }}>{c.price.toLocaleString()}đ</div>
                    </div>
                    <button 
                      className="btn btn-primary" 
                      style={{ width: 'auto', borderRadius: 10, padding: '6px 14px', fontSize: '0.8rem' }}
                      onClick={() => addItemByCostume(c)}
                      disabled={c.quantity <= 0}
                    >
                      + Thêm
                    </button>
                  </div>
                ))}
                
                {costumeTotalPages > 1 && (
                  <div className="pagination" style={{ marginTop: 10, justifyContent: 'center' }}>
                    <button disabled={costumePage === 1} className="page-btn" onClick={() => setCostumePage(p => p - 1)}>&lsaquo;</button>
                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{costumePage} / {costumeTotalPages}</span>
                    <button disabled={costumePage === costumeTotalPages} className="page-btn" onClick={() => setCostumePage(p => p + 1)}>&rsaquo;</button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>
                {loading ? <div className="loading-spinner" style={{ width: 24, height: 24 }}></div> : "Không tìm thấy trang phục."}
              </div>
            )}
          </div>
        </div>

        {/* Right: Selection & Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ 
            flex: 1,
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: 20, 
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>🛒 Đang chọn</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{items.length} món</span>
            </div>

            <div style={{ flex: 1, maxHeight: '350px', overflowY: 'auto', padding: '10px 0' }}>
              {items.map((item, idx) => (
                <div key={idx} style={{ 
                  padding: '12px 20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.03)'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{item.price.toLocaleString()}đ</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="rd-qty-control" style={{ scale: '0.85' }}>
                      <button className="rd-qty-btn" style={{ width: 24, height: 24 }} onClick={() => updateQty(idx, -1)}>−</button>
                      <span className="rd-qty-value">{item.quantity}</span>
                      <button className="rd-qty-btn" style={{ width: 24, height: 24 }} onClick={() => updateQty(idx, 1)}>+</button>
                    </div>
                    <button className="mr-close-btn" onClick={() => removeItem(idx)}>🗑</button>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>Chưa có trang phục nào.</div>
              )}
            </div>

            <div style={{ padding: 20, background: 'rgba(255,255,255,0.03)', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ opacity: 0.7 }}>Tổng mới (tạm tính):</span>
                <strong style={{ fontSize: '1.1rem' }}>{totalPreview.toLocaleString()}đ</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ opacity: 0.7 }}>Cọc mới (50%):</span>
                <strong style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}>{(totalPreview * 0.5).toLocaleString()}đ</strong>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn outline" style={{ flex: 1 }} onClick={() => setOpen(false)}>Hủy</button>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 2 }} 
                  onClick={handleSave} 
                  disabled={loading || items.length === 0}
                >
                  {loading ? "Đang lưu..." : "💾 Lưu thay đổi"}
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

export default function RentalDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<RentalOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const canEdit   = order?.status === "PENDING" && order?.type === "ONLINE";
  const canCancel = order?.status === "PENDING" || order?.status === "CONFIRMED";

  /* ── After cancel/save: go back to list ── */
  const handleActionDone = () => navigate("/customer/rentals");

  return (
    <div className="rd-page">
      {/* Back button */}
      <button
        className="rd-back-btn"
        onClick={() => navigate("/customer/rentals")}
      >
        ← Quay lại danh sách
      </button>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px" }}>
          <div className="loading-spinner" />
        </div>
      ) : error || !order ? (
        <div className="glass-panel stat-card" style={{ textAlign: "center", padding: "60px" }}>
          <p style={{ color: "var(--error-color)" }}>{error ?? "Đơn hàng không tồn tại."}</p>
        </div>
      ) : (
        <>
          {/* ── Order Header Card ── */}
          <div className="glass-panel rd-header-card">
            <div className="rd-header-top">
              <div>
                <h2 className="rd-order-title">
                  Đơn #{order.id.substring(0, 8).toUpperCase()}
                </h2>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                  {order.id}
                </span>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="rd-meta-grid">
              <div className="rd-meta-cell">
                <span className="rd-meta-label">Loại đơn hàng</span>
                <span className="rd-meta-value">
                  {order.type === "ONLINE" ? "🌐 Đặt Online" : "🏪 Đặt tại cửa hàng"}
                </span>
              </div>
              <div className="rd-meta-cell">
                <span className="rd-meta-label">Ngày đặt</span>
                <span className="rd-meta-value">
                  {new Date(order.createDate).toLocaleDateString("vi-VN", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="rd-meta-cell">
                <span className="rd-meta-label">Số trang phục</span>
                <span className="rd-meta-value">
                  {order.rentalDetailResponses.length} món
                </span>
              </div>
              <div className="rd-meta-cell">
                <span className="rd-meta-label">Tiền đặt cọc</span>
                <span className="rd-meta-value" style={{ color: 'var(--primary-color)', fontWeight: 700 }}>
                  {(order.deposit ?? 0).toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="rd-meta-cell">
                <span className="rd-meta-label">Tổng tiền</span>
                <span className="rd-meta-value rd-total-big">
                  {(order.totalAmount ?? 0).toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            {/* Cancel reason */}
            {order.status === "CANCELLED" && order.cancelReason && (
              <div className="mr-cancel-reason-box" style={{ marginTop: 16 }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Lý do hủy:</span>
                <p style={{ marginTop: 4, fontStyle: "italic" }}>"{order.cancelReason}"</p>
              </div>
            )}
          </div>

          {/* ── Items Table Card ── */}
          <div className="glass-panel rd-items-card">
            <h3 className="rd-section-heading">🎭 Trang phục đã thuê</h3>
            <table className="mr-items-table">
              <thead>
                <tr>
                  <th>Trang phục</th>
                  <th style={{ textAlign: "center" }}>Số lượng</th>
                  <th style={{ textAlign: "right" }}>Đơn giá</th>
                  <th style={{ textAlign: "right" }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.rentalDetailResponses.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                      Không có trang phục nào
                    </td>
                  </tr>
                ) : (
                  order.rentalDetailResponses.map((item: RentalItem, idx: number) => (
                    <tr key={item.id ?? idx}>
                      <td>
                        <strong>{item.costumeResponse?.name ?? `Trang phục #${idx + 1}`}</strong>
                      </td>
                      <td style={{ textAlign: "center" }}>{item.quantity}</td>
                      <td style={{ textAlign: "right" }}>
                        {(item.costumeResponse?.price ?? 0).toLocaleString("vi-VN")}đ
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "var(--primary-color)" }}>
                        {(item.amount ?? 0).toLocaleString("vi-VN")}đ
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Total row */}
            <div className="mr-total-row" style={{ marginTop: 24, paddingBottom: 8, borderBottom: '1px solid var(--border-color)' }}>
              <span>Tổng tiền đơn hàng</span>
              <span>
                {(order.totalAmount ?? 0).toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div className="mr-total-row" style={{ paddingTop: 12 }}>
              <span style={{ fontWeight: 700 }}>Tiền đặt cọc (Đã bao gồm)</span>
              <span className="mr-total-amount">
                {(order.deposit ?? 0).toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          {/* ── Actions Card (only if order is editable / cancellable) ── */}
          {(canEdit || canCancel) && (
            <div className="glass-panel rd-actions-card">
              <h3 className="rd-section-heading">⚙️ Thao tác</h3>

              {/* Edit section (PENDING + ONLINE only) */}
              {canEdit && (
                <div style={{ marginBottom: canCancel ? 24 : 0 }}>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: 12 }}>
                    ✏️ Đơn hàng đang chờ xác nhận — bạn có thể điều chỉnh số lượng trang phục.
                  </p>
                  <EditSection order={order} onSaved={handleActionDone} />
                </div>
              )}

              {/* Divider */}
              {canEdit && canCancel && (
                <hr style={{ border: "none", borderTop: "1px solid var(--border-color)", margin: "20px 0" }} />
              )}

              {/* Cancel section */}
              {canCancel && (
                <div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: 12 }}>
                    🚫 Nếu muốn hủy đơn, hãy chọn lý do bên dưới.
                  </p>
                  <CancelSection order={order} onCancelled={handleActionDone} />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
