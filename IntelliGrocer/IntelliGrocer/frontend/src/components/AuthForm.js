import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ isLogin, setIsLogin, setIsForgot, onLogin }) => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    if (!email || !password) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }
  
    try {
      console.log("📢 Sending login request:", { email, password });
  
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // ✅ Using email instead of username
      });
  
      const data = await response.json();
      console.log("Login response:", data);
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);
        localStorage.setItem("employeeId", data.employeeId);
        onLogin(data.role);
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Handle Registration */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!role) {
      setError("Please select a role");
      return;
    }

    const userData = {
      email: email.trim(),
      password,
      username: fullName.trim(),
      role,
      employeeId,
    };

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "An error occurred. Please try again.");
      } else {
        alert("Success: " + data.message);
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole("");
        setEmployeeId("");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={isLogin ? handleLogin : handleSubmit}>
      {error && <div className="error">{error}</div>}

    

      {!isLogin && (
        <>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select Role</option>
            <option value="shopper">Shopper</option>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
          {(role === "employee" || role === "manager") && (
            <input
              type="text"
              placeholder="Enter Employee/Manager ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          )}
        </>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {!isLogin && (
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      )}

      {!isLogin && (
        <label className="terms">
          <input type="checkbox" required />
          <span className="terms-text">
            🚀 IntelliGrocer is evolving! Be part of the future—this system will redefine grocery management.{" "}
            <span className="clickable-text" onClick={() => alert("Exciting updates coming soon!")}>
              Click to stay updated!
            </span>
          </span>
        </label>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : isLogin ? "Login" : "Sign Up"}
      </button>
    </form>
  );
};

export default AuthForm;