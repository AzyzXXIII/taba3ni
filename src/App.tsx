import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./UI/AppLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";

function App() {
  // TODO: Replace with real auth later
  const isAuthenticated = true; // Temporarily set to true for testing
  const user = {
    name: "Ahmed Ben Ali",
    role: "admin" as const,
    notifications: 5,
  };

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
              isAuthenticated ? (
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
