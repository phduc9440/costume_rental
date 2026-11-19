import { useState, useEffect } from 'react';
import { employeeApi } from '../../api/employeeApi';
import type { Employee, EmployeeCreationRequest } from '../../types/customer';
import './AdminLayout.css';

export default function AdminEmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newEmployee, setNewEmployee] = useState<EmployeeCreationRequest>({
    username: '',
    password: '',
    position: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeApi.getAllEmployees();
      if (response.data.result) {
        setEmployees(response.data.result);
      }
    } catch (err) {
      setError('Không tải được danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeeApi.createEmployee(newEmployee);
      setIsAdding(false);
      setNewEmployee({ username: '', password: '', position: '' });
      fetchEmployees();
    } catch (err) {
      alert('Tạo nhân viên thất bại');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa tài khoản nhân viên này?')) return;
    try {
      await employeeApi.deleteEmployee(id);
      fetchEmployees();
    } catch (err) {
      alert('Xóa nhân viên thất bại');
    }
  };

  return (
    <div className="admin-employee-list">
      <div className="dashboard-header">
        <div>
          <h2>Quản lý nhân viên</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Tạo và quản lý tài khoản nhân viên cửa hàng.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary" style={{ width: 'auto' }}>
          {isAdding ? 'Hủy' : '+ Thêm nhân viên'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isAdding && (
        <div className="glass-panel admin-card" style={{ marginBottom: '30px' }}>
          <h3>Tài khoản nhân viên mới</h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'end', marginTop: '20px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Tên đăng nhập</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={newEmployee.username}
                onChange={e => setNewEmployee({...newEmployee, username: e.target.value})}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Mật khẩu</label>
              <input 
                type="password" 
                className="form-control" 
                required 
                value={newEmployee.password}
                onChange={e => setNewEmployee({...newEmployee, password: e.target.value})}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Chức vụ</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                placeholder="VD: Bán hàng, Quản lý kho"
                value={newEmployee.position}
                onChange={e => setNewEmployee({...newEmployee, position: e.target.value})}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '45px' }}>Tạo tài khoản</button>
          </form>
        </div>
      )}

      <div className="glass-panel admin-card">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên đăng nhập</th>
                <th>Vai trò</th>
                <th>Chức vụ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.username}</td>
                  <td><span className="badge">{emp.role}</span></td>
                  <td>{emp.position}</td>
                  <td>
                    <button 
                      className="btn outline" 
                      style={{ color: 'var(--error-color)', width: 'auto', padding: '6px 15px' }}
                      onClick={() => handleDelete(emp.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
