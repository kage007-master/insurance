import React from "react";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import setAuthToken from "../../../utils/setAuthToken";
import { loadUser } from "../../../store/auth";
import { AppDispatch } from "../../../store";
import api from "../../../utils/api";

const { Option } = Select;

const Signup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const onFinish = async (values: any) => {
    try {
      const res = await api.post("/auth/signup", values);
      setTimeout(() => {
        setAuthToken(res.data.token);
        dispatch(loadUser());
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center w-full items-center text-white login-back">
      <img src="/images/logo.png" alt="logo" className="w-32 h-32 absolute left-2 top-2" />
      <Form
        name="normal_login"
        className="login-form p-4 lg:mx-16"
        onFinish={onFinish}
      >
        <p className="text-xl my-4 text-white">Register</p>
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
        <Form.Item
          name="line1"
          rules={[{ required: true, message: "Please input your Address!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Address Line 1"
          />
        </Form.Item>
        <Form.Item name="line2" rules={[{ required: false }]}>
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Address Line 2(optional)"
          />
        </Form.Item>
        <Form.Item
          name="city"
          className="text-left"
          rules={[{ required: true, message: "Please input your City!" }]}
        >
          <Select placeholder="City" allowClear>
            <Option value="Laval">Laval</Option>
            <Option value="Montreal">Montreal</Option>
            <Option value="Longueuil">Longueuil</Option>
          </Select>
        </Form.Item>
        <div className="flex gap-2">
          <Form.Item
            name="latitude"
            rules={[{ required: true, message: "Please input your Latitude!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Latitude"
            />
          </Form.Item>
          <Form.Item
            name="longitude"
            rules={[
              { required: true, message: "Please input your Longitude!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Longitude"
            />
          </Form.Item>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Register
          </Button>
          <div className="flex mt-2 justify-center gap-1 text-white">
            Already have an account?
            <Link to="/login" className="text-[#bbb] underline">
              Login
            </Link>
          </div>
        </Form.Item>
      </Form>
      <img className="login-img" src={"https://media.canva.com/1/image-resize/1/800_535_92_JPG_F/czM6Ly9tZWRpYS1wcml2YXRlLmNhbnZhLmNvbS9hRnh2US9NQUZ6RkRhRnh2US8xL3AuanBn?osig=AAAAAAAAAAAAAAAAAAAAAHdOGLtRnMRRA0EiOjvOjLXs-1JMSwuXgP2HyVC0Nab6&exp=1699220929&x-canva-quality=screen&csig=AAAAAAAAAAAAAAAAAAAAAH99RDALoJdNZf8kKa7U0pV8owvuLXx5okzI2PgjHopr"} />
    </div>
  );
};

export default Signup;
