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

type User = {
  name: string;
  email: string;
  role: "admin" | "distributor" | "client";
  notifications: number;
};

// Extend Window interface to include our auth functions
declare global {
  interface Window {
    login: (userData: User) => void;
    logout: () => void;
  }
}

function App() {
  // Check localStorage for existing session
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login function (memoized)
  const login = useCallback((userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  // Logout function (memoized)
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  }, []);

  // Make login/logout available globally (simple approach)
  useEffect(() => {
    window.login = login;
    window.logout = logout;
  }, [login, logout]);

  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
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
            {/* Redirect root to dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard */}
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="orders" element={<Orders />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />

            {/* TODO: Add more routes as you create pages
            <Route path="orders" element={<Orders />} />
            <Route path="deliveries" element={<Deliveries />} />
            <Route path="clients" element={<Clients />} />
            <Route path="distributors" element={<Distributors />} />
            <Route path="products" element={<Products />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="account" element={<Account />} />
            <Route path="notifications" element={<Notifications />} />
            */}
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
