import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";
import logo from "../../assests/logo.png"; // Adjust the path as necessary

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const [loading, setLoading] = useState(false); // Add loading state

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    try {
      // http://localhost:8080/api/v1/auth/login
      // https://valo-deal-backend.vercel.app/api/v1/auth/login
      const res = await axios.post("http://localhost:8080/api/v1/auth/login", {
        email,
        password,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });

        // Save user to local storage
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state?.from || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
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
        <h2 className="auth-title">Sign In</h2>
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
        <div style={{ marginTop: "10px" }}>
          <Link
            to="/forgot-password"
            style={{ color: "#eb3902", fontSize: "18px", fontWeight: "bold" }}
          >
            Forgot password ?
          </Link>
        </div>
        <div style={{ marginTop: "10px" }}>
          Haven't an account?{" "}
          <Link
            to="/register"
            style={{ color: "#007bff", fontSize: "18px", fontWeight: "bold" }}
          >
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
