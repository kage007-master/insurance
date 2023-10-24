import { Calendar, Col, Row } from "antd";
import Layout from "../../../components/Layout";
import Card from "../../../components/Card";
import { EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import GoogleMapReact from "google-map-react";
import { FcViewDetails } from "react-icons/fc";
import { assignedClaims, validateClaims } from "../../../store/claim";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { Form, Modal, Radio, Table } from "antd";
import type { CalendarProps } from "antd";
import type { Dayjs } from "dayjs";
import type { ColumnsType } from "antd/es/table";

const distanceToMouse = (pt: any, mp: any) => {
  if (pt && mp) {
    // return distance between the marker and mouse pointer
    return Math.sqrt(
      (pt.x - mp.x) * (pt.x - mp.x) + (pt.y - mp.y) * (pt.y - mp.y)
    );
  }
  return 0;
};

interface DataType {
  key: string;
  weather: string;
  date: string;
  status: string;
  time: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Claim ID",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "Claim Type",
    dataIndex: "weather",
    key: "weather",
  },
  {
    title: "Client Name",
    dataIndex: "client_name",
    key: "client_name",
  },
  {
    title: "Client Address",
    dataIndex: "client_address",
    key: "client_address",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <button onClick={() => {}}>
        <FiEdit className="w-6 h-6" />
      </button>
    ),
  },
];

const AssignedClaims: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [id, setID] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { assigned } = useSelector((state: RootState) => state.claim);

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const onFinish = async (values: any) => {
    dispatch(validateClaims({ id, ...values }));
    handleCancel();
  };

  useEffect(() => {
    dispatch(assignedClaims());
  }, []);

  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };

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
                <Calendar fullscreen={false} onPanelChange={onPanelChange} />
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
                <div className="h-[90%]">
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      // remove the key if you want to fork
                      key: "AIzaSyDQDvScLyL7y5kqxR5mxEAPRo5PR5Ej2ZY",
                      language: "en",
                      region: "US",
                    }}
                    defaultCenter={{ lat: 51.506, lng: -0.169 }}
                    defaultZoom={15}
                    distanceToMouse={distanceToMouse}
                  >
                    {/* {points.map(({ lat, lng, id, title }) => {
                    return (
                      <MyMarker
                        key={id}
                        lat={lat}
                        lng={lng}
                        text={id}
                        tooltip={title}
                      />
                    );
                  })} */}
                  </GoogleMapReact>
                </div>
              </>
            </Card>
          </Col>
        </Row>
        <div className="p-10">
          <div className="flex items-center text-black gap-2">
            <FcViewDetails className="w-8 h-8" />
            Claim Details
          </div>
          <Table
            className="mt-4"
            bordered
            columns={columns}
            dataSource={assigned}
          />
          <Modal
            open={open}
            title="Damage Assessement"
            onOk={onFinish}
            onCancel={handleCancel}
            footer={(_) => <></>}
          >
            <Form
              name="damage_assessement"
              layout="vertical"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="confirm"
                label="1. Do you confirm that the client received Damage?"
              >
                <Radio.Group>
                  <Radio value={true}> Yes </Radio>
                  <Radio value={false}> No </Radio>
                </Radio.Group>
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
        </div>
      </>
    </Layout>
  );
};

export default AssignedClaims;
