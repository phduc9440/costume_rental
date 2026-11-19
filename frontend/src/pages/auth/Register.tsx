import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import type { RegisterRequest } from '../../types/auth';
import AuthAside from '../../components/AuthAside';

export default function Register() {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authApi.register(formData);
      navigate('/login');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <AuthAside />
      <div className="auth-main">
      <div className="auth-card" style={{ maxWidth: '560px' }}>
        <h2>Tạo tài khoản</h2>
        <p className="auth-sub">Chỉ mất một phút để bắt đầu.</p>
        <form onSubmit={handleRegister}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="dashboard-grid" style={{ gap: '15px', marginBottom: '20px' }}>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label htmlFor="username">Tên đăng nhập (tối thiểu 3 ký tự)</label>
              <input type="text" id="username" className="form-control" value={formData.username} onChange={handleChange} required />
            </div>
            
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label htmlFor="password">Mật khẩu (tối thiểu 6 ký tự)</label>
              <input type="password" id="password" className="form-control" value={formData.password} onChange={handleChange} required />
            </div>
            
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label htmlFor="name">Họ và tên</label>
              <input type="text" id="name" className="form-control" value={formData.name} onChange={handleChange} />
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" className="form-control" value={formData.email} onChange={handleChange} />
            </div>
            
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label htmlFor="phone">Số điện thoại</label>
              <input type="text" id="phone" className="form-control" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label htmlFor="address">Địa chỉ</label>
              <input type="text" id="address" className="form-control" value={formData.address} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </button>
        </form>
        <div className="auth-links">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
      </div>
    </div>
  );
}
