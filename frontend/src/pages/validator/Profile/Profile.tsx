import Card from "../../../components/Card";
import Layout from "../../../components/Layout";
import { Row, Col } from "antd";
import {
  UserOutlined,
  PieChartOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

import ReactEcharts from "echarts-for-react";

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
        { value: 1048, name: "Approved" },
        { value: 735, name: "Declined" },
      ],
    },
  ],
};

const option1 = {
  legend: {},
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
  // Declare several bar series, each will be mapped
  // to a column of dataset.source by default.
  series: [{ type: "bar" }, { type: "bar" }],
};

const Profile: React.FC = () => {
  return (
    <Layout>
      <>
        <Row gutter={[0, 64]} className="mt-5 text-left">
          <Col span={24} md={12} className="p-4">
            <Card>
              <>
                <UserOutlined
                  style={{ fontSize: "48px" }}
                  className="absolute -top-6 right-6"
                />
                <p className="text-[24px]">Profile</p>
                <p className="p-2">Username: JohnDoe07</p>
                <p className="p-2">Fullname: John Doe</p>
                <p className="p-2">Email Address: johndoe@email.com</p>
                <button className="absolute h-[40px] right-5 -bottom-[20px] border px-4 bg-[#18DDB1]">
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
                  className="absolute -top-6 right-6"
                />
                <p className="text-[24px]">Localisation</p>
                <p className="p-2">Address Line 1:</p>
                <p className="p-2">Address Line 2:</p>
                <p className="p-2">City:</p>
                <p className="p-2">Lat, Long:</p>
                <button className="absolute h-[40px] right-5 -bottom-[20px] border px-4 bg-[#18DDB1]">
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
                  className="absolute -top-6 right-6"
                />
                <p className="text-[24px]">Statistics</p>
                <p className="p-2">Total number of claims : 120</p>
                <p className="p-2">Approved claims : 70</p>
                <p className="p-2 mb-24">Denied claims : 50</p>
                <ReactEcharts
                  option={option}
                  className="!w-[240px] !h-[240px] !absolute right-0 bottom-0"
                />
              </>
            </Card>
          </Col>
          <Col span={24} md={12} className="p-4">
            <Card>
              <>
                <BarChartOutlined
                  style={{ fontSize: "48px" }}
                  className="absolute -top-6 right-6"
                />
                <ReactEcharts option={option1} />
              </>
            </Card>
          </Col>
        </Row>
      </>
    </Layout>
  );
};

export default Profile;
