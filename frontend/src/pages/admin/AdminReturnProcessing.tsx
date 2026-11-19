import { useState, useEffect } from 'react';
import { customerApi } from '../../api/customerApi';
import { rentalApi } from '../../api/rentalApi';
import { returnApi } from '../../api/returnApi';
import { errorApi } from '../../api/errorApi';
import type { Customer } from '../../types/customer';
import type { RentalOrder } from '../../types/rental';
import type { ErrorPenalty } from '../../types/error';
import type { ReturnRequest } from '../../types/return';
import './AdminLayout.css';

export default function AdminReturnProcessing() {
  const [step, setStep] = useState(1); // 1: Search, 2: Select Items, 3: Invoice
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [rentals, setRentals] = useState<RentalOrder[]>([]);
  const [selectedRental, setSelectedRental] = useState<RentalOrder | null>(null);
  
  const [errorTypes, setErrorTypes] = useState<ErrorPenalty[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Return Processing State
  const [returnItems, setReturnItems] = useState<Record<string, {
    selected: boolean;
    tinhTrang: string;
    selectedLois: string[];
    tienPhat: number;
    daysBorrowed: number;
    rentalFee: number;
  }>>({});

  useEffect(() => {
    const fetchErrorTypes = async () => {
      try {
        const res = await errorApi.getAllErrors('', 1, 100);
        setErrorTypes(res.data.result.data);
      } catch (err) {
        console.error('Failed to fetch error types', err);
      }
    };
    fetchErrorTypes();
  }, []);

  const handleSearchCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = searchTerm.trim() 
        ? await customerApi.getCustomersByName(searchTerm)
        : await customerApi.getAllCustomers(1, 100);
        
      setCustomers(res.data.result.data);
      if (res.data.result.data.length === 0) {
        setMessage({ text: 'Không tìm thấy khách hàng nào', type: 'error' });
      } else {
        setMessage({ text: '', type: '' });
      }
    } catch (err) {
      console.error('Search failed', err);
      setMessage({ text: 'Có lỗi xảy ra khi tìm kiếm', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer);
    try {
      setLoading(true);
      // Fetch only RENTING orders
      const res = await rentalApi.getAllOrders({ 
        status: 'RENTING'
      });
      // Filter manually by customerId since getAllOrders doesn't support customerId param
      // Note: In a real app, I'd use an API that filters by both.
      const customerRentals = res.data.result.data.filter(r => r.customerResponse.id === customer.id);
      setRentals(customerRentals);
      setStep(2);
    } catch (err) {
      console.error('Fetch rentals failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRental = (rental: RentalOrder) => {
    setSelectedRental(rental);
    const initialItems: any = {};
    const today = new Date();
    
    rental.rentalDetailResponses.forEach(item => {
      const borrowDate = new Date(rental.createDate);
      const diffTime = Math.abs(today.getTime() - borrowDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      
      initialItems[item.id] = {
        selected: false,
        tinhTrang: 'Bình thường',
        selectedLois: [],
        tienPhat: 0,
        daysBorrowed: diffDays,
        rentalFee: item.costumeResponse.price * diffDays * item.quantity
      };
    });
    setReturnItems(initialItems);
  };

  const handleToggleItem = (itemId: string) => {
    setReturnItems(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], selected: !prev[itemId].selected }
    }));
  };

  const handleUpdateItem = (itemId: string, field: string, value: any) => {
    setReturnItems(prev => {
      const newItem = { ...prev[itemId], [field]: value };
      
      // If updating loiIds, recalculate status and automatic penalty (if needed)
      if (field === 'selectedLois') {
        const selectedLoiObjects = errorTypes.filter(l => value.includes(l.id));
        newItem.tienPhat = selectedLoiObjects.reduce((sum, l) => sum + l.mucPhat, 0);
      }
      
      return { ...prev, [itemId]: newItem };
    });
  };

  const calculateTotals = () => {
    let totalRentalFee = 0;
    let totalPenalty = 0;
    
    Object.keys(returnItems).forEach(id => {
      if (returnItems[id].selected) {
        totalRentalFee += returnItems[id].rentalFee;
        totalPenalty += returnItems[id].tienPhat;
      }
    });

    const totalToPay = totalRentalFee + totalPenalty;
    const deposit = selectedRental?.deposit || 0;
    const balance = totalToPay - deposit;

    return { totalRentalFee, totalPenalty, totalToPay, deposit, balance };
  };

  const handleCheckout = () => {
    const selectedCount = Object.values(returnItems).filter(i => i.selected).length;
    if (selectedCount === 0) {
      alert('Vui lòng chọn ít nhất một trang phục để trả');
      return;
    }
    setStep(3);
  };

  const handleConfirmReturn = async () => {
    if (!selectedRental) return;
    
    const request: ReturnRequest = {
      phieuMuonId: selectedRental.id,
      ngayTra: new Date().toISOString(),
      items: Object.keys(returnItems)
        .filter(id => returnItems[id].selected)
        .map(id => ({
          chiTietPhieuMuonId: id,
          tinhTrang: returnItems[id].tinhTrang,
          loiIds: returnItems[id].selectedLois,
          tienPhat: returnItems[id].tienPhat
        }))
    };

    try {
      setLoading(true);
      await returnApi.createReturn(request);
      setMessage({ text: 'Thanh toán và trả đồ thành công!', type: 'success' });
      setTimeout(() => {
        setStep(1);
        setSelectedCustomer(null);
        setSelectedRental(null);
        setSearchTerm('');
      }, 2000);
    } catch (err) {
      console.error('Return failed', err);
      setMessage({ text: 'Có lỗi xảy ra khi xử lý trả đồ', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Nhận trả & Thanh toán</h1>
          <p style={{ color: 'var(--text-muted)' }}>Bước {step}: {step === 1 ? 'Tìm kiếm khách hàng' : step === 2 ? 'Chọn trang phục trả' : 'Xác nhận hóa đơn'}</p>
        </div>
      </div>

      {message.text && (
        <div className={`glass-panel ${message.type === 'success' ? 'success' : 'danger'}`} 
             style={{ padding: '12px 16px', marginBottom: '20px', backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.type === 'success' ? '#10b981' : '#ef4444' }}>
          {message.text}
        </div>
      )}

      {/* Step 1: Search Customer */}
      {step === 1 && (
        <div className="search-section">
          <form onSubmit={handleSearchCustomer} className="glass-panel" style={{ padding: '24px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Nhập tên khách hàng cần tìm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '0 32px' }}>Tìm kiếm</button>
          </form>

          {customers.length > 0 && (
            <div className="glass-panel" style={{ overflow: 'hidden' }}>
              <table className="mr-table">
                <thead>
                  <tr>
                    <th>Khách hàng</th>
                    <th>Số điện thoại</th>
                    <th>Địa chỉ</th>
                    <th style={{ textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id} className="mr-table-row">
                      <td style={{ fontWeight: 600 }}>{c.name}</td>
                      <td>{c.phone}</td>
                      <td>{c.address}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="mr-action-btn detail" onClick={() => handleSelectCustomer(c)}>Chọn khách hàng</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Items and input conditions */}
      {step === 2 && selectedCustomer && (
        <div className="select-items-section">
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Khách hàng đang chọn:</p>
              <h3 style={{ fontSize: '1.2rem' }}>{selectedCustomer.name} - {selectedCustomer.phone}</h3>
            </div>
            <button className="btn outline" style={{ width: 'auto' }} onClick={() => setStep(1)}>Thay đổi</button>
          </div>

          {!selectedRental ? (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ marginBottom: '16px' }}>Danh sách phiếu mượn chưa trả:</h3>
              {rentals.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {rentals.map(r => (
                    <div key={r.id} className="glass-panel" style={{ padding: '20px', cursor: 'pointer', border: '1px solid var(--primary-color)' }} onClick={() => handleSelectRental(r)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span className="mr-order-id">#{r.id.substring(0, 8)}</span>
                        <span className="badge warning">Đang thuê</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Ngày mượn: {new Date(r.createDate).toLocaleDateString('vi-VN')}</p>
                      <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Tiền cọc: <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{r.deposit.toLocaleString()} đ</span></p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Số lượng: {r.rentalDetailResponses.length} loại trang phục</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Khách hàng không có phiếu mượn nào đang mượn.</p>
              )}
            </div>
          ) : (
            <div className="rental-details">
               <div className="glass-panel" style={{ marginBottom: '24px', overflow: 'hidden' }}>
                 <div style={{ padding: '16px 20px', background: 'var(--primary-soft)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Chi tiết phiếu mượn #{selectedRental.id.substring(0, 10)}</h3>
                    <button className="btn outline" style={{ width: 'auto', padding: '4px 12px', fontSize: '0.8rem' }} onClick={() => setSelectedRental(null)}>Quay lại</button>
                 </div>
                 <table className="mr-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>Chọn</th>
                        <th>Trang phục</th>
                        <th>Ngày mượn</th>
                        <th>Giá/ngày</th>
                        <th>Số ngày</th>
                        <th>Tiền thuê</th>
                        <th>Tình trạng & Lỗi</th>
                        <th>Tiền phạt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRental.rentalDetailResponses.map(item => {
                        const status = returnItems[item.id] || {};
                        return (
                          <tr key={item.id} className={`mr-table-row ${status.selected ? 'active' : ''}`} style={{ backgroundColor: status.selected ? 'var(--primary-soft)' : '' }}>
                            <td>
                              <input 
                                type="checkbox" 
                                checked={status.selected} 
                                onChange={() => handleToggleItem(item.id)}
                                style={{ width: '18px', height: '18px' }}
                              />
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{item.costumeResponse.name}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SL: {item.quantity}</div>
                            </td>
                            <td>{new Date(selectedRental.createDate).toLocaleDateString('vi-VN')}</td>
                            <td>{item.costumeResponse.price.toLocaleString()} đ</td>
                            <td>{status.daysBorrowed} ngày</td>
                            <td style={{ fontWeight: 600 }}>{status.rentalFee?.toLocaleString()} đ</td>
                            <td>
                              {status.selected ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Tình trạng..." 
                                    value={status.tinhTrang}
                                    style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                                    onChange={(e) => handleUpdateItem(item.id, 'tinhTrang', e.target.value)}
                                  />
                                  <select 
                                    multiple 
                                    className="form-control" 
                                    style={{ height: '60px', padding: '4px', fontSize: '0.8rem' }}
                                    value={status.selectedLois}
                                    onChange={(e) => {
                                      const values = Array.from(e.target.selectedOptions, option => option.value);
                                      handleUpdateItem(item.id, 'selectedLois', values);
                                    }}
                                  >
                                    {errorTypes.map(l => (
                                      <option key={l.id} value={l.id}>{l.tenLoi} (+{l.mucPhat.toLocaleString()}đ)</option>
                                    ))}
                                  </select>
                                </div>
                              ) : (
                                <span style={{ color: 'var(--text-muted)' }}>-</span>
                              )}
                            </td>
                            <td>
                              {status.selected ? (
                                <input 
                                  type="number" 
                                  className="form-control" 
                                  value={status.tienPhat}
                                  style={{ width: '100px', padding: '6px 10px' }}
                                  onChange={(e) => handleUpdateItem(item.id, 'tienPhat', parseInt(e.target.value) || 0)}
                                />
                              ) : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                 </table>
               </div>

               <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                 <button className="btn outline" style={{ width: 'auto', padding: '12px 32px' }} onClick={() => setSelectedRental(null)}>Hủy</button>
                 <button className="btn btn-primary" style={{ width: 'auto', padding: '12px 32px' }} onClick={handleCheckout}>Tiến hành thanh toán</button>
               </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Invoice Preview */}
      {step === 3 && selectedCustomer && selectedRental && (
        <div className="invoice-section" style={{ animation: 'fadeIn 0.4s ease' }}>
          <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>HÓA ĐƠN THANH TOÁN</h2>
              <p style={{ color: 'var(--text-muted)' }}>Mã hóa đơn: #RT-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px', padding: '20px', background: 'var(--surface-2)', borderRadius: '12px' }}>
              <div>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Khách hàng</h4>
                <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedCustomer.name}</p>
                <p>{selectedCustomer.phone}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{selectedCustomer.address}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Thông tin mượn</h4>
                <p>Phiếu mượn: <strong>#{selectedRental.id.substring(0, 8)}</strong></p>
                <p>Ngày mượn: {new Date(selectedRental.createDate).toLocaleDateString('vi-VN')}</p>
                <p>Ngày trả: {new Date().toLocaleDateString('vi-VN')}</p>
              </div>
            </div>

            <table className="mr-items-table" style={{ marginBottom: '40px' }}>
              <thead>
                <tr>
                  <th>Tên trang phục</th>
                  <th style={{ textAlign: 'center' }}>Số ngày</th>
                  <th style={{ textAlign: 'right' }}>Tiền thuê</th>
                  <th style={{ textAlign: 'right' }}>Tiền phạt</th>
                  <th style={{ textAlign: 'right' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedRental.rentalDetailResponses.filter(item => returnItems[item.id]?.selected).map(item => {
                  const status = returnItems[item.id];
                  const subtotal = status.rentalFee + status.tienPhat;
                  return (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.costumeResponse.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{status.tinhTrang}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{status.daysBorrowed}</td>
                      <td style={{ textAlign: 'right' }}>{status.rentalFee.toLocaleString()} đ</td>
                      <td style={{ textAlign: 'right', color: status.tienPhat > 0 ? 'var(--error-color)' : 'inherit' }}>
                        {status.tienPhat > 0 ? `+${status.tienPhat.toLocaleString()} đ` : '0 đ'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{subtotal.toLocaleString()} đ</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px', background: 'var(--primary-soft)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tổng tiền mượn:</span>
                <span style={{ fontWeight: 600 }}>{calculateTotals().totalRentalFee.toLocaleString()} đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tổng tiền phạt:</span>
                <span style={{ fontWeight: 600, color: 'var(--error-color)' }}>{calculateTotals().totalPenalty.toLocaleString()} đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <span style={{ fontWeight: 700 }}>TỔNG CỘNG:</span>
                <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary-color)' }}>{calculateTotals().totalToPay.toLocaleString()} đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Số tiền đã đặt cọc:</span>
                <span style={{ fontWeight: 600, color: 'var(--success-color)' }}>- {calculateTotals().deposit.toLocaleString()} đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', padding: '16px', background: 'var(--primary-color)', borderRadius: '8px', color: 'white' }}>
                <span style={{ fontWeight: 700 }}>{calculateTotals().balance >= 0 ? 'KHÁCH PHẢI TRẢ:' : 'TRẢ LẠI KHÁCH:'}</span>
                <span style={{ fontWeight: 700, fontSize: '1.4rem' }}>{Math.abs(calculateTotals().balance).toLocaleString()} đ</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
              <button className="btn outline" onClick={() => setStep(2)}>Quay lại chỉnh sửa</button>
              <button className="btn btn-primary" onClick={handleConfirmReturn} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Xác nhận & Hoàn tất'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
