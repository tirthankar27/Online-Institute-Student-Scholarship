import React, { useEffect, useState } from "react";
import passwordImg from "../assets/password.png";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp(props) {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (props.loadingRef?.current) {
      props.loadingRef.current.continuousStart();
      setTimeout(() => {
        props.loadingRef.current.complete();
      }, 10);
    }
  }, [props.loadingRef]);

  const inputClass = "form-control glass-light"; // No dark mode
  const containerClass = "glass-container-light"; // No dark mode

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !id || !password || !confirmPassword) {
      props.showAlert("Please fill in all fields.", "warning");
      return;
    }
    if (password !== confirmPassword) {
      props.showAlert("Passwords do not match.", "danger");
      return;
    }
    try {
      const response = await fetch(props.signupendpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          id,
          password,
        }),
      });
      const result = await response.json();
      if (result.user_id) {
        props.showAlert("Signup successful! Please log in.", "success");
        navigate("/login");
      } else {
        props.showAlert(result.error || result.message, "danger");
      }
    } catch (err) {
      console.error("Network error:", err);
      props.showAlert("Something went wrong. Please try again later.", "danger");
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", paddingTop: "80px" }}>
      <div className="login-overlay"></div>

      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className={`${containerClass} p-4 rounded-3 shadow-lg`}
          style={{ width: "90%", maxWidth: "1000px" }}
        >
          <div className="row g-0">
            {/* Left side - Welcome message */}
            <div className="col-lg-6 p-4 d-flex flex-column justify-content-center align-items-center">
              <h1 className="mb-4 text-center">
                Join Our Community
              </h1>
              <p className="mb-4 text-center">
                Sign up to start managing your scholarship applications today!
              </p>
              <div className="mt-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" // Scholarship icon
                  alt="Scholarship Illustration"
                  className="img-fluid"
                  style={{ maxHeight: "180px", opacity: 0.95 }}
                />
              </div>
            </div>

            {/* Right side - Signup form */}
            <div className="col-lg-6 p-4">
              <form onSubmit={handleSignup} className="h-100 d-flex flex-column">
                <h2 className="mb-4 text-center text-gradient-red">Sign Up</h2>

                <div className="mb-3">
                  <label className="form-label text-gradient-red">ID / Roll Number</label>
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
                  <label className="form-label text-gradient-red">Username</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-gradient-red">Password</label>
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

                <div className="mb-3">
                  <label className="form-label text-gradient-red">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <img src={passwordImg} alt="password" width="15" />
                    </span>
                    <input
                      type="password"
                      className={inputClass}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
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
                  Sign Up
                </button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-gradient-red"
                    style={{ textDecoration: "none", fontWeight: "500" }}
                  >
                    Already have an account? Login
                  </Link>
                </div>

                <div className="text-center mt-2">
                  <small className="text-muted">
                    By signing up, you agree to our <u>Terms</u> and <u>Privacy Policy</u>
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
