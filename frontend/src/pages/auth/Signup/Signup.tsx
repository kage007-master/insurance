import React from "react";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import setAuthToken from "../../../utils/setAuthToken";

const Signup: React.FC = () => {
  const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    const res = await axios.post(
      "http://localhost:8000/api/auth/signup",
      values
    );
    setAuthToken(res.data.token);
  };

  return (
    <div className="flex justify-center w-full items-center">
      <Form
        name="normal_login"
        className="login-form p-4 border rounded-md"
        onFinish={onFinish}
      >
        <p className="text-xl my-4">Register</p>
        <Form.Item
          name="fullname"
          rules={[{ required: true, message: "Please input your Fulll Name!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Full Name"
          />
        </Form.Item>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            { required: true, message: "Please input your E-mail!" },
          ]}
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
        <Form.Item
          name="password2"
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Item>
        <Form.Item>
          <button
            type="submit"
            className="bg-[#575DFB] text-white  login-form-button border rounded-md py-2"
          >
            Register
          </button>
          <div className="flex mt-2 justify-center gap-1">
            Already have an account?
            <Link to="/login" className="text-[#00f]">
              Login
            </Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;
