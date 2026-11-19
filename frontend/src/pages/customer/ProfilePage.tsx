import { useState, useEffect } from "react";
import { customerApi } from "../../api/customerApi";
import type { Customer } from "../../types/customer";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerApi
      .getMyProfile()
      .then((res) => setProfile(res.data.result))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="dashboard-container">
        <p>Đang tải hồ sơ...</p>
      </div>
    );

  return (
    <div className="profile-page dashboard-container" style={{ padding: 0 }}>
      <div className="dashboard-header">
        <div>
          <h2 className="page-title">Hồ sơ của tôi</h2>
          <p className="page-sub">Thông tin liên hệ dùng cho các đơn thuê.</p>
        </div>
      </div>

      <div className="glass-panel stat-card" style={{ maxWidth: "600px" }}>
        <div className="form-group">
          <label>Họ và tên</label>
          <input
            className="form-control"
            value={profile?.name || ""}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Tên đăng nhập</label>
          <input
            className="form-control"
            value={profile?.username || ""}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            className="form-control"
            value={profile?.email || ""}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            className="form-control"
            value={profile?.phone || ""}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Địa chỉ</label>
          <textarea
            className="form-control"
            value={profile?.address || ""}
            readOnly
            rows={3}
            style={{ resize: "none" }}
          />
        </div>

        <button className="btn btn-primary" style={{ marginTop: "16px" }}>
          Chỉnh sửa hồ sơ
        </button>
      </div>
    </div>
  );
}
