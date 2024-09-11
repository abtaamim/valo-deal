import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import logo from "../../assests/logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    try {
      // http://localhost:8080/api/v1/auth/forgot-password
      // http://localhost:8080/api/v1/auth/forgot-password
      const res = await axios.post("http://localhost:8080/api/v1/auth/forgot-password", {
        email,
        newPassword,
        answer,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false); // Set loading to false when request is complete
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="form-container">
      <div className="form-overlay"></div>
      <div className="logo-container" onClick={handleLogoClick}>
        <img src={logo} alt="Logo" />
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">Reset Password</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="answer">Unique Code</label>
          <input
            type="text"
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="form-control"
            placeholder="Enter unique code for password reset"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-control"
            placeholder="Enter your new password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Loading..." : "Reset"}
        </button>
        <div style={{ marginTop: "10px" }}>
          Remember your password?{" "}
          <Link
            to="/login"
            style={{ color: "#007bff", fontSize: "18px", fontWeight: "bold" }}
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
