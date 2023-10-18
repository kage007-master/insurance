import { Col, Modal, Row } from "antd";
import Layout from "../../../components/Layout";
import { useState } from "react";
import Card from "../../../components/Card";

const Coverages: React.FC = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Layout>
      <>
        <Row gutter={[0, 24]} className="mt-5 text-left p-10 relative mx-10">
          <button
            onClick={showModal}
            className="absolute top-0 right-0 float-right h-[36px] border px-4 bg-[#18DDB1] rounded-md"
          >
            Add Coverage
          </button>
          <Col span={24} lg={12} className="p-4">
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
                <p className="p-2">Validation Threshold : 75%</p>
              </>
            </Card>
          </Col>
          <Col span={24} lg={12} className="p-4">
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
                <p className="p-2">Validation Threshold : 75%</p>
              </>
            </Card>
          </Col>
          <Col span={24} lg={12} className="p-4">
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
                <p className="p-2">Validation Threshold : 75%</p>
              </>
            </Card>
          </Col>
        </Row>
        <Modal
          open={open}
          title="Add Coverage"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={(_, { OkBtn, CancelBtn }) => (
            <div className="flex justify-between text-white">
              <button
                onClick={handleOk}
                className="h-[36px] border px-4 bg-[#18DDB1] rounded-md"
              >
                Submit
              </button>
              <button
                onClick={handleCancel}
                className="h-[36px] border px-4 bg-[#dd1f18] rounded-md"
              >
                Cancel
              </button>
            </div>
          )}
        >
          <p>1. Please fill up the following information</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>2. Choose a value for the validation threshold</p>
          <p>Some contents...</p>
        </Modal>
      </>
    </Layout>
  );
};

export default Coverages;
