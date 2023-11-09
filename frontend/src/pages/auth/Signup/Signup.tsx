import React from "react";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import setAuthToken from "../../../utils/setAuthToken";
import { loadUser } from "../../../store/auth";
import { AppDispatch } from "../../../store";
import api from "../../../utils/api";
import Logo from "../../../components/Logo"

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
      <Form
        name="normal_login"
        className="login-form pt-16 p-4 md:mx-16 h-full overflow-auto"
        onFinish={onFinish}
      >
        <Logo className={""} />
        <p className="text-xl my-4 text-white">Register</p>
        <Form.Item
          name="fullname" className="w-full"
          rules={[{ required: true, message: "Please input your Full Name!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Full Name" size="large"
          />
        </Form.Item>
        <Form.Item
          name="username" className="w-full"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username" size="large"
          />
        </Form.Item>
        <Form.Item
          name="email" className="w-full"
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
            placeholder="E-mail" size="large"
          />
        </Form.Item>
        <Form.Item
          name="password" className="w-full"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password" size="large"
          />
        </Form.Item>
        <Form.Item
          name="password2" className="w-full"
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
            placeholder="Confirm Password" size="large"
          />
        </Form.Item>
        <Form.Item
          name="line1"
          className="w-full"
          rules={[{ required: true, message: "Please input your Address!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Address Line 1" size="large"
          />
        </Form.Item>
        <Form.Item name="line2" className="w-full" rules={[{ required: false }]}>
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Address Line 2(optional)" size="large"
          />
        </Form.Item>
        <Form.Item
          name="city"
          className="text-left w-full"
          rules={[{ required: true, message: "Please input your City!" }]}
        >
          <Select placeholder="City" allowClear size="large">
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
              placeholder="Latitude" size="large"
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
              placeholder="Longitude" size="large"
            />
          </Form.Item>
        </div>

        <Form.Item className="w-full">
          <Button htmlType="submit" className="w-full !bg-[#5e17eb] text-white h-[40px]">
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
      <img className="login-img" src={"/images/back.png"} />
    </div>
  );
};

export default Signup;
