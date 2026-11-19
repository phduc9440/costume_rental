import { useState, useEffect } from 'react';
import { costumeApi } from '../../api/costumeApi';
import type { Costume } from '../../types/costume';
import './AdminLayout.css';

export default function AdminCostumeList() {
  const [costumes, setCostumes] = useState<Costume[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCostume, setEditingCostume] = useState<Costume | null>(null);
  const [formData, setFormData] = useState<Partial<Costume>>({ name: '', price: 0 });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchCostumes();
  }, [page, searchTerm]);

  const fetchCostumes = async () => {
    try {
      setLoading(true);
      const response = await costumeApi.getAllCostumes(searchTerm, page, 10);
      if (response.data.result) {
        setCostumes(response.data.result.data);
        setTotalPages(response.data.result.totalPages);
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Không thể tải danh sách trang phục', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const openAddModal = () => {
    setEditingCostume(null);
    setFormData({ name: '', price: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (costume: Costume) => {
    setEditingCostume(costume);
    setFormData({ name: costume.name, price: costume.price });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bộ trang phục này?')) return;
    try {
      await costumeApi.deleteCostume(id);
      setMessage({ text: 'Xóa thành công', type: 'success' });
      fetchCostumes();
    } catch (err) {
      console.error('Delete failed', err);
      setMessage({ text: 'Xóa thất bại', type: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCostume) {
        await costumeApi.updateCostume(editingCostume.id!, formData);
        setMessage({ text: 'Cập nhật thành công', type: 'success' });
      } else {
        await costumeApi.createCostume(formData);
        setMessage({ text: 'Thêm mới thành công', type: 'success' });
      }
      setIsModalOpen(false);
      fetchCostumes();
    } catch (err) {
      console.error('Submit failed', err);
      setMessage({ text: 'Lưu thất bại', type: 'error' });
    }
  };

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Quản lý Trang Phục</h1>
          <p style={{ color: 'var(--text-muted)' }}>Cập nhật, chỉnh sửa danh mục trang phục</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} style={{ width: 'auto', padding: '12px 24px' }}>
          + Thêm trang phục
        </button>
      </div>

      {message.text && (
        <div className={`glass-panel ${message.type === 'success' ? 'success' : 'danger'}`} 
             style={{ padding: '12px 16px', marginBottom: '20px', backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.type === 'success' ? '#10b981' : '#ef4444' }}>
          {message.text}
        </div>
      )}

      <div className="glass-panel admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div className="search-bar" style={{ marginBottom: 0, width: '400px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Tìm mã hoặc tên trang phục..." 
              style={{ paddingLeft: 36 }}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading && costumes.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="mr-table">
              <thead>
                <tr>
                  <th>Tên trang phục</th>
                  <th>Đơn giá thuê</th>
                  <th style={{ textAlign: 'center' }}>Trong kho</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {costumes.length > 0 ? costumes.map((costume) => (
                  <tr key={costume.id} className="mr-table-row">
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--surface-2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                          🎭
                        </div>
                        <strong style={{ fontWeight: 500 }}>{costume.name}</strong>
                      </div>
                    </td>
                    <td style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{costume.price.toLocaleString()} đ</td>
                    <td style={{ textAlign: 'center' }}>{costume.quantity}</td>
                    <td>
                      <span className={`badge ${costume.quantity > 5 ? 'success' : costume.quantity > 0 ? 'warning' : 'danger'}`}>
                        {costume.quantity > 5 ? 'Đủ hàng' : costume.quantity > 0 ? 'Sắp hết' : 'Hết hàng'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="mr-action-btn detail" onClick={() => openEditModal(costume)}>Sửa</button>
                        <button className="mr-action-btn detail" 
                                style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)' }}
                                onClick={() => handleDelete(costume.id!)}>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Không tìm thấy trang phục nào.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination" style={{ marginTop: 24, padding: "0 20px 20px" }}>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="page-btn">&lsaquo;</button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i + 1} 
                    className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="page-btn">&rsaquo;</button>
              </div>
            )}
          </div>
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
            <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>{editingCostume ? 'Sửa thông tin' : 'Thêm Trang phục'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên trang phục</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Áo ngũ thân..."
                />
              </div>
              <div className="form-group">
                <label>Giá cho thuê (VNĐ)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required 
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
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
