import React, { useState } from "react";
import "../styles/AuthPage.css";
import AuthForm from "../components/AuthForm";

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1 className="brand-title">IntelliGrocer</h1>
        <p className="brand-subtitle">Smart Inventory Management for the Future</p>
      </div>
      <div className="auth-right">
        {isForgot ? (
          <>
            <h2>Forgot Password</h2>
            <form>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Reset Password</button>
            </form>
            <p onClick={() => setIsForgot(false)} className="toggle-text">
              Back to Login
            </p>
          </>
        ) : (
          <>
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>
            <AuthForm 
              isLogin={isLogin} 
              setIsLogin={setIsLogin} 
              setIsForgot={setIsForgot} 
              onLogin={onLogin}
            />
            <div className="toggle-options">
              <p onClick={() => setIsLogin(!isLogin)} className="toggle-text">
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </p>
              {isLogin && (
                <p onClick={() => setIsForgot(true)} className="toggle-text">
                  Forgot Password?
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
