import Layout from "../../../components/Layout";
import { FcViewDetails } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { loadClient, loadClients } from "../../../store/client";

import React, { useEffect, useRef, useState } from "react";
import { Modal, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { AiOutlineHistory } from "react-icons/ai";
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

const columns1: ColumnsType<DataType> = [
  {
    title: "Coverage Name",
    dataIndex: "name",
    key: "name",
    render: (text) => capitalizeFLetter(text),
  },
  {
    title: "Subscription Date",
    dataIndex: "sub_date",
    key: "sub_date",
  },
  {
    title: "Expirency Date",
    dataIndex: "exp_date",
    key: "exp_date",
  },
  {
    title: "Claims Registered",
    dataIndex: "raised_claims",
    key: "raised_claims",
  },
  {
    title: "Total Reimboursement",
    dataIndex: "total",
    key: "total",
  },
];

const Clients: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients, client } = useSelector((state: RootState) => state.client);
  const tableRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    setOpen(false);
  };

  const getWidth = (ref: any) => {
    return ref?.current?.offsetWidth;
  };

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
        <div ref={tableRef}>
          <Table
            className="mt-4"
            bordered
            columns={columns}
            dataSource={clients}
            scroll={{ x: getWidth(tableRef) }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  dispatch(loadClient(record._id));
                  setOpen(true);
                }, // click row
              };
            }}
          />
        </div>
        <Modal
          open={open}
          title="Coverage Details"
          onOk={handleCancel}
          onCancel={handleCancel}
          footer={(_) => <></>}
          width={getWidth(tableRef)}
        >
          <p className="flex gap-2 items-center border px-4 py-1.5 my-2 bg-[#53c4e0] rounded-md w-fit">
            <TiWeatherPartlySunny className="w-6 h-6" /> Active Coverages
          </p>
          <Table
            className="mt-4"
            bordered
            columns={columns1}
            dataSource={client.active}
            scroll={{ x: getWidth(tableRef) }}
          />
          <p className="flex gap-2 items-center border px-4 py-1.5 my-2 bg-[#831616] rounded-md w-fit">
            <AiOutlineHistory className="w-6 h-6" /> Historic Coverages
          </p>
          <Table
            className="mt-4"
            bordered
            columns={columns1}
            dataSource={client.history}
            scroll={{ x: getWidth(tableRef) }}
          />
        </Modal>
      </>
    </Layout>
  );
};

export default Clients;
