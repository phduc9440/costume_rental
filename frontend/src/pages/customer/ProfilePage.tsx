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
        <p>Loading profile...</p>
      </div>
    );

  return (
    <div className="profile-page dashboard-container" style={{ padding: 0 }}>
      <div className="dashboard-header">
        <h2>My Profile</h2>
      </div>

      <div className="glass-panel stat-card" style={{ maxWidth: "600px" }}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            className="form-control"
            value={profile?.name || ""}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Username</label>
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
          <label>Phone</label>
          <input
            className="form-control"
            value={profile?.phone || ""}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea
            className="form-control"
            value={profile?.address || ""}
            readOnly
            rows={3}
            style={{ resize: "none" }}
          />
        </div>

        <button className="btn btn-primary" style={{ marginTop: "16px" }}>
          Edit Profile
        </button>
      </div>
    </div>
  );
}
