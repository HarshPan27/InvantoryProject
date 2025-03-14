// App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

// Import the pages for each role
import AuthPage from "./pages/AuthPage";
import EmployeeDashboard from "./pages/employee-dashboard";
import ManagerDashboard from "./pages/manager-dashboard";
import ShopperDashboard from "./pages/customer-dashboard";

function App() {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Restore the role from localStorage when the app mounts
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  // Called after a successful login in AuthForm
  const handleLogin = (role) => {
    setUserRole(role);
    localStorage.setItem("role", role);
    switch (role) {
      case "manager":
        navigate("/manager-dashboard");
        break;
      case "employee":
        navigate("/employee-dashboard");
        break;
      default:
        navigate("/customer-dashboard");
    }
  };

  // Logout function to clear session
  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <Routes>
      {/* Public route: Authentication page */}
      <Route path="/" element={<AuthPage onLogin={handleLogin} />} />

      {/* Protected route for Manager Dashboard */}
      <Route
        path="/manager-dashboard"
        element={
          userRole === "manager" ? (
            <ManagerDashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Protected route for Employee Dashboard */}
      <Route
        path="/employee-dashboard"
        element={
          userRole === "employee" ? (
            <EmployeeDashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Protected route for Shopper/Customer Dashboard */}
      <Route
        path="/customer-dashboard"
        element={
          userRole && userRole !== "manager" && userRole !== "employee" ? (
            <ShopperDashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;