import React, { useState } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { loadUser } from "../../../store/auth";
import { Link } from "react-router-dom";
import setAuthToken from "../../../utils/setAuthToken";
import { AppDispatch } from "../../../store";
import api from "../../../utils/api";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState(false);

  const onFinish = async (values: any) => {
    try {
      const res = await api.post("/auth/login", values);
      setAuthToken(res.data.token);
      dispatch(loadUser());
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="flex justify-center w-full items-center">
      <Form
        name="normal_login"
        className="login-form p-4 border rounded-md"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <p className="text-xl my-4">Login</p>
        {error && (
          <Alert
            className="my-2"
            message="Invalid Credentials"
            type="error"
            showIcon
          />
        )}
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your E-mail!" }]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="E-mail"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Login
          </Button>
          <div className="flex mt-2 justify-center gap-1">
            Don't have an account?
            <Link to="/signup" className="text-[#00f]">
              Register
            </Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
