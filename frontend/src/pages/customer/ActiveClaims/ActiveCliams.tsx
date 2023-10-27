import { MdAccountBalance } from "react-icons/md";
import { BiNotepad } from "react-icons/bi";
import Layout from "../../../components/Layout";
import { Row, Col, Popconfirm } from "antd";
import { FcCheckmark, FcCancel } from "react-icons/fc";

import React, { useEffect } from "react";
import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { activeClaims, feedbackClaims } from "../../../store/claim";

interface DataType {
  _id: string;
  key: string;
  weather: string;
  date: string;
  status: string;
  time: string;
}

const ActiveCliams: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { active } = useSelector((state: RootState) => state.claim);

  const onConfirm = (id: string) => {
    dispatch(feedbackClaims({ id, feedback: true }));
  };

  const onDecline = (id: string) => {
    dispatch(feedbackClaims({ id, feedback: false }));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Active Claims in your Area",
      dataIndex: "weather",
      key: "weather",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Date Registered",
      dataIndex: "date",
      key: "date",
      render: (_date: Date) => {
        const date = new Date(_date);
        return (
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate()
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Remaining time",
      key: "time",
      dataIndex: "date",
      render: (_date: Date) => {
        const currentTimestamp = Math.floor(Date.now() / 60000); // Convert to seconds
        const elapsedMinutes =
          1440 -
          currentTimestamp +
          Math.floor(new Date(_date).getTime() / 60000);

        var hours: any = Math.floor(elapsedMinutes / 60);
        var minutes: any = elapsedMinutes % 60;
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        return hours + "h " + minutes + "m";
      },
    },
    {
      title: "Feedback",
      key: "feedback",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Confirm Damage"
            description="Are you sure to confirm this damage?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onConfirm(record._id)}
          >
            <button>
              <FcCheckmark />
            </button>
          </Popconfirm>
          <Popconfirm
            title="Decline Damage"
            description="Are you sure to decline this damage?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDecline(record._id)}
          >
            <button>
              <FcCancel />
            </button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    dispatch(activeClaims());
  }, []);

  return (
    <Layout>
      <>
        <Row justify="space-around" gutter={[16, 16]}>
          <Col span={12} md={8}>
            <div className="flex justify-center">
              <div className="flex flex-col rounded-xl items-center border p-4 w-[180px] bg-[#031C30]">
                <MdAccountBalance className="w-12 h-12" />
                <p className="p-2">Balance</p>
                <div className="border w-full"></div>
                <p className="p-2">+ {user.balance}$</p>
              </div>
            </div>
          </Col>
          <Col span={12} md={8}>
            <div className="flex justify-center">
              <div className="flex flex-col rounded-xl items-center border p-4 w-[180px] bg-[#031C30]">
                <BiNotepad className="w-12 h-12" />
                <p className="p-2">Total claims</p>
                <div className="border w-full"></div>
                <p className="p-2">{user.claims}</p>
              </div>
            </div>
          </Col>
          <Col span={12} md={8}>
            <div className="flex justify-center">
              <div className="flex flex-col rounded-xl items-center  border p-4 w-[180px] bg-[#031C30]">
                <MdAccountBalance className="w-12 h-12" />
                <p className="p-2">Coverages</p>
                <div className="border w-full"></div>
                <p className="p-2">{user.coverages.length}</p>
              </div>
            </div>
          </Col>
        </Row>
        <Table
          className="mt-10 p-10"
          bordered
          columns={columns}
          dataSource={active}
        />
      </>
    </Layout>
  );
};

export default ActiveCliams;
