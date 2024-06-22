import React from "react";
import { Card, Form, Input, Typography, Button, Alert, Spin } from "antd";
import { Link } from "react-router-dom";
import registerImage from "../assets/loginpage.webp";
import userLogin from "../hooks/userLogin";

const Login = () => {
  const { error, loading, loginUser } = userLogin();

  const handleLogin = async (values) => {
    await loginUser(values);
  };

  return (
    <Card
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {/* Image */}
        {/* <div style={{ flex: 1 }}>
          <img src={registerImage} className="auth-image" alt="Register" />
        </div> */}

        {/* Form */}
        <div style={{ width:'400px' }}>
          <Typography.Title level={3} strong className="title">
            Sign In
          </Typography.Title>
          <Typography.Text type="secondary" strong className="slogan">
            Welcome!
          </Typography.Text>

          <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "The input is not a valid email!",
                },
              ]}
            >
              <Input size="large" placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password size="large" placeholder="Enter your password" />
            </Form.Item>

            {error && (
              <Alert
                description={error}
                type="error"
                showIcon
                closable
                className="alert"
              />
            )}

            <Form.Item>
              <Button
                type={`${loading ? "" : "primary"}`}
                htmlType="submit"
                size="large"
                className="btn"
              >
                {loading ? <Spin /> : "Sign In"}
              </Button>
            </Form.Item>

            <Form.Item>
              <Link to="/signup">
                <Button size="large" className="btn">
                  Create an account
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Card>
  );
};

export default Login;
