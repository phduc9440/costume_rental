import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CustomerLayout from "./pages/customer/CustomerLayout";
import CustomerHome from "./pages/customer/CustomerHome";
import CostumeList from "./pages/customer/CostumeList";
import MyRentals from "./pages/customer/MyRentals";
import RentalDetailPage from "./pages/customer/RentalDetailPage";
import ProfilePage from "./pages/customer/ProfilePage";
import CartPage from "./pages/customer/CartPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminCustomerList from "./pages/admin/AdminCustomerList";
import AdminRentalList from "./pages/admin/AdminRentalList";
import AdminEmployeeList from "./pages/admin/AdminEmployeeList";
import AdminCostumeList from "./pages/admin/AdminCostumeList";
import AdminRentalDetail from "./pages/admin/AdminRentalDetail";
import AdminCreateOfflineOrder from "./pages/admin/AdminCreateOfflineOrder";
import AdminCustomerDetail from "./pages/admin/AdminCustomerDetail";
import AdminErrorManagement from "./pages/admin/AdminErrorManagement";
import AdminReturnProcessing from "./pages/admin/AdminReturnProcessing";
import AdminRevenueStatistics from "./pages/admin/AdminRevenueStatistics";
import AdminSupplierList from "./pages/admin/AdminSupplierList";
import { CartProvider } from "./context/CartContext";
import "./index.css";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/customer/home" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Customer routes */}
        <Route element={<ProtectedRoute requiredRoles={["ROLE_CUSTOMER"]} />}>
          <Route
            path="/customer"
            element={
              <CartProvider>
                <CustomerLayout />
              </CartProvider>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<CustomerHome />} />
            <Route path="costumes" element={<CostumeList />} />
            <Route path="rentals" element={<MyRentals />} />
            <Route path="rentals/:orderId" element={<RentalDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="cart" element={<CartPage />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route
          element={
            <ProtectedRoute requiredRoles={["ROLE_ADMIN", "ROLE_EMPLOYEE"]} />
          }
        >
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="customers" element={<AdminCustomerList />} />
            <Route path="customers/:id" element={<AdminCustomerDetail />} />
            <Route path="rentals" element={<AdminRentalList />} />
            <Route path="rentals/new" element={<AdminCreateOfflineOrder />} />
            <Route path="rentals/:orderId" element={<AdminRentalDetail />} />
            <Route path="returns" element={<AdminReturnProcessing />} />
            <Route path="errors" element={<AdminErrorManagement />} />
            <Route path="revenue" element={<AdminRevenueStatistics />} />
            <Route path="employees" element={<AdminEmployeeList />} />
            <Route path="costumes" element={<AdminCostumeList />} />
            <Route path="suppliers" element={<AdminSupplierList />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
