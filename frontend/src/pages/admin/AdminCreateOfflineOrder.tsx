import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { customerApi } from "../../api/customerApi";
import { costumeApi } from "../../api/costumeApi";
import { rentalApi } from "../../api/rentalApi";
import type { Customer } from "../../types/customer";
import type { Costume } from "../../types/costume";
import "./AdminLayout.css";

export default function AdminCreateOfflineOrder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Customer State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchPhone, setSearchPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerPage, setCustomerPage] = useState(1);
  const [customerTotalPages, setCustomerTotalPages] = useState(1);

  // Step 2: Costume State
  const [costumes, setCostumes] = useState<Costume[]>([]);
  const [costumeSearchTerm, setCostumeSearchTerm] = useState("");
  const [costumePage, setCostumePage] = useState(1);
  const [costumeTotalPages, setCostumeTotalPages] = useState(1);
  const [items, setItems] = useState<{ costumeId: string; name: string; quantity: number; price: number }[]>([]);

  // Step 3: Confirmation State
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  // Step 1: Customer Effects
  useEffect(() => {
    if (step === 1) loadCustomers();
  }, [step, customerPage]);

  // Step 2: Costume Effects
  useEffect(() => {
    if (step === 2) loadCostumes();
  }, [step, costumePage, costumeSearchTerm]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await (searchPhone 
        ? customerApi.getCustomerByPhone(searchPhone, customerPage) 
        : customerApi.getAllCustomers(customerPage));
      
      if (res.data.result) {
        setCustomers(res.data.result.data);
        setCustomerTotalPages(res.data.result.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCostumes = async () => {
    try {
      setLoading(true);
      // We use 10 as default page size
      const res = await costumeApi.getAllCostumes(costumeSearchTerm, costumePage, 10);
      if (res.data.result) {
        setCostumes(res.data.result.data);
        setCostumeTotalPages(res.data.result.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = (idx: number, delta: number) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it));
  };

  const addItemByCostume = (costume: Costume) => {
    const existingIdx = items.findIndex(it => it.costumeId === costume.id);
    if (existingIdx >= 0) {
      setItems(prev => prev.map((it, i) => i === existingIdx ? { ...it, quantity: it.quantity + 1 } : it));
    } else {
      setItems(prev => [...prev, {
        costumeId: costume.id,
        name: costume.name,
        quantity: 1,
        price: costume.price
      }]);
    }
  };

  const removeItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const finishOrder = async () => {
    if (!selectedCustomer) return;
    try {
      setLoading(true);
      const res = await rentalApi.createOfflineOrder({
        customerId: selectedCustomer.id,
        items: items.map(it => ({ costumeId: it.costumeId, quantity: it.quantity })),
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined
      });
      if (res.data.result) {
        navigate(`/admin/rentals/${res.data.result.id}`);
      }
    } catch (err) {
      alert("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <div className="admin-page">
      <div className="admin-header" style={{ padding: 0, marginBottom: 30 }}>
        <h1 style={{ fontSize: "2rem" }}>Đặt hàng tại cửa hàng (Offline)</h1>
        <div className="step-indicator" style={{ display: 'flex', gap: 20 }}>
          <span style={{ fontWeight: step === 1 ? 700 : 400, color: step === 1 ? 'var(--primary-color)' : 'var(--text-muted)' }}>1. Chọn khách hàng</span>
          <span>→</span>
          <span style={{ fontWeight: step === 2 ? 700 : 400, color: step === 2 ? 'var(--primary-color)' : 'var(--text-muted)' }}>2. Chọn trang phục</span>
          <span>→</span>
          <span style={{ fontWeight: step === 3 ? 700 : 400, color: step === 3 ? 'var(--primary-color)' : 'var(--text-muted)' }}>3. Xác nhận</span>
        </div>
      </div>

      <div className="glass-panel admin-card">
        {/* STEP 1: CUSTOMER SELECTION */}
        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: 20 }}>Bước 1: Chọn khách hàng</h3>
            <div className="search-bar">
              <input 
                className="form-control" 
                placeholder="Tìm theo số điện thoại..." 
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && loadCustomers()}
              />
              <button className="btn btn-primary" style={{ width: 'auto' }} onClick={loadCustomers}>Tìm kiếm</button>
            </div>

            <div className="admin-table-container" style={{ marginTop: 24 }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Số điện thoại</th>
                    <th>Email</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.phone}</td>
                      <td>{c.email}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => { setSelectedCustomer(c); setStep(2); }}>Chọn khách hàng</button>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Không tìm thấy khách hàng nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {customerTotalPages > 1 && (
                <div className="pagination" style={{ marginTop: 20 }}>
                  <button disabled={customerPage === 1} className="page-btn" onClick={() => setCustomerPage(p => p - 1)}>&lsaquo;</button>
                  <span style={{ color: 'var(--text-muted)' }}>Trang {customerPage} / {customerTotalPages}</span>
                  <button disabled={customerPage === customerTotalPages} className="page-btn" onClick={() => setCustomerPage(p => p + 1)}>&rsaquo;</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: COSTUME SELECTION */}
        {step === 2 && selectedCustomer && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h3 style={{ margin: 0 }}>Bước 2: Chọn trang phục</h3>
              </div>
              <div style={{ background: 'var(--surface-2)', padding: '10px 20px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', marginRight: 8 }}>Đang đặt cho:</span>
                <strong>{selectedCustomer.name}</strong> ({selectedCustomer.phone})
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 1.2fr', gap: 24 }}>
              {/* Left Column: Costume Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="search-bar" style={{ margin: 0 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input 
                      className="form-control" 
                      placeholder="Tìm tên trang phục..." 
                      style={{ paddingLeft: 16 }}
                      value={costumeSearchTerm}
                      onChange={(e) => setCostumeSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-table-container" style={{ 
                  maxHeight: '500px', 
                  overflowY: 'auto', 
                  background: 'rgba(0,0,0,0.1)', 
                  borderRadius: 16,
                  padding: 8,
                  border: '1px solid var(--border-color)'
                }}>
                  {costumes.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {costumes.map(c => (
                        <div 
                          key={c.id} 
                          className="costume-pick-item" 
                          style={{ 
                            padding: '12px 16px', 
                            borderRadius: 12, 
                            background: 'var(--surface-2)', 
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.2s ease',
                            cursor: 'default'
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <strong style={{ fontSize: '1rem' }}>{c.name}</strong>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                              <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{c.price.toLocaleString()}đ</span>
                              <span className={`badge ${c.quantity > 5 ? 'success' : c.quantity > 0 ? 'warning' : 'danger'}`} style={{ fontSize: '0.7rem' }}>
                                Kho: {c.quantity}
                              </span>
                            </div>
                          </div>
                          <button 
                            className="btn btn-primary" 
                            style={{ width: 'auto', padding: '6px 16px', fontSize: '0.85rem' }} 
                            onClick={() => addItemByCostume(c)}
                            disabled={c.quantity <= 0}
                          >
                            Thêm
                          </button>
                        </div>
                      ))}
                      
                      {costumeTotalPages > 1 && (
                        <div className="pagination" style={{ padding: '10px 0', borderTop: '1px solid var(--border-color)', marginTop: 10 }}>
                          <button disabled={costumePage === 1} className="page-btn" onClick={() => setCostumePage(p => p - 1)}>&lsaquo;</button>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{costumePage} / {costumeTotalPages}</span>
                          <button disabled={costumePage === costumeTotalPages} className="page-btn" onClick={() => setCostumePage(p => p + 1)}>&rsaquo;</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                      {loading ? <div className="loading-spinner"></div> : "Không tìm thấy trang phục nào."}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Items */}
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ 
                  flex: 1, 
                  background: 'var(--surface-2)', 
                  borderRadius: 16, 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      Đơn hàng hiện tại
                    </h4>
                    <span className="badge info">{items.length} món</span>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', maxHeight: '400px' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Tên</th>
                          <th style={{ textAlign: 'center' }}>SL</th>
                          <th style={{ textAlign: 'right' }}>Tổng</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              <strong>{item.name}</strong>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                <button className="mr-close-btn" style={{ width: 24, height: 24, fontSize: 10 }} onClick={() => updateQty(idx, -1)}>−</button>
                                <span style={{ fontWeight: 600, minWidth: 20 }}>{item.quantity}</span>
                                <button className="mr-close-btn" style={{ width: 24, height: 24, fontSize: 10 }} onClick={() => updateQty(idx, 1)}>+</button>
                              </div>
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 600 }}>{(item.price * item.quantity).toLocaleString()}đ</td>
                            <td style={{ textAlign: 'right' }}>
                              <button className="mr-close-btn" onClick={() => removeItem(idx)}>Xóa</button>
                            </td>
                          </tr>
                        ))}
                        {items.length === 0 && (
                          <tr><td colSpan={4} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Chưa có trang phục nào.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: '0 0 16px 16px', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Tổng thanh toán:</span>
                        <strong style={{ fontSize: '1.2rem' }}>{totalAmount.toLocaleString()}đ</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Tiền đặt cọc (50%):</span>
                        <strong style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>{(totalAmount * 0.5).toLocaleString()}đ</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button className="btn outline" style={{ flex: 1 }} onClick={() => setStep(1)}>Quay lại</button>
                      <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => setStep(3)} disabled={items.length === 0}>Tiếp tục xác nhận</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && selectedCustomer && (
          <div>
            <h3 style={{ marginBottom: 24 }}>Bước 3: Xác nhận đơn hàng</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 30 }}>
              <div style={{ background: 'var(--surface-2)', padding: 24, borderRadius: 16 }}>
                <h4 style={{ marginBottom: 16 }}>Thông tin khách hàng</h4>
                <p><strong>{selectedCustomer.name}</strong></p>
                <p style={{ color: 'var(--text-muted)' }}>Phone: {selectedCustomer.phone}</p>
                <p style={{ color: 'var(--text-muted)' }}>Email: {selectedCustomer.email}</p>
              </div>
              <div style={{ background: 'var(--surface-2)', padding: 24, borderRadius: 16 }}>
                <h4 style={{ marginBottom: 16 }}>Thời hạn & Thanh toán</h4>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 8, fontSize: '0.9rem' }}>Hạn trả (Dự kiến):</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={dueDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--primary-color)' }}
                  />
                  <small style={{ color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>Mặc định là 3 ngày kể từ hôm nay.</small>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>Tổng tiền:</span>
                  <strong>{totalAmount.toLocaleString()}đ</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', borderTop: '1px solid var(--border-color)', paddingTop: 12, marginTop: 12 }}>
                  <span>Tiền đặt cọc:</span>
                  <strong style={{ color: 'var(--primary-color)' }}>{(totalAmount * 0.5).toLocaleString()}đ</strong>
                </div>
              </div>
            </div>

            <div className="admin-table-container" style={{ marginBottom: 30 }}>
              <h4 style={{ marginBottom: 16 }}>Sản phẩm đã chọn</h4>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Trang phục</th>
                    <th>Số lượng</th>
                    <th style={{ textAlign: 'right' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td style={{ textAlign: 'right' }}>{(item.price * item.quantity).toLocaleString()}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <button className="btn outline" style={{ width: 'auto' }} onClick={() => setStep(2)}>Quay lại</button>
              <button className="btn btn-primary" style={{ width: 'auto' }} onClick={finishOrder} disabled={loading}>
                {loading ? "Đang xử lý..." : "Xác nhận & Hoàn tất đặt hàng"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
