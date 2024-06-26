import React, { useState, useRef, useEffect } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { loadUser } from "../../../store/auth";
import { Link } from "react-router-dom";
import setAuthToken from "../../../utils/setAuthToken";
import { AppDispatch } from "../../../store";
import api from "../../../utils/api";
import Logo from "../../../components/Logo"

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const ref = useRef<HTMLDivElement>(null);
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
    <div className="flex justify-center w-full items-center text-white login-back" ref={ref}>
      <Form
        name="normal_login"
        className="login-form p-4 md:mx-16"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Logo className={""} />
        <p className="text-xl mt-4 text-white">Login</p>
        <p className="my-2 text-white">Sign in to continue</p>
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
          className="w-full"
          rules={[{ required: true, message: "Please input your E-mail!" }]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="E-mail" size="large"
          />
        </Form.Item>
        <Form.Item
          name="password"
          className="w-full"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password" size="large"
          />
        </Form.Item>
        <Form.Item className="w-full">
          <Button htmlType="submit" className="w-full !bg-[#5e17eb] text-white h-[40px]">
            Login
          </Button>
          <div className="flex mt-2 justify-center gap-1 text-white">
            Don't have an account?
            <Link to="/signup" className="text-[#bbb] underline">
              Register
            </Link>
          </div>
        </Form.Item>
      </Form>
      <img className="login-img" src={"/images/back.png"} />
    </div>
  );
};

export default Login;
