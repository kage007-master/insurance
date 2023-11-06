import Layout from "../../../components/Layout";
import { useEffect, useRef, useState } from "react";
import { Form, Input, Modal, Select, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { loadValidators } from "../../../store/client";
import { FiEdit } from "react-icons/fi";
import { FcViewDetails } from "react-icons/fc";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import api from "../../../utils/api";
import { Filter } from "../../../utils/string";

const { Option } = Select;

interface DataType {
  key: string;
  weather: string;
  date: string;
  status: string;
  time: string;
}

const Validators: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { validators } = useSelector((state: RootState) => state.client);
  const { filter } = useSelector((state: RootState) => state.auth);
  const tableRef = useRef(null);
  const [init, setInit] = useState<any>({ active: true });
  const [isEdit, setIsEdit] = useState(false);

  const getWidth = (ref: any) => {
    return ref?.current?.offsetWidth;
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setInit({ active: true });
    setIsEdit(false);
    setOpen(false);
  };

  useEffect(() => {
    dispatch(loadValidators());
  }, []);

  const onFinish = async (values: any) => {
    try {
      if (isEdit) await api.put("/auth/validator", values);
      else await api.post("/auth/validator", values);
      handleCancel();
    } catch (err) {
      console.log(err);
    }
  };

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
      title: "Approved Claims",
      dataIndex: "approved",
      key: "approved",
    },
    {
      title: "Declined Claims",
      dataIndex: "declined",
      key: "declined",
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
      render: (_, record: any) => (
        <button
          onClick={() => {
            setInit({
              fullname: record.fullname,
              username: record.username,
              email: record.email,
              line1: record.address.line1,
              line2: record.address.line2,
              city: record.address.city,
              latitude: record.address.latitude,
              longitude: record.address.longitude,
              active: record.active,
              signature: record.signature,
            });
            setIsEdit(true);
            showModal();
          }}
        >
          <FiEdit className="w-6 h-6" />
        </button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="relative">
        <div className="flex justify-between flex-row-reverse flex-wrap-reverse">
          <button
            onClick={showModal}
            className="px-4 py-1.5 border bg-[#18DDB1] rounded-md"
          >
            Add Validator
          </button>
          <div className="flex items-center text-black gap-2 mr-auto">
            <FcViewDetails className="w-8 h-8" />
            Validators Details
          </div>
        </div>
        <div ref={tableRef}>
          <Table
            className="mt-4"
            bordered
            columns={columns}
            dataSource={Filter(validators, filter)}
            scroll={{ x: getWidth(tableRef) }}
          />
        </div>
        {open && (
          <Modal
            open={open}
            title={`${isEdit ? "Edit" : "Add"} Validator`}
            onOk={onFinish}
            onCancel={handleCancel}
            footer={(_) => <></>}
          >
            <Form
              name="add_validator"
              className="login-form"
              initialValues={init}
              onFinish={onFinish}
            >
              <p className="mb-4">
                1. Please fill up the following information
              </p>
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
                  disabled={isEdit}
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
                <Select placeholder="City" allowClear>
                  <Option value="Laval">Laval</Option>
                  <Option value="Montreal">Montreal</Option>
                  <Option value="Longueuil">Longueuil</Option>
                </Select>
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
                  rules={[
                    { required: true, message: "Signature is required!" },
                  ]}
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
        )}
      </div>
    </Layout>
  );
};

export default Validators;
