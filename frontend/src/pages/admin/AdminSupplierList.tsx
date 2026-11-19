import { useState, useEffect } from 'react';
import { supplierApi } from '../../api/supplierApi';
import type { Supplier, SupplierCreationRequest } from '../../types/supplier';
import './AdminLayout.css';

export default function AdminSupplierList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<SupplierCreationRequest>({ name: '', address: '', phone: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await supplierApi.getAllSuppliers(page, 10);
      if (response.data.result) {
        let fetchedData = response.data.result.data;
        // Simple client-side search logic if API doesn't support searching by keyword
        if (searchTerm) {
          fetchedData = fetchedData.filter(s => 
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.phone.includes(searchTerm)
          );
        }
        setSuppliers(fetchedData);
        setTotalPages(response.data.result.totalPages);
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Không thể tải danh sách nhà cung cấp', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [page, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const openAddModal = () => {
    setEditingSupplier(null);
    setFormData({ name: '', address: '', phone: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({ name: supplier.name, address: supplier.address, phone: supplier.phone });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) return;
    try {
      await supplierApi.deleteSupplier(id);
      setMessage({ text: 'Xóa thành công', type: 'success' });
      fetchSuppliers();
    } catch (err) {
      console.error('Delete failed', err);
      setMessage({ text: 'Xóa thất bại', type: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await supplierApi.updateSupplier(editingSupplier.id, formData);
        setMessage({ text: 'Cập nhật thành công', type: 'success' });
      } else {
        await supplierApi.createSupplier(formData);
        setMessage({ text: 'Thêm mới thành công', type: 'success' });
      }
      setIsModalOpen(false);
      fetchSuppliers();
    } catch (err) {
      console.error('Submit failed', err);
      setMessage({ text: 'Lưu thất bại', type: 'error' });
    }
  };

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Nhà cung cấp</h1>
          <p style={{ color: 'var(--text-muted)' }}>Quản lý danh sách các nhà cung cấp trang phục</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} style={{ width: 'auto', padding: '12px 24px' }}>
          + Thêm nhà cung cấp
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
              placeholder="Tìm kiếm theo tên hoặc SĐT..." 
              style={{ paddingLeft: 36 }}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading && suppliers.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="mr-table">
              <thead>
                <tr>
                  <th>Tên NCC</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.length > 0 ? suppliers.map((supplier) => (
                  <tr key={supplier.id} className="mr-table-row">
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--surface-2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                          🏭
                        </div>
                        <strong style={{ fontWeight: 500 }}>{supplier.name}</strong>
                      </div>
                    </td>
                    <td style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{supplier.phone}</td>
                    <td>{supplier.address}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="mr-action-btn detail" onClick={() => openEditModal(supplier)}>Sửa</button>
                        <button className="mr-action-btn detail" 
                                style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)' }}
                                onClick={() => handleDelete(supplier.id)}>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Không tìm thấy nhà cung cấp nào.</td>
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
            <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>{editingSupplier ? 'Sửa thông tin' : 'Thêm Nhà cung cấp'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên nhà cung cấp</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên..."
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="09..."
                />
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Địa chỉ..."
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
