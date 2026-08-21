import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import type { RegisterRequest } from '../../types/auth';

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
        setError(err.message || 'Registration failed. Please check your data.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel" style={{ maxWidth: '600px' }}>
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="dashboard-grid" style={{ gap: '15px', marginBottom: '20px' }}>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label htmlFor="username">Username (min 3 chars)</label>
              <input type="text" id="username" className="form-control" value={formData.username} onChange={handleChange} required />
            </div>
            
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label htmlFor="password">Password (min 6 chars)</label>
              <input type="password" id="password" className="form-control" value={formData.password} onChange={handleChange} required />
            </div>
            
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" className="form-control" value={formData.name} onChange={handleChange} />
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" className="form-control" value={formData.email} onChange={handleChange} />
            </div>
            
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label htmlFor="phone">Phone Number</label>
              <input type="text" id="phone" className="form-control" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label htmlFor="address">Address</label>
              <input type="text" id="address" className="form-control" value={formData.address} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <div className="auth-links">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
