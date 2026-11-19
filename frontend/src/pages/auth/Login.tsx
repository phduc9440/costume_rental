import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setToken, getRoleFromToken } from '../../utils/auth';
import { authApi } from '../../api/authApi';
import AuthAside from '../../components/AuthAside';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await authApi.login(username, password);

      if (data.result && data.result.token) {
        setToken(data.result.token);
        const role = getRoleFromToken();
        
        if (role === 'ROLE_CUSTOMER') {
          navigate('/customer/home');
        } else if (role === 'ROLE_ADMIN' || role === 'ROLE_EMPLOYEE') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        throw new Error('Đăng nhập thất bại: không nhận được token.');
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <AuthAside />
      <div className="auth-main">
      <div className="auth-card">
        <h2>Chào mừng trở lại</h2>
        <p className="auth-sub">Đăng nhập để tiếp tục vào tài khoản của bạn.</p>
        <form onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div className="auth-links">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </div>
      </div>
    </div>
  );
}
