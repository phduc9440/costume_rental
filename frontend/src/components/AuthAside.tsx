export default function AuthAside() {
  return (
    <aside className="auth-aside">
      <div className="brand">
        <span className="auth-logo">🎭</span> Costume Rental
      </div>
      <div>
        <h1>
          Mỗi vai diễn
          <br />
          đều xứng đáng một bộ trang phục.
        </h1>
        <p>Duyệt bộ sưu tập, thuê chỉ trong vài cú nhấp và theo dõi mọi đơn hàng — tất cả ở một nơi.</p>
        <ul className="auth-features">
          <li>✨ Hàng trăm mẫu trang phục cho mọi dịp</li>
          <li>📦 Đặt online, nhận tại cửa hàng</li>
          <li>📋 Theo dõi trạng thái đơn theo thời gian thực</li>
        </ul>
      </div>
      <p style={{ fontSize: '0.85rem' }}>© {new Date().getFullYear()} Costume Rental</p>
    </aside>
  );
}
