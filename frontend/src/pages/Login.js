import React, { useState } from "react";
import API from "../utils/axiosInstance"; // ✅ use instance
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const endpoint = isLoginView
        ? "/api/auth/login"
        : "/api/auth/register";

      const { data } = await API.post(endpoint, {
        username,
        password,
      });

      // ✅ store user
      localStorage.setItem("whatsapp-user", JSON.stringify(data));

      // ✅ redirect (no reload needed)
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLoginView ? "Welcome Back" : "Create Account"}</h2>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="login-input"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            className="login-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLoginView
              ? "Log In"
              : "Sign Up"}
          </button>
        </form>

        <div
          className="login-toggle"
          onClick={() => {
            setIsLoginView(!isLoginView);
            setError("");
            setUsername("");
            setPassword("");
          }}
        >
          {isLoginView
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </div>
      </div>
    </div>
  );
}

export default Login;