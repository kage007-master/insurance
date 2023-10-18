import { Col, Row } from "antd";
import Layout from "../../../components/Layout";
import Card from "../../../components/Card";
import { EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";

const AssignedClaims: React.FC = () => {
  return (
    <Layout>
      <>
        <Row gutter={[0, 64]} className="mt-5 text-left">
          <Col span={24} md={12} className="p-4">
            <Card>
              <>
                <CalendarOutlined
                  style={{ fontSize: "48px" }}
                  className="absolute -top-6 right-6 p-2 bg-[#1f9978] rounded-md"
                />
                <p className="text-[24px]">Calender</p>
                <div className="h-[250px]"></div>
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
                <p className="text-[24px]">Clients Location</p>
              </>
            </Card>
          </Col>
        </Row>
      </>
    </Layout>
  );
};

export default AssignedClaims;
