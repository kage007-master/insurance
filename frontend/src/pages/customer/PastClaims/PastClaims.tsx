import { MdAccountBalance } from "react-icons/md";
import { BiNotepad } from "react-icons/bi";
import Layout from "../../../components/Layout";
import { Row, Col } from "antd";
import React from "react";
import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  key: string;
  weather: string;
  date: string;
  status: string;
  time: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Past Claims",
    dataIndex: "weather",
    key: "weather",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Date Registered",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
];

const data: DataType[] = [
  {
    key: "1",
    weather: "Snow",
    date: "19 Oct 2023",
    status: "Pending",
    time: "23h 32min",
  },
  {
    key: "2",
    weather: "Snow",
    date: "19 Oct 2023",
    status: "Pending",
    time: "06h 04min",
  },
  {
    key: "3",
    weather: "Snow",
    date: "19 Oct 2023",
    status: "Pending",
    time: "06h 04min",
  },
];
const PastClaims: React.FC = () => {
  return (
    <Layout>
      <>
        <Row justify="space-around" gutter={[16, 16]}>
          <Col span={24} md={8}>
            <div className="flex justify-center">
              <div className="flex flex-col rounded-xl items-center border p-4 w-[180px] bg-[#031C30]">
                <MdAccountBalance className="w-12 h-12" />
                <p className="p-2">Balance</p>
                <div className="border w-full"></div>
                <p className="p-2">+2000$</p>
              </div>
            </div>
          </Col>
          <Col span={24} md={8}>
            <div className="flex justify-center">
              <div className="flex flex-col rounded-xl items-center border p-4 w-[180px] bg-[#031C30]">
                <BiNotepad className="w-12 h-12" />
                <p className="p-2">Total claims</p>
                <div className="border w-full"></div>
                <p className="p-2">3</p>
              </div>
            </div>
          </Col>
          <Col span={24} md={8}>
            <div className="flex justify-center">
              <div className="flex flex-col rounded-xl items-center  border p-4 w-[180px] bg-[#031C30]">
                <MdAccountBalance className="w-12 h-12" />
                <p className="p-2">Coverages</p>
                <div className="border w-full"></div>
                <p className="p-2">2</p>
              </div>
            </div>
          </Col>
        </Row>
        <Table
          className="mt-10 p-10"
          bordered
          columns={columns}
          dataSource={data}
        />
      </>
    </Layout>
  );
};

export default PastClaims;
