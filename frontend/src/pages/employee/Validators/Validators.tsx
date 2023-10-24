import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import { Form, Input, Modal, Select, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { loadValidators } from "../../../store/client";
import { FiEdit } from "react-icons/fi";
import { FcViewDetails } from "react-icons/fc";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import api from "../../../utils/api";

const { Option } = Select;

interface DataType {
  key: string;
  weather: string;
  date: string;
  status: string;
  time: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Validator ID",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "Validator Name",
    dataIndex: "fullname",
    key: "fullname",
  },
  {
    title: "Validator Address",
    dataIndex: "address",
    key: "address",
    render: (address) => address?.line1,
  },
  {
    title: "Assessed Claims",
    dataIndex: "claims",
    key: "claims",
  },
  {
    title: "Active",
    dataIndex: "active",
    key: "active",
    render: (active: boolean) => (active ? "Yes" : "No"),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <button onClick={() => {}}>
        <FiEdit className="w-6 h-6" />
      </button>
    ),
  },
];

const Validators: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { validators } = useSelector((state: RootState) => state.client);

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(loadValidators());
  }, []);

  const onFinish = async (values: any) => {
    try {
      const res = await api.post("/auth/validator", values);
      handleCancel();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="relative">
        <div className="flex items-center text-black gap-2">
          <FcViewDetails className="w-8 h-8" />
          Validators Details
        </div>
        <button
          onClick={showModal}
          className="absolute top-0 right-0 float-right h-[36px] border px-4 bg-[#18DDB1] rounded-md"
        >
          Add Validator
        </button>
        <Table
          className="mt-4"
          bordered
          columns={columns}
          dataSource={validators}
        />
        <Modal
          open={open}
          title="Add Validator"
          onOk={onFinish}
          onCancel={handleCancel}
          footer={(_) => <></>}
        >
          <Form
            name="add_validator"
            className="login-form"
            initialValues={{ active: true }}
            onFinish={onFinish}
          >
            <p className="mb-4">1. Please fill up the following information</p>
            <Form.Item
              name="fullname"
              rules={[
                { required: true, message: "Please input your Fulll Name!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Full Name"
              />
            </Form.Item>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
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
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
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
                      new Error(
                        "The new password that you entered do not match!"
                      )
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
              rules={[
                { required: true, message: "Please input your Address!" },
              ]}
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
              rules={[{ required: true, message: "Please input your City!" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="City"
              />
            </Form.Item>
            <div className="flex gap-2 justify-between w-full">
              <Form.Item
                name="latitude"
                rules={[
                  { required: true, message: "Please input your Latitude!" },
                ]}
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
            <Form.Item
              name="operation"
              required
              rules={[
                {
                  required: true,
                  message: "City of operation is required!",
                },
              ]}
            >
              <Select placeholder="City of Operation" allowClear>
                <Option value="Laval">Laval</Option>
                <Option value="Montreal">Montreal</Option>
                <Option value="Longueuil">Longueuil</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="active"
              label="2. Toggle Active State"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <div className="flex justify-center">
              <Form.Item
                name="signature"
                label="Validator's Signature:"
                className="w-[80%]"
                rules={[{ required: true, message: "Signature is required!" }]}
              >
                <Input />
              </Form.Item>
            </div>

            <Form.Item>
              <div className="flex justify-between text-white">
                <button
                  type="submit"
                  className="h-[36px] border px-4 bg-[#18DDB1] rounded-md"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="h-[36px] border px-4 bg-[#dd1f18] rounded-md"
                >
                  Cancel
                </button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Validators;
