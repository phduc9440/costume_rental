import { useEffect, useMemo, useState } from "react";
import { costumeApi } from "../../api/costumeApi";
import type { Costume } from "../../types/costume";
import { useCart } from "../../context/CartContext";
import { formatVND } from "../../utils/format";

// Costumes have no images yet, so each card gets a stable decorative tint + emoji derived from its id.
const tints = [
  "linear-gradient(135deg, #efe9ff, #fbe7f3)",
  "linear-gradient(135deg, #e6f4ff, #efe9ff)",
  "linear-gradient(135deg, #fff1e0, #fde7ef)",
  "linear-gradient(135deg, #e5f8ef, #e6f4ff)",
];
const icons = ["🎭", "👘", "🥻", "👗", "🤵", "🧥", "👑", "🎩"];
const pick = <T,>(arr: T[], key: string) =>
  arr[[...key].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % arr.length];

export default function CostumeList() {
  const [costumes, setCostumes] = useState<Costume[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    costumeApi
      .getAllCostumes()
      .then((res) => {
        if (res.data.result.data) {
          setCostumes(res.data.result.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? costumes.filter((c) => c.name.toLowerCase().includes(q)) : costumes;
  }, [costumes, search]);

  const handleAddToCart = (costume: Costume) => {
    addToCart(costume);
    setAddedId(costume.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="costume-list">
      <div className="dashboard-header">
        <div>
          <h2 className="page-title">Bộ sưu tập trang phục</h2>
          <p className="page-sub">Chọn trang phục yêu thích và thêm vào giỏ để thuê.</p>
        </div>
      </div>

      <div className="costume-toolbar">
        <input
          className="form-control"
          placeholder="🔍  Tìm theo tên trang phục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="loading-spinner"></div>
          <p style={{ marginTop: 20 }}>Đang tải bộ sưu tập...</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="glass-panel empty-state">
          <div className="empty-icon">🔎</div>
          <p>Không tìm thấy trang phục phù hợp.</p>
        </div>
      ) : (
        <div className="costume-grid">
          {visible.map((costume, i) => {
            const outOfStock = costume.quantity <= 0;
            const added = addedId === costume.id;
            return (
              <div
                key={costume.id}
                className="glass-panel costume-card"
                style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
              >
                <div className="costume-thumb" style={{ background: pick(tints, costume.id) }}>
                  {pick(icons, costume.id)}
                  <span className={`badge ${outOfStock ? "danger" : "success"}`}>
                    {outOfStock ? "Hết hàng" : "Còn hàng"}
                  </span>
                </div>
                <div className="costume-body">
                  <h3 className="costume-name">{costume.name}</h3>
                  <p className="costume-price">
                    {formatVND(costume.price)} <small>/ ngày</small>
                  </p>
                  <p className="costume-stock">Còn lại: {costume.quantity}</p>
                  <button
                    className={`btn ${added ? "btn-success" : "btn-primary"}`}
                    onClick={() => handleAddToCart(costume)}
                    disabled={outOfStock}
                  >
                    {added ? "✓ Đã thêm" : outOfStock ? "Tạm hết" : "Thêm vào giỏ"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
