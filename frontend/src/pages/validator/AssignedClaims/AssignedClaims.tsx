import {
  Button,
  Calendar,
  Col,
  DatePicker,
  Row,
  Space,
  TimePicker,
  Upload,
} from "antd";
import Layout from "../../../components/Layout";
import Card from "../../../components/Card";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { FcViewDetails } from "react-icons/fc";
import { GrSchedule } from "react-icons/gr";
import {
  assignedClaims,
  validateClaims,
  scheduleClaims,
} from "../../../store/claim";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import React, { useEffect, useRef, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { Form, Modal, Radio, Table } from "antd";
import type { CalendarProps } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
import { Filter, capitalizeFLetter } from "../../../utils/string";
import { loadClients } from "../../../store/client";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import moment from "moment";
import classNames from "classnames";

interface DataType {
  key: string;
  weather: string;
  date: string;
  status: string;
  time: string;
}

const AssignedClaims: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [visit, setVisit] = useState(false);
  const [id, setID] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const tableRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCnc0Rurk7QYOEbTcZspUjyzOpl5krNYxw",
  });

  const { assigned } = useSelector((state: RootState) => state.claim);
  const { user } = useSelector((state: RootState) => state.auth);
  const { filter } = useSelector((state: RootState) => state.auth);
  let { clients } = useSelector((state: RootState) => state.client);

  const getWidth = (ref: any) => {
    return ref?.current?.offsetWidth;
  };

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

  const onSchedule = async (values: any) => {
    dispatch(scheduleClaims({ id, ...values }));
    setVisit(false);
  };

  const normFile = (e: any) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

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
      render: (text) => capitalizeFLetter(text),
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
      render: (_, record: any) => (
        <Space>
          <button
            onClick={() => {
              setID(record._id);
              setVisit(true);
            }}
          >
            <GrSchedule className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              setID(record._id);
              showModal();
            }}
          >
            <FiEdit className="text-[#0b0] w-6 h-6" />
          </button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    dispatch(loadClients());
    dispatch(assignedClaims());
  }, []);

  const [selectDate, setSelectDate] = React.useState<Dayjs>(dayjs());
  const onDateChange: CalendarProps<Dayjs>["onSelect"] = (
    value,
    selectInfo
  ) => {
    if (selectInfo.source === "date") {
      setSelectDate(value);
    }
  };
  const cellRender: CalendarProps<Dayjs>["fullCellRender"] = (date, info) => {
    if (info.type === "date") {
      const cnt = assigned.filter(
        (claim: any) =>
          moment(claim.schedule).isSameOrAfter(
            moment(date.startOf("day").toISOString())
          ) &&
          moment(claim.schedule).isSameOrBefore(
            moment(date.endOf("day").toISOString())
          )
      ).length;
      return React.cloneElement(info.originNode, {
        ...info.originNode.props,
        className: classNames("dateCell", {
          current: selectDate.isSame(date, "date"),
          today: date.isSame(dayjs(), "date"),
          scheduled: cnt > 0,
        }),
        children: <div className="text">{date.get("date")}</div>,
      });
    }

    if (info.type === "month") {
      return (
        <div
          className={classNames("monthCell", {
            monthCellCurrent: selectDate.isSame(date, "month"),
          })}
        >
          {date.get("month") + 1}
        </div>
      );
    }
  };

  return (
    <Layout>
      <>
        <Row gutter={[0, 64]} className="mt-5 text-left">
          <Col span={24} lg={12} className="p-4">
            <Card>
              <>
                <CalendarOutlined
                  style={{ fontSize: "48px" }}
                  className="absolute -top-6 right-6 p-2 bg-[#1f9978] rounded-md"
                />
                <p className="text-[24px]">Calender</p>
                <Calendar
                  fullCellRender={cellRender}
                  fullscreen={false}
                  onSelect={onDateChange}
                />
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
                <p className="text-[24px]">Clients Location</p>
                <div className="h-[90%] min-h-[320px]">
                  {clients.length > 0 && isLoaded && (
                    <GoogleMap
                      mapContainerClassName="w-full h-full"
                      center={{
                        lat: user.address?.latitude as number,
                        lng: user.address?.longitude as number,
                      }}
                      zoom={14}
                    >
                      {clients.map((client: any, index: number) => {
                        if (client.address.city !== user.address?.city)
                          return null;
                        return (
                          <Marker
                            key={index}
                            position={{
                              lat: client.address.latitude,
                              lng: client.address.longitude,
                            }}
                            title={client.fullname}
                          />
                        );
                      })}
                    </GoogleMap>
                  )}
                </div>
              </>
            </Card>
          </Col>
        </Row>
        <div className="mt-5">
          <div className="flex items-center text-black gap-2">
            <FcViewDetails className="w-8 h-8" />
            Claim Details
          </div>

          <div ref={tableRef}>
            <Table
              className="mt-4"
              bordered
              columns={columns}
              dataSource={Filter(assigned, filter)}
              scroll={{ x: getWidth(tableRef) }}
            />
          </div>
          {open && (
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
                initialValues={{ confirm: true }}
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
                <Form.Item
                  name="detail"
                  label="2. Please fill out any relevant details below."
                >
                  <TextArea rows={4} />
                </Form.Item>
                {/* <Form.Item
                name="file"
                label="3. Please attach below any relevant document"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload name="logo" action="/upload.do" listType="picture">
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
              </Form.Item> */}
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
          {visit && (
            <Modal
              open={visit}
              title="Schedule an Appointement"
              onOk={onSchedule}
              onCancel={() => {
                setVisit(false);
              }}
              footer={(_) => <></>}
            >
              <Form
                name="damage_assessement"
                className="login-form flex flex-col items-center"
                initialValues={{ confirm: true }}
                onFinish={onSchedule}
              >
                <Form.Item
                  className="mt-5"
                  name="date"
                  label="Pick a date and time:"
                  rules={[
                    {
                      required: true,
                      message: "Please select the date!",
                    },
                  ]}
                >
                  <DatePicker
                    disabledDate={(current) => {
                      let customDate = moment().format("YYYY-MM-DD");
                      return (
                        current && current < moment(customDate, "YYYY-MM-DD")
                      );
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="time"
                  rules={[
                    {
                      required: true,
                      message: "Please select the time!",
                    },
                  ]}
                >
                  <TimePicker
                    format="HH:mm"
                    disabledTime={(now: Dayjs) => {
                      return {
                        disabledHours: () => [
                          0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23,
                        ],
                      };
                    }}
                    minuteStep={15}
                  />
                </Form.Item>
                The client will be notified about the picked date.
                <Form.Item className="w-full mt-5">
                  <div className="w-full flex justify-between text-white">
                    <button
                      type="submit"
                      className="h-[36px] border px-4 bg-[#18DDB1] rounded-md"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVisit(false);
                      }}
                      className="h-[36px] border px-4 bg-[#dd1f18] rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </Form.Item>
              </Form>
            </Modal>
          )}
        </div>
      </>
    </Layout>
  );
};

export default AssignedClaims;
