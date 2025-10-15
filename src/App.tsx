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
import Distributors from "./pages/Distributors";
import DistributorDetails from "./pages/DistributorDetails";
import Analytics from "./pages/Analytics";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import InvoiceForm from "./components/InvoiceForm";

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
    <>
      <NotificationsProvider>
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login />
                )
              }
            />

            {/* Protected Routes */}
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
              <Route path="dashboard" element={<Dashboard />} />

              {/* Orders */}
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:orderId" element={<OrderDetails />} />

              {/* Products */}
              <Route path="products" element={<Products />} />

              {/* Clients */}
              <Route path="clients" element={<Clients />} />
              <Route path="clients/:clientId" element={<ClientDetails />} />

              {/* Deliveries - NEW */}
              <Route path="deliveries" element={<Deliveries />} />
              <Route
                path="deliveries/:deliveryId"
                element={<DeliveryDetails />}
              />

              {/* Distributors - NEW */}
              <Route path="distributors" element={<Distributors />} />
              <Route
                path="distributors/:distributorId"
                element={<DistributorDetails />}
              />
              <Route path="analytics" element={<Analytics />} />

              <Route path="invoices" element={<Invoices />} />
              <Route path="invoices/:invoiceId" element={<InvoiceDetails />} />
              <Route path="invoices/new" element={<InvoiceForm />} />
              <Route path="invoices/:invoiceId" element={<InvoiceDetails />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        <NotificationToast />
      </NotificationsProvider>
    </>
  );
}

export default App;
