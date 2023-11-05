import React, { useState, useRef, useEffect } from "react";
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
      <img src="/images/logo.png" alt="logo" className="w-32 h-32 absolute left-2 top-2" />
      <Form
        name="normal_login"
        className="login-form p-4 lg:mx-16"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
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
          <div className="flex mt-2 justify-center gap-1 text-white">
            Don't have an account?
            <Link to="/signup" className="text-[#bbb] underline">
              Register
            </Link>
          </div>
        </Form.Item>
      </Form>
      <img className="login-img" src={"https://media.canva.com/1/image-resize/1/800_535_92_JPG_F/czM6Ly9tZWRpYS1wcml2YXRlLmNhbnZhLmNvbS9hRnh2US9NQUZ6RkRhRnh2US8xL3AuanBn?osig=AAAAAAAAAAAAAAAAAAAAAHdOGLtRnMRRA0EiOjvOjLXs-1JMSwuXgP2HyVC0Nab6&exp=1699220929&x-canva-quality=screen&csig=AAAAAAAAAAAAAAAAAAAAAH99RDALoJdNZf8kKa7U0pV8owvuLXx5okzI2PgjHopr"} />
    </div>
  );
};

export default Login;
