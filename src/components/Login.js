import React, { useEffect, useState } from "react";
import passwordImg from "../assets/password.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function Login(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (props.loadingRef?.current) {
      props.loadingRef.current.continuousStart();
      setTimeout(() => {
        props.loadingRef.current.complete();
      }, 10);
    }
  }, [props.loadingRef]);

  const inputClass = "form-control glass-light";
  const containerClass = "glass-container-light";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!id || !password) {
      props.showAlert("Please fill in all fields", "warning");
      return;
    }

    try {
      const response = await fetch(props.loginendpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: id, password }),
      });

      const result = await response.json();

      if (result.success) {
        // Store user data in localStorage
        const userData = {
          user_id: result.user_id,
          name: result.name,
          email: result.email,
          designation: result.designation
        };
        localStorage.setItem("userData", JSON.stringify(userData));

        // Store individual items (for backward compatibility)
        localStorage.setItem("username", result.name);
        localStorage.setItem("userId", result.user_id);
        localStorage.setItem("designation", result.designation);

        // Update parent component state
        props.setUsername(result.name);
        
        // Update AuthContext with user data
        if (login) {
          login(userData); // No token needed
        }

        props.showAlert("Login successful!", "success");
        navigate("/");
      } else {
        props.showAlert(result.error || "Login failed", "danger");
      }
    } catch (err) {
      console.error("Network error:", err);
      props.showAlert("Connection error. Please try again.", "danger");
    }
  };

  return (
    <div
      style={{ position: "relative", minHeight: "100vh", paddingTop: "80px" }}
    >
      <div className="login-overlay"></div>

      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className={`${containerClass} p-4 rounded-3 shadow-lg`}
          style={{ width: "90%", maxWidth: "1000px" }}
        >
          <div className="row g-0">
            {/* Left side - Welcome */}
            <div className="col-lg-6 p-4 d-flex flex-column justify-content-center align-items-center">
              <h1 className="mb-4 text-center">Welcome Back</h1>
              <p className="mb-4 text-center">
                Log in to manage your scholarship applications and track your
                status.
              </p>
              <div className="mt-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Scholarship Illustration"
                  className="img-fluid"
                  style={{ maxHeight: "180px", opacity: 0.95 }}
                />
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="col-lg-6 p-4 d-flex flex-column">
              <form onSubmit={handleLogin} className="h-100 d-flex flex-column">
                <h2 className="mb-4 text-center">Login</h2>

                <div className="mb-3">
                  <label className="form-label">ID / Roll Number</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Enter your ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <img src={passwordImg} alt="password" width="15" />
                    </span>
                    <input
                      type="password"
                      className={inputClass}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn w-100 py-2 mb-2 mt-auto"
                  style={{
                    background: "linear-gradient(135deg, #ff3a3a 0%, #ff6b6b 100%)",
                    border: "none",
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  Login
                </button>

                <div className="text-center">
                  <Link
                    to="/signup"
                    style={{ textDecoration: "none", fontWeight: "500" }}
                  >
                    Don't have an account? Sign up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}