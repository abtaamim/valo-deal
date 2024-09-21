import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Autosuggest from "react-autosuggest";
import "../../styles/AuthStyles.css";
import logo from "../../assests/logo11.png";

const bangladeshPlaces = [
  { name: "Dhaka" },
  { name: "Chittagong" },
  { name: "Khulna" },
  { name: "Rajshahi" },
  { name: "Sylhet" },
  { name: "Barisal" },
  { name: "Rangpur" },
  { name: "Comilla" },
  { name: "Narayanganj" },
  { name: "Gazipur,Dhaka" },
  { name: "Mohammadpur, Dhaka" },
  { name: "Dhanmondi, Dhaka" },
  { name: "Gulshan, Dhaka" },
  { name: "Banani, Dhaka" },
  { name: "Uttara, Dhaka" },
  { name: "Mirpur, Dhaka" },
  { name: "Farmgate, Dhaka" },
  { name: "Tejgaon, Dhaka" },
  { name: "Uttarkhan, Dhaka" },
  { name: "Bashundhara, Dhaka" },
  { name: "Motijheel, Dhaka" },
  { name: "Gulistan, Dhaka" },
  { name: "Panthapath, Dhaka" },
  { name: "Khilgaon, Dhaka" },
  { name: "Shyamoli, Dhaka" },
  { name: "Agargaon, Dhaka" },
  { name: "Shahbagh, Dhaka" },
  { name: "Banani DOHS, Dhaka" },
  { name: "Baridhara, Dhaka" },
  { name: "Badda, Dhaka" },
  { name: "Basabo, Dhaka" },
  { name: "Malibagh, Dhaka" },
  { name: "Moghbazar, Dhaka" },
  { name: "New Market, Dhaka" },
  { name: "Pallabi, Dhaka" },
  { name: "Ramna, Dhaka" },
  { name: "Rampura, Dhaka" },
  { name: "Sabujbagh, Dhaka" },
  { name: "Shantinagar, Dhaka" },
  { name: "Sutrapur, Dhaka" },
  { name: "Tongi, Dhaka" },
  { name: "Turag, Dhaka" },
  { name: "Wari, Dhaka" },
];

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://valo-deal-backend.vercel.app/api/v1/auth/register",
        {
          name,
          email,
          password,
          phone,
          address,
          answer,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const validatePhoneNumber = (value) => {
    return /^01\d{9}$/.test(value);
  };

  const fetchSuggestions = ({ value }) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    const filteredSuggestions =
      inputLength === 0
        ? []
        : bangladeshPlaces.filter(
          (place) =>
            place.name.toLowerCase().slice(0, inputLength) === inputValue
        );

    setSuggestions(filteredSuggestions);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    fetchSuggestions({ value });
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

  return (
    <div className="form-container">
      <div className="form-overlay"></div>
      <div className="logo-container" onClick={handleLogoClick}>
        <img src={logo} alt="Logo" />
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">Sign Up</h2>

        <div className="form-row">
          <div className="form-group col-half">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Enter your name"
              required
              autoFocus
            />
          </div>
          <div className="form-group col-half">
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
        </div>

        <div className="form-row">
          <div className="form-group col-half">
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
          <div className="form-group col-half">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-half">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              placeholder="Enter your phone number"
              pattern="[0-9]{11}"
              required
            />
            {!validatePhoneNumber(phone) && (
              <small className="text-danger">
                Please enter a valid 11-digit phone number starting with "01".
              </small>
            )}
          </div>
          <div className="form-group col-half">
            <label htmlFor="address">Address</label>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={{
                id: "address",
                value: address,
                onChange: (e, { newValue }) => setAddress(newValue),
                className: "form-control",
                placeholder: "Enter your address",
                required: true,
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="answer">Secret Code 🔒</label>
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

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Loading..." : "REGISTER"}
        </button>
        <div style={{ marginTop: "10px" }}>
          Already have an account?{" "}
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

export default Register;
