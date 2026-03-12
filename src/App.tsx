import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./UI/AppLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Products from "./pages/Products";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import Deliveries from "./pages/Deliveries";
import DeliveryDetails from "./pages/DeliveryDetails";
import DeliveryForm from "./components/DeliveryForm";
import Distributors from "./pages/Distributors";
import DistributorDetails from "./pages/DistributorDetails";
import Analytics from "./pages/Analytics";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import NewOrder from "./pages/NewOrder";
import DeliveryHistory from "./pages/DeliveryHistory";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";
import { NotificationsProvider } from "./hooks/useNotifications";
import { NotificationToast } from "./components/NotificationToast";

type User = {
  name: string;
  email: string;
  role: "admin" | "distributor" | "client";
  notifications: number;
};

declare global {
  interface Window {
    login: (userData: User) => void;
    logout: () => void;
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback((userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  }, []);

  useEffect(() => {
    window.login = login;
    window.logout = logout;
  }, [login, logout]);

  return (
    <NotificationsProvider>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />

          {/* Protected — all nested inside AppLayout so sidebar always renders */}
          <Route
            element={
              isAuthenticated && user ? (
                <AppLayout
                  role={user.role}
                  userName={user.name}
                  unreadNotifications={user.notifications}
                  companyName="Taba3ni Dairy"
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard */}
            <Route
              path="dashboard"
              element={
                <Dashboard
                  userRole={user?.role}
                  userId={user?.email}
                  userName={user?.name}
                />
              }
            />

            {/* Orders */}
            <Route
              path="orders"
              element={
                <Orders
                  userRole={user?.role}
                  userId={user?.email}
                  userName={user?.name}
                />
              }
            />
            <Route
              path="orders/:orderId"
              element={
                <OrderDetails userRole={user?.role} userId={user?.email} />
              }
            />
            <Route path="new-order" element={<NewOrder />} />

            {/* Deliveries */}
            <Route
              path="deliveries"
              element={
                <Deliveries
                  userRole={user?.role}
                  userId={user?.email}
                  userName={user?.name}
                />
              }
            />
            <Route
              path="deliveries/new"
              element={<DeliveryForm onCloseModal={() => {}} />}
            />
            <Route
              path="deliveryDetails/:deliveryId"
              element={<DeliveryDetails />}
            />

            {/* History — all roles */}
            <Route
              path="history"
              element={
                <DeliveryHistory
                  userRole={user?.role}
                  userId={user?.email}
                  userName={user?.name}
                />
              }
            />
            <Route
              path="users"
              element={<UserManagement userRole={user?.role} />}
            />

            {/* Profile — all roles */}
            <Route
              path="profile"
              element={
                <Profile
                  userRole={user?.role}
                  userId={user?.email}
                  userName={user?.name}
                />
              }
            />

            {/* Products */}
            <Route path="products" element={<Products />} />

            {/* Clients */}
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:clientId" element={<ClientDetails />} />

            {/* Distributors */}
            <Route path="distributors" element={<Distributors />} />
            <Route
              path="distributors/:distributorId"
              element={<DistributorDetails />}
            />

            {/* Analytics */}
            <Route
              path="analytics"
              element={<Analytics userRole={user?.role} />}
            />

            {/* Invoices */}
            <Route
              path="invoices"
              element={<Invoices userRole={user?.role} userId={user?.email} />}
            />
            <Route
              path="invoices/:invoiceId"
              element={
                <InvoiceDetails userRole={user?.role} userId={user?.email} />
              }
            />
            <Route
              path="settings"
              element={<Settings userRole={user?.role} />}
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <NotificationToast />
    </NotificationsProvider>
  );
}

export default App;
