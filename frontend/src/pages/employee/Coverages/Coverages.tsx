import { Col, Form, Input, Modal, Row, Select } from "antd";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import Card from "../../../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { addCoverage, loadCoverages } from "../../../store/coverage";
import { AppDispatch, RootState } from "../../../store";

const { Option } = Select;

const Coverages: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { coverages } = useSelector((state: RootState) => state.coverage);
  const { filter } = useSelector((state: RootState) => state.auth);

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const onFinish = async (values: any) => {
    dispatch(addCoverage(values));
    handleCancel();
  };

  useEffect(() => {
    dispatch(loadCoverages());
  }, []);

  return (
    <Layout>
      <>
        <Row gutter={[0, 24]} className="text-left p-10 relative">
          <button
            onClick={showModal}
            className="absolute top-0 right-0 float-right h-[36px] border px-4 bg-[#18DDB1] rounded-md"
          >
            Add Coverage
          </button>
          {coverages
            .filter((coverage: any) => coverage.weather.includes(filter))
            .map((coverage: any) => (
              <Col span={24} lg={12} className="p-4" key={coverage.weather}>
                <Card>
                  <>
                    <img
                      src={`/images/${coverage.weather}.png`}
                      className="absolute -top-6 left-6 w-12 h-12 p-2 bg-[#1f9978] rounded-md"
                      alt={coverage.weather}
                    />
                    <p className="text-[24px] text-right">
                      {coverage.name} protection
                    </p>
                    <div className="border w-full my-2"></div>
                    <p className="p-2">Yearly Premium : {coverage.premium}$</p>
                    <p className="p-2">
                      Reimbursement : {coverage.reimbursement}$
                    </p>
                    <p className="p-2">
                      Validation Threshold : {coverage.threshold}%
                    </p>
                  </>
                </Card>
              </Col>
            ))}
        </Row>
        {open && (
          <Modal
            open={open}
            title="Add Coverage"
            onOk={onFinish}
            onCancel={handleCancel}
            footer={(_) => <></>}
          >
            <Form
              name="add_coverage"
              layout="vertical"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <p className="mb-4">
                1. Please fill up the following information
              </p>
              <Form.Item
                name="name"
                label="Protection Name:"
                required
                rules={[
                  { required: true, message: "Protection Name is required!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="weather"
                label="Weather Event:"
                required
                rules={[
                  { required: true, message: "Protection Name is required!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="premium"
                label="Yearly Premium:"
                required
                rules={[
                  { required: true, message: "Protection Name is required!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="reimbursement"
                label="Reimbursement:"
                required
                rules={[
                  { required: true, message: "Protection Name is required!" },
                ]}
              >
                <Input />
              </Form.Item>
              <p className="mb-4">
                2. Choose a value for the validation threshold
              </p>
              <Form.Item
                name="threshold"
                required
                rules={[
                  {
                    required: true,
                    message: "Validation Threshold is required!",
                  },
                ]}
              >
                <Select placeholder="Validation Threshold: 60-90%" allowClear>
                  <Option value="60">60</Option>
                  <Option value="65">65</Option>
                  <Option value="70">70</Option>
                  <Option value="75">75</Option>
                  <Option value="80">80</Option>
                  <Option value="85">85</Option>
                  <Option value="90">90</Option>
                </Select>
              </Form.Item>
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

export default Coverages;
