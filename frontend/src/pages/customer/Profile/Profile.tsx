import Card from "../../../components/Card";
import Layout from "../../../components/Layout";
import { Row, Col } from "antd";
import {
  UserOutlined,
  PieChartOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { useEffect } from "react";
import { loadCoverages } from "../../../store/coverage";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { coverages } = useSelector((state: RootState) => state.coverage);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadCoverages());
  }, []);

  const findCoverage = (id: string) => {
    return coverages.find((_coverage: any) => _coverage._id === id);
  };

  return (
    <Layout>
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
              <button className="absolute right-5 -bottom-[18px] btn bg-[#18DDB1]">
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
              <button className="absolute right-5 -bottom-[18px] btn bg-[#18DDB1]">
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
              <p className="text-[24px]">Active Coverages</p>

              {user.coverages.length > 0 && (
                <div className="m-4 border rounded-md p-2">
                  <p className="flex p-2 gap-2 justify-center">
                    <img
                      src={`/images/${
                        findCoverage(user.coverages[0].coverageID)?.weather
                      }.png`}
                      className="w-6 h-6"
                    />
                    {findCoverage(user.coverages[0].coverageID)?.name}{" "}
                    protection
                  </p>
                  <p className="p-2">
                    Subscription Date:{" "}
                    {user.coverages[0].subscription_date.slice(
                      0,
                      user.coverages[0].subscription_date.indexOf("T")
                    )}
                  </p>
                  <p className="p-2">
                    End of Coverage Date:{" "}
                    <span className="text-red-700">
                      {user.coverages[0].expire_date.slice(
                        0,
                        user.coverages[0].expire_date.indexOf("T")
                      )}
                    </span>
                  </p>
                  <p className="p-2">
                    Premium Paid:{" "}
                    <span className="text-red-700">
                      {user.coverages[0].paid_amount}$
                    </span>
                  </p>
                </div>
              )}
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

              <div className="flex justify-center flex-col mt-4">
                {user.transactions.map((transaction: any, index: number) => (
                  <>
                    {index !== 0 && <div className="border w-full my-2" />}
                    <div className="flex justify-between p-2">
                      <p>{transaction.type}</p>
                      <p
                        className={
                          transaction.type === "Premium Paid"
                            ? "text-[#f00]"
                            : "text-[#0f0]"
                        }
                      >
                        {transaction.type === "Premium Paid" ? "-" : "+"} $
                        {transaction.amount}
                      </p>
                    </div>
                    <p className="p-2">{transaction.date}</p>
                  </>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Profile;
