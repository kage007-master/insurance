import Layout from "../../../components/Layout";
import { FcViewDetails } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { loadClients } from "../../../store/client";

import React, { useEffect } from "react";
import { Table } from "antd";
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
    title: "Client ID",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "Client Name",
    dataIndex: "fullname",
    key: "fullname",
  },
  {
    title: "Client Address",
    dataIndex: "address",
    key: "address",
    render: (address) => address?.line1,
  },
  {
    title: "Balance",
    dataIndex: "balance",
    key: "balance",
    render: (balance) => "$" + balance,
  },
  {
    title: "Coverages",
    dataIndex: "coverages",
    key: "coverages",
  },
  {
    title: "Raised Claims",
    dataIndex: "raised_claims",
    key: "raised_claims",
  },
];

const Clients: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients } = useSelector((state: RootState) => state.client);

  useEffect(() => {
    dispatch(loadClients());
  }, []);

  return (
    <Layout>
      <>
        <div className="flex items-center text-black gap-2">
          <FcViewDetails className="w-8 h-8" />
          Client Details
        </div>
        <Table
          className="mt-4"
          bordered
          columns={columns}
          dataSource={clients}
        />
      </>
    </Layout>
  );
};

export default Clients;
