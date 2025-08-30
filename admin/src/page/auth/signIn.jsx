import React, { useState, useEffect } from "react";
import { Typography, Box, Button } from "@mui/material";
import CustomTextField from "./CustomTextField";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../../../frontend/src/context/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [errMsg, setErrMsg] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
   
    if (auth?.loggedIn) {
      navigate("/users");
    }
  }, [auth, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Input email";
    if (!password) newErrors.password = "Input password";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

      if (email === adminEmail && password === adminPassword) {
        const userData = {
          user: { email },
          token: "hardcoded-token",
          loggedIn: true,
        };
        setAuth(userData);
        localStorage.setItem("auth", JSON.stringify(userData));

        // 🚀 Go directly to Users page
        navigate("/users");
      } else {
        setErrMsg("Invalid email or password");
      }
    }
  };

  return (
    <div className="border rounded-xl p-7 max-w-[420px] mx-auto my-7 border-black flex-col justify-center">
      <div className="items-center flex justify-center">
        <img src={logo} alt="logo" className="w-[30%] h-[50%]" />
      </div>
      <Box
        sx={{
          width: "100%",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <CustomTextField
          label="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          errors={errors}
        />
        <CustomTextField
          label="password"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          errors={errors}
        />
        {errMsg && (
          <Typography variant="caption" color="error">
            {errMsg}
          </Typography>
        )}
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            color: "white",
            bgcolor: "silver",
            borderRadius: "30px",
            height: "50px",
            textTransform: "none",
            fontSize: "20px",
            mb: "50px",
            mt: "20px",
            "&:hover": { color: "white", bgcolor: "black" },
          }}
        >
          Sign in
        </Button>
      </Box>
    </div>
  );
};

export default SignIn;
