import Card from "../../../components/Card";
import Layout from "../../../components/Layout";
import { Row, Col } from "antd";
import {
  UserOutlined,
  PieChartOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Layout>
      <Row gutter={[0, 64]} className="mt-5 text-left p-10">
        <Col span={24} md={12} className="p-4">
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
              <button className="absolute h-[36px] right-5 -bottom-[18px] border px-4 bg-[#18DDB1] rounded-md">
                Edit
              </button>
            </>
          </Card>
        </Col>
        <Col span={24} md={12} className="p-4">
          <Card>
            <>
              <EnvironmentOutlined
                style={{ fontSize: "48px" }}
                className="absolute -top-6 right-6 p-2 bg-[#1f9978] rounded-md"
              />
              <p className="text-[24px]">Localisation</p>
              <p className="p-2">Address Line 1:</p>
              <p className="p-2">Address Line 2:</p>
              <p className="p-2">City:</p>
              <p className="p-2">Lat, Long:</p>
              <button className="absolute h-[36px] right-5 -bottom-[18px] border px-4 bg-[#18DDB1] rounded-md">
                Edit
              </button>
            </>
          </Card>
        </Col>
        <Col span={24} md={12} className="p-4">
          <Card>
            <>
              <PieChartOutlined
                style={{ fontSize: "48px" }}
                className="absolute -top-6 right-6 p-2 bg-[#1f9978] rounded-md"
              />
              <p className="text-[24px]">Active Coverages</p>
              <div className="m-4 border rounded-md p-2">
                <p className="flex p-2 gap-2 justify-center">
                  <img src="/images/freeze.png" className="w-6 h-6" />
                  Freeze protection
                </p>
                <p className="p-2">Subscription Date: 2023-08-19</p>
                <p className="p-2">End of Coverage Date: 2024-08-18</p>
                <p className="p-2">Premium Paid: 400$</p>
              </div>
              <button className="absolute h-[36px] right-5 -bottom-[18px] border px-4 bg-[#18DDB1] rounded-md">
                Add Coverages
              </button>
            </>
          </Card>
        </Col>
        <Col span={24} md={12} className="p-4">
          <Card>
            <>
              <BarChartOutlined
                style={{ fontSize: "48px" }}
                className="absolute -top-6 right-6 p-2 bg-[#1f9978] rounded-md"
              />
              <p className="text-[24px]">Transactions</p>
              <div className="flex justify-center flex-col mt-4">
                <div className="flex justify-between p-2">
                  <p>Reimbursement Issued</p>
                  <p className="text-[#0f0]">+ $250</p>
                </div>
                <p className="p-2">2023-08-24 at 13:45 PM</p>
                <div className="border w-full my-2"></div>
                <div className="flex justify-between p-2">
                  <p>Reimbursement Issued</p>
                  <p className="text-[#f00]">- $250</p>
                </div>
                <p className="p-2">2023-08-24 at 13:45 PM</p>
              </div>
            </>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Profile;
