import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { customerApi } from "../../api/customerApi";
import type { Customer } from "../../types/customer";
import "./AdminLayout.css";

export default function AdminCustomerList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchPhone, setSearchPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = searchPhone
        ? await customerApi.getCustomerByPhone(searchPhone, page)
        : await customerApi.getAllCustomers(page);

      if (response.data.result) {
        setCustomers(response.data.result.data);
        setTotalPages(response.data.result.totalPages);
      }
    } catch (err) {
      setError("Failed to fetch customers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    try {
      await customerApi.deleteCustomer(id);
      fetchCustomers();
    } catch (err) {
      alert("Failed to delete customer");
    }
  };

  return (
    <div className="admin-customer-list">
      <div className="glass-panel admin-card">
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search by phone number..."
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "auto", padding: "10px 24px" }}
          >
            Tìm kiếm
          </button>
          {searchPhone && (
            <button
              type="button"
              className="btn outline"
              style={{ width: "auto", padding: "10px 24px" }}
              onClick={() => {
                setSearchPhone("");
                setPage(1);
              }}
            >
              Xóa lọc
            </button>
          )}
        </form>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <strong 
                        style={{ cursor: 'pointer', color: 'var(--primary-color)' }}
                        onClick={() => navigate(`/admin/customers/${customer.id}`)}
                      >
                        {customer.name}
                      </strong>
                    </td>
                    <td>{customer.username}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.email}</td>
                    <td>{customer.address}</td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="btn btn-primary"
                          style={{ padding: "6px 14px", fontSize: "0.85rem", width: "auto", minWidth: '100px' }}
                          onClick={() => navigate(`/admin/customers/${customer.id}`)}
                        >
                          Chi tiết
                        </button>
                        <button
                          className="btn outline"
                          style={{
                            padding: "6px 14px",
                            fontSize: "0.85rem",
                            color: "var(--error-color)",
                            width: "auto",
                            minWidth: '80px',
                            borderColor: 'rgba(239, 68, 68, 0.3)'
                          }}
                          onClick={() => handleDelete(customer.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "var(--text-muted)",
                      }}
                    >
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="page-btn"
                >
                  &lsaquo;
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`page-btn ${page === i + 1 ? "active" : ""}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="page-btn"
                >
                  &rsaquo;
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
