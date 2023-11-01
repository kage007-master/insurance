import Card from "../../../components/Card";
import Layout from "../../../components/Layout";
import { Row, Col, Form, Modal, Input } from "antd";
import {
  UserOutlined,
  PieChartOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";

import ReactEcharts from "echarts-for-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { useEffect, useState } from "react";
import { assessedClaims } from "../../../store/claim";
import moment from "moment";
import api from "../../../utils/api";
import { loadUser } from "../../../store/auth";
import {
  APPROVED_BY_VALIDATOR,
  DECLINED_BY_VALIDATOR,
} from "../../../config/const";

const option = {
  tooltip: {
    trigger: "item",
  },
  series: [
    {
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: false,
        position: "center",
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 0, name: "Approved" },
        { value: 0, name: "Declined" },
      ],
    },
  ],
};

const option1 = {
  legend: [
    {
      textStyle: {
        color: "#fff",
      },
    },
  ],
  tooltip: {},
  dataset: {
    source: [
      ["product", "Approved", "Declined"],
      ["Jul", 43.3, 85.8],
      ["Aug", 83.1, 73.4],
      ["Sep", 86.4, 65.2],
    ],
  },
  xAxis: { type: "category" },
  yAxis: {},
  series: [{ type: "bar" }, { type: "bar" }],
};

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { assessed } = useSelector((state: RootState) => state.claim);
  const { user } = useSelector((state: RootState) => state.auth);
  const [init, setInit] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [data1, setData1] = useState({});

  useEffect(() => {
    dispatch(assessedClaims());
  }, []);

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

  useEffect(() => {
    option.series[0].data[0].value = assessed.filter(
      (claim: any) => claim.status === APPROVED_BY_VALIDATOR
    ).length;
    option.series[0].data[1].value = assessed.filter(
      (claim: any) => claim.status === DECLINED_BY_VALIDATOR
    ).length;
    const start = moment().startOf("month").subtract(2, "months");
    const data: any[][] = [["product", "Approved", "Declined"], [], [], []];
    for (let i = 0; i < 3; i++) {
      data[i + 1].push(start.format("MMM"));
      const end = moment(start);
      data[i + 1].push(
        assessed.filter(
          (claim: any) =>
            claim.status === APPROVED_BY_VALIDATOR &&
            moment(claim.date).isSameOrAfter(start) &&
            moment(claim.date).isSameOrBefore(end.endOf("month"))
        ).length
      );
      data[i + 1].push(
        assessed.filter(
          (claim: any) =>
            claim.status === DECLINED_BY_VALIDATOR &&
            moment(claim.date).isSameOrAfter(start) &&
            moment(claim.date).isSameOrBefore(end.endOf("month"))
        ).length
      );
      start.add(1, "months");
    }
    option1.dataset.source = data;
    setData({ ...option });
    setData1({ ...option1 });
  }, [assessed]);

  return (
    <Layout>
      <>
        <Row gutter={[0, 64]} className="mt-5 text-left">
          <Col span={24} xl={12} className="p-4">
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
          <Col span={24} xl={12} className="p-4">
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
          <Col span={24} lg={12} className="p-4">
            <Card>
              <>
                <PieChartOutlined
                  style={{ fontSize: "48px" }}
                  className="absolute -top-6 right-6 p-2 bg-[#1f9978] rounded-md"
                />
                <p className="text-[24px]">Statistics</p>
                <div className="mt-5 mb-20">
                  {" "}
                  <p className="p-2">
                    Total number of claims : {assessed.length}
                  </p>
                  <p className="p-2">
                    Approved claims :{" "}
                    {
                      assessed.filter(
                        (claim: any) => claim.status === APPROVED_BY_VALIDATOR
                      ).length
                    }
                  </p>
                  <p className="p-2">
                    Denied claims :{" "}
                    {
                      assessed.filter(
                        (claim: any) => claim.status === DECLINED_BY_VALIDATOR
                      ).length
                    }
                  </p>
                </div>
                <ReactEcharts
                  option={data}
                  className="!w-[240px] !h-[240px] !absolute right-0 bottom-0"
                />
              </>
            </Card>
          </Col>
          <Col span={24} lg={12} className="p-4">
            <Card>
              <>
                <BarChartOutlined
                  style={{ fontSize: "48px" }}
                  className="absolute -top-6 right-6 p-2 bg-[#1f9978] rounded-md"
                />
                <p className="text-[24px]">Last 3 months</p>
                <div className="w-full flex justify-center">
                  <ReactEcharts
                    option={data1}
                    className="mt-4 w-[420px] !h-[250px]"
                  />
                </div>
              </>
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
