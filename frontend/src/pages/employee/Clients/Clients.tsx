import Layout from "../../../components/Layout";
import { FcViewDetails } from "react-icons/fc";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { loadClients } from "../../../store/client";

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
    title: "Client ID",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "Client Name",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Client Address",
    dataIndex: "username",
    key: "username",
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
    render: (coverages) => coverages.length,
  },
  {
    title: "Client Address",
    dataIndex: "claims",
    key: "claims",
    render: (claims) => claims.length,
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
      <div className="p-10">
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
      </div>
    </Layout>
  );
};

export default Clients;
