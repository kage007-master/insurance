import { MdAccountBalance } from "react-icons/md";
import { BiNotepad } from "react-icons/bi";
import Layout from "../../../components/Layout";
import { Row, Col } from "antd";
import React, { useEffect, useRef } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { pastClaims } from "../../../store/claim";
import { loadUser } from "../../../store/auth";
import { capitalizeFLetter } from "../../../utils/string";

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
    render: (text) => capitalizeFLetter(text),
  },
  {
    title: "Date Registered",
    dataIndex: "date",
    key: "date",
    render: (_date: Date) => {
      const date = new Date(_date);
      return (
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      );
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
];

const PastClaims: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { past } = useSelector((state: RootState) => state.claim);
  const tableRef = useRef(null);

  const getWidth = (ref: any) => {
    return ref?.current?.offsetWidth;
  };

  useEffect(() => {
    dispatch(pastClaims());
    dispatch(loadUser());
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
        <div ref={tableRef}>
          <Table
            className="mt-20 px-2 lg:px-10"
            bordered
            columns={columns}
            dataSource={past}
            scroll={{ x: getWidth(tableRef) }}
          />
        </div>
      </>
    </Layout>
  );
};

export default PastClaims;
