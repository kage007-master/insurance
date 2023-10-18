import { HiHome } from "react-icons/hi";
import Card from "../../../components/Card";
import Layout from "../../../components/Layout";
import { Row, Col } from "antd";

const Coverages: React.FC = () => {
  return (
    <Layout>
      <Row gutter={[0, 64]} className="mt-5 text-left p-10">
        <Col span={24} md={12} className="p-4">
          <Card>
            <>
              <img
                src="/images/snow.png"
                className="absolute -top-6 left-6 w-12 h-12 p-2 bg-[#1f9978] rounded-md"
              />
              <p className="text-[24px] text-right">Snow protection</p>
              <div className="border w-full my-2"></div>
              <p className="p-2">Yearly Premium : 300$</p>
              <p className="p-2">Reimbursement : 150$</p>
              <button className="absolute h-[36px] right-5 -bottom-[18px] border px-4 bg-[#18DDB1] rounded-md">
                Subscribe
              </button>
            </>
          </Card>
        </Col>
        <Col span={24} md={12} className="p-4">
          <Card>
            <>
              <img
                src="/images/wind.png"
                className="absolute -top-6 left-6 w-12 h-12 p-2 bg-[#1f9978] rounded-md"
              />
              <p className="text-[24px] text-right">Wind protection</p>
              <div className="border w-full my-2"></div>
              <p className="p-2">Yearly Premium : 300$</p>
              <p className="p-2">Reimbursement : 150$</p>
              <button className="absolute h-[36px] right-5 -bottom-[18px] border px-4 bg-[#18DDB1] rounded-md">
                Subscribe
              </button>
            </>
          </Card>
        </Col>
        <Col span={24} md={12} className="p-4">
          <Card>
            <>
              <img
                src="/images/freeze.png"
                className="absolute -top-6 left-6 w-12 h-12 p-2 bg-[#1f9978] rounded-md"
              />
              <p className="text-[24px] text-right">Freeze protection</p>
              <div className="border w-full my-2"></div>
              <p className="p-2">Yearly Premium : 300$</p>
              <p className="p-2">Reimbursement : 150$</p>
              <button className="absolute h-[36px] right-5 -bottom-[18px] border px-4 bg-[#18DDB1] rounded-md">
                Subscribe
              </button>
            </>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Coverages;
