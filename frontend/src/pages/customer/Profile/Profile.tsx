import Card from "../../../components/Card";
import Layout from "../../../components/Layout";
import { Row, Col, Modal, Form, Input, Select, Collapse } from "antd";
import {
  UserOutlined,
  PieChartOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
  MailOutlined,
  LockOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { useEffect, useState } from "react";
import { loadCoverages } from "../../../store/coverage";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { loadUser } from "../../../store/auth";
import moment from "moment";

const Profile: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { coverages } = useSelector((state: RootState) => state.coverage);
  const [init, setInit] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadCoverages());
  }, []);

  const findCoverage = (id: string) => {
    return coverages.find((_coverage: any) => _coverage._id === id);
  };

  const showModal = () => {
    setInit({
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      line1: user.address?.line1,
      line2: user.address?.line2,
      city: user.address?.city,
      latitude: user.address?.latitude,
      longitude: user.address?.longitude,
    });
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onFinish = async (values: any) => {
    try {
      await api.put("/auth/profile", values);
      dispatch(loadUser());
      handleCancel();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <>
        <Row gutter={[0, 64]} className="text-left p-2">
          <Col span={24} lg={12} className="p-4">
            <Card>
              <>
                <UserOutlined
                  style={{ fontSize: "48px" }}
                  className="absolute -top-6 right-6 p-2 bg-[#1f9978] rounded-md"
                />
                <p className="text-[24px]">Profile</p>
                <div className="mt-5">
                  <p className="p-2">Username: {user.username}</p>
                  <p className="p-2">Fullname: {user.fullname}</p>
                  <p className="p-2">Email Address: {user.email}</p>
                </div>
                <button
                  className="absolute right-5 -bottom-[18px] btn bg-[#18DDB1]"
                  onClick={showModal}
                >
                  Edit
                </button>
              </>
            </Card>
          </Col>
          <Col span={24} lg={12} className="p-4">
            <Card>
              <>
                <EnvironmentOutlined
                  style={{ fontSize: "48px" }}
                  className="absolute -top-6 right-6 p-2 bg-[#1f9978] rounded-md"
                />
                <p className="text-[24px]">Localisation</p>
                <p className="p-2">Address Line 1: {user.address?.line1}</p>
                <p className="p-2">Address Line 2: {user.address?.line2}</p>
                <p className="p-2">City: {user.address?.city}</p>
                <p className="p-2">
                  Lat, Long: {user.address?.latitude}, {user.address?.longitude}
                </p>
                <button
                  className="absolute right-5 -bottom-[18px] btn bg-[#18DDB1]"
                  onClick={showModal}
                >
                  Edit
                </button>
              </>
            </Card>
          </Col>
          <Col span={24} lg={12} className="p-4 text-white">
            <Card>
              <>
                <PieChartOutlined
                  style={{ fontSize: "48px" }}
                  className="absolute -top-6 right-6 p-2 bg-[#1f9978] rounded-md"
                />
                <p className="text-[24px]">Active Coverages</p>
                <Collapse
                  className="m-2"
                  defaultActiveKey={0}
                  expandIconPosition="end"
                  expandIcon={({ isActive }) => (
                    <div className="text-white">
                      {isActive ? (
                        <MinusOutlined className="text-white" />
                      ) : (
                        <PlusOutlined className="text-white" />
                      )}
                    </div>
                  )}
                  items={user.coverages.map((coverage: any, index: number) => {
                    return {
                      key: index,
                      label: (
                        <>
                          <p className="flex gap-2 text-white">
                            <img
                              src={`/images/${
                                findCoverage(coverage.coverageID)?.weather
                              }.png`}
                              className="w-6 h-6"
                              alt="active coverage"
                            />
                            {findCoverage(coverage.coverageID)?.name} protection
                          </p>
                        </>
                      ),
                      children: (
                        <div className="-m-4 bg-[#bacc66] p-2">
                          <p className="p-2">
                            End of Coverage Date:{" "}
                            <span className="text-red-700">
                              {coverage.expire_date.slice(
                                0,
                                coverage.expire_date.indexOf("T")
                              )}
                            </span>
                          </p>
                          <p className="p-2">
                            Premium Paid:{" "}
                            <span className="text-red-700">
                              {coverage.paid_amount}$
                            </span>
                          </p>
                        </div>
                      ),
                      extra: (
                        <p className="text-white bg-[#23b] px-2 py-1 rounded-md">
                          Subscription Date:{" "}
                          {user.coverages[0].subscription_date.slice(
                            0,
                            user.coverages[0].subscription_date.indexOf("T")
                          )}
                        </p>
                      ),
                    };
                  })}
                />
                <button
                  className="absolute right-5 -bottom-[18px] btn bg-[#18DDB1]"
                  onClick={() => navigate("/customer/coverages")}
                >
                  Add Coverages
                </button>
              </>
            </Card>
          </Col>
          <Col span={24} lg={12} className="p-4">
            <Card>
              <div className="min-h-[250px]">
                <BarChartOutlined
                  style={{ fontSize: "48px" }}
                  className="absolute -top-6 right-6 p-2 bg-[#1f9978] rounded-md"
                />
                <p className="text-[24px]">Transactions</p>
                <div className="mt-4 h-[250px] overflow-auto">
                  {user.transactions.map((transaction: any, index: number) => (
                    <>
                      {index !== 0 && <div className="border w-full my-2" />}
                      <div className="flex justify-between p-2">
                        <p>
                          {transaction.amount > 0
                            ? "Premium Paid"
                            : "Reimbursement Issued"}
                        </p>
                        <p
                          className={
                            transaction.amount > 0
                              ? "text-[#f00]"
                              : "text-[#0f0]"
                          }
                        >
                          {transaction.amount > 0 ? "-" : "+"} $
                          {Math.abs(transaction.amount)}
                        </p>
                      </div>
                      <p className="p-2">
                        {moment(transaction.date).format("llll")}
                      </p>
                    </>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        {open && (
          <Modal
            open={open}
            title={`Update User Profile`}
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
                  disabled
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
      </>
    </Layout>
  );
};

export default Profile;
