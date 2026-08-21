import { useState, useEffect } from 'react';
import { errorApi } from '../../api/errorApi';
import type { ErrorPenalty, LoiRequest } from '../../types/error';
import './AdminLayout.css';

export default function AdminErrorManagement() {
  const [errors, setErrors] = useState<ErrorPenalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingError, setEditingError] = useState<ErrorPenalty | null>(null);
  const [formData, setFormData] = useState<LoiRequest>({ tenLoi: '', mucPhat: 0 });
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchErrors = async (keyword = '') => {
    try {
      setLoading(true);
      const response = await errorApi.getAllErrors(keyword);
      setErrors(response.data.result.data);
    } catch (err) {
      console.error('Failed to fetch errors', err);
      setMessage({ text: 'Không thể tải danh sách lỗi hỏng phạt', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrors();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchErrors(searchTerm);
  };

  const openAddModal = () => {
    setEditingError(null);
    setFormData({ tenLoi: '', mucPhat: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (error: ErrorPenalty) => {
    setEditingError(error);
    setFormData({ tenLoi: error.tenLoi, mucPhat: error.mucPhat });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lỗi hỏng phạt này?')) return;
    try {
      await errorApi.deleteError(id);
      setMessage({ text: 'Xóa thành công', type: 'success' });
      fetchErrors(searchTerm);
    } catch (err) {
      console.error('Delete failed', err);
      setMessage({ text: 'Xóa thất bại', type: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingError) {
        await errorApi.updateError(editingError.id, formData);
        setMessage({ text: 'Cập nhật thành công', type: 'success' });
      } else {
        await errorApi.createError(formData);
        setMessage({ text: 'Thêm mới thành công', type: 'success' });
      }
      setIsModalOpen(false);
      fetchErrors(searchTerm);
    } catch (err) {
      console.error('Submit failed', err);
      setMessage({ text: 'Lưu thất bại', type: 'error' });
    }
  };

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Quản lý lỗi hỏng phạt</h1>
          <p style={{ color: 'var(--text-muted)' }}>Quản lý các loại lỗi hỏng và mức phạt tương ứng</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} style={{ width: 'auto', padding: '12px 24px' }}>
          + Thêm lỗi mới
        </button>
      </div>

      {message.text && (
        <div className={`glass-panel ${message.type === 'success' ? 'success' : 'danger'}`} 
             style={{ padding: '12px 16px', marginBottom: '20px', backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.type === 'success' ? '#10b981' : '#ef4444' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSearch} className="glass-panel" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Tìm kiếm lỗi hỏng..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>Tìm kiếm</button>
      </form>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <table className="mr-table">
            <thead>
              <tr>
                <th>Tên lỗi</th>
                <th>Mức phạt (VNĐ)</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {errors.length > 0 ? (
                errors.map((error) => (
                  <tr key={error.id} className="mr-table-row">
                    <td style={{ fontWeight: 500 }}>{error.tenLoi}</td>
                    <td style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                      {error.mucPhat.toLocaleString()} đ
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="mr-action-btn detail" onClick={() => openEditModal(error)}>
                          Sửa
                        </button>
                        <button className="mr-action-btn detail" 
                                style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)' }}
                                onClick={() => handleDelete(error.id)}>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Không có dữ liệu lỗi hỏng phạt
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '32px', position: 'relative' }}>
            <button className="mr-close-btn" onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px' }}>×</button>
            <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>{editingError ? 'Sửa lỗi hỏng phạt' : 'Thêm lỗi hỏng phạt mới'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên lỗi hỏng</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={formData.tenLoi}
                  onChange={(e) => setFormData({ ...formData, tenLoi: e.target.value })}
                  placeholder="Ví dụ: Rách vải, Mất phụ kiện..."
                />
              </div>
              <div className="form-group">
                <label>Mức phạt (VNĐ)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required 
                  min="0"
                  value={formData.mucPhat}
                  onChange={(e) => setFormData({ ...formData, mucPhat: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button type="button" className="btn outline" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
