import Card from "../../../components/Card";
import Layout from "../../../components/Layout";
import { loadCoverages } from "../../../store/coverage";
import { AppDispatch, RootState } from "../../../store";
import { Row, Col } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Coverages: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coverages } = useSelector((state: RootState) => state.coverage);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(loadCoverages());
  }, []);

  return (
    <Layout>
      <Row gutter={[0, 24]} className="mt-5 text-left p-10">
        {coverages.map((coverage: any) => (
          <Col span={24} lg={12} className="p-4" key={coverage.weather}>
            <Card>
              <>
                <img
                  src={`/images/${coverage.weather}.png`}
                  className="absolute -top-6 left-6 w-12 h-12 p-2 bg-[#1f9978] rounded-md"
                />
                <p className="text-[24px] text-right">
                  {coverage.name} protection
                </p>
                <div className="border w-full my-2"></div>
                <p className="p-2">Yearly Premium : {coverage.premium}$</p>
                <p className="p-2">Reimbursement : {coverage.reimbursement}$</p>
                <button className="absolute h-[36px] right-5 -bottom-[18px] border px-4 bg-[#18DDB1] rounded-md">
                  Subscribe
                </button>
              </>
            </Card>
          </Col>
        ))}
      </Row>
    </Layout>
  );
};

export default Coverages;
