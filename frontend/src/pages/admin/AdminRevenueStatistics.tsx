import { useState, useEffect } from 'react';
import { returnApi } from '../../api/returnApi';
import type { RevenueStatisticResponse, ReturnInvoiceDetailResponse } from '../../types/return';
import './AdminLayout.css';

export default function AdminRevenueStatistics() {
  const [statType, setStatType] = useState('MONTH'); // MONTH, QUARTER, YEAR
  const [stats, setStats] = useState<RevenueStatisticResponse[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [details, setDetails] = useState<ReturnInvoiceDetailResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchStats = async (type: string) => {
    try {
      setLoading(true);
      const res = await returnApi.getRevenueStatistics(type);
      setStats(res.data.result);
      setSelectedPeriod(null);
      setDetails([]);
    } catch (err) {
      console.error('Failed to fetch statistics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(statType);
  }, [statType]);

  const handleRowClick = async (period: string) => {
    setSelectedPeriod(period);
    try {
      setLoadingDetails(true);
      const res = await returnApi.getRevenueDetails(statType, period);
      setDetails(res.data.result);
    } catch (err) {
      console.error('Failed to fetch details', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const formatPeriodLabel = (period: string) => {
    if (!period) return 'N/A';
    if (statType === 'MONTH') {
      const parts = period.split('-');
      if (parts.length < 2) return period;
      const [year, month] = parts;
      return `Tháng ${month}/${year}`;
    }
    if (statType === 'QUARTER') {
      const parts = period.split('-');
      if (parts.length < 2) return period;
      const [year, quarter] = parts;
      return `Quý ${quarter.substring(1)}/${year}`;
    }
    return `Năm ${period}`;
  };

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Thống kê doanh thu</h1>
          <p style={{ color: 'var(--text-muted)' }}>Xem báo cáo doanh thu theo thời gian</p>
        </div>
        <div className="glass-panel" style={{ padding: '4px', display: 'flex', gap: '4px' }}>
          <button 
            className={`btn ${statType === 'MONTH' ? 'btn-primary' : 'outline'}`} 
            style={{ width: '100px', fontSize: '0.85rem', padding: '8px' }}
            onClick={() => setStatType('MONTH')}
          >
            Theo Tháng
          </button>
          <button 
            className={`btn ${statType === 'QUARTER' ? 'btn-primary' : 'outline'}`} 
            style={{ width: '100px', fontSize: '0.85rem', padding: '8px' }}
            onClick={() => setStatType('QUARTER')}
          >
            Theo Quý
          </button>
          <button 
            className={`btn ${statType === 'YEAR' ? 'btn-primary' : 'outline'}`} 
            style={{ width: '100px', fontSize: '0.85rem', padding: '8px' }}
            onClick={() => setStatType('YEAR')}
          >
            Theo Năm
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedPeriod ? '400px 1fr' : '1fr', gap: '24px', transition: 'all 0.3s ease' }}>
        {/* Left Table: Statistics Summary */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>
            Tổng hợp doanh thu {statType === 'MONTH' ? 'hàng tháng' : statType === 'QUARTER' ? 'hàng quý' : 'hàng năm'}
          </div>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <table className="mr-table">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th style={{ textAlign: 'right' }}>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {stats.length > 0 ? (
                  stats.map((s) => (
                    <tr 
                      key={s.period} 
                      className={`mr-table-row ${selectedPeriod === s.period ? 'active' : ''}`}
                      style={{ cursor: 'pointer', backgroundColor: selectedPeriod === s.period ? 'rgba(99, 102, 241, 0.15)' : '' }}
                      onClick={() => handleRowClick(s.period)}
                    >
                      <td style={{ fontWeight: 500 }}>{formatPeriodLabel(s.period)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary-color)' }}>
                        {s.totalRevenue.toLocaleString()} đ
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      Không có dữ liệu thống kê
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Right Table: Details for selected period */}
        {selectedPeriod && (
          <div className="glass-panel" style={{ overflow: 'hidden', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Chi tiết hóa đơn: {formatPeriodLabel(selectedPeriod)}</span>
              <button 
                className="mr-close-btn" 
                onClick={() => setSelectedPeriod(null)}
              >
                ×
              </button>
            </div>
            {loadingDetails ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <table className="mr-table">
                <thead>
                  <tr>
                    <th>ID Phiếu</th>
                    <th>Khách hàng</th>
                    <th>Ngày mượn</th>
                    <th style={{ textAlign: 'center' }}>Số trang phục</th>
                    <th style={{ textAlign: 'right' }}>Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {details.length > 0 ? (
                    details.map((d) => (
                      <tr key={d.id} className="mr-table-row">
                        <td><span className="mr-order-id" style={{ fontSize: '0.75rem' }}>{d.id.substring(0, 10)}</span></td>
                        <td style={{ fontWeight: 600 }}>{d.customerName}</td>
                        <td>{new Date(d.borrowDate).toLocaleDateString('vi-VN')}</td>
                        <td style={{ textAlign: 'center' }}>{d.totalItems}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--primary-color)' }}>
                          {d.totalAmount.toLocaleString()} đ
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Không có chi tiết hóa đơn
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
