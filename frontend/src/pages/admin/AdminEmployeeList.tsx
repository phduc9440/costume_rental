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
      setError('Failed to fetch employees');
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
      alert('Failed to create employee');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this employee account?')) return;
    try {
      await employeeApi.deleteEmployee(id);
      fetchEmployees();
    } catch (err) {
      alert('Failed to delete employee');
    }
  };

  return (
    <div className="admin-employee-list">
      <div className="dashboard-header" style={{ border: 'none', padding: 0 }}>
        <h2>Manage Staff</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary" style={{ width: 'auto' }}>
          {isAdding ? 'Cancel' : 'Add New Employee'}
        </button>
      </div>

      {isAdding && (
        <div className="glass-panel admin-card" style={{ marginBottom: '30px' }}>
          <h3>New Employee Account</h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'end', marginTop: '20px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Username</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={newEmployee.username}
                onChange={e => setNewEmployee({...newEmployee, username: e.target.value})}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Password</label>
              <input 
                type="password" 
                className="form-control" 
                required 
                value={newEmployee.password}
                onChange={e => setNewEmployee({...newEmployee, password: e.target.value})}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Position</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                placeholder="e.g. Sales, Stock Manager"
                value={newEmployee.position}
                onChange={e => setNewEmployee({...newEmployee, position: e.target.value})}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '45px' }}>Create Account</button>
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
                <th>Username</th>
                <th>Role</th>
                <th>Position</th>
                <th>Actions</th>
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
                      Remove
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
