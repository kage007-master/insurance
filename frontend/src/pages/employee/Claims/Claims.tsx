import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../components/Layout";
import { AppDispatch, RootState } from "../../../store";
import { allClaims } from "../../../store/claim";
import React, { useEffect, useRef } from "react";
import { Button, Popover, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FcViewDetails } from "react-icons/fc";
import { getWeatherEvents } from "../../../store/weather";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { PiWarningOctagonBold } from "react-icons/pi";
import { Filter, capitalizeFLetter } from "../../../utils/string";
import {
  APPROVED_BY_VALIDATOR,
  DECLINED_BY_VALIDATOR,
  PENDING,
} from "../../../config/const";

interface DataType {
  key: string;
  weather: string;
  date: string;
  status: string;
  time: string;
  raised: number;
  confirmed: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Claim ID",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "Weather Event",
    dataIndex: "weatherEventID",
    key: "weatherEventID",
  },
  {
    title: "Weather Event",
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
    title: "Customer Name",
    dataIndex: "customer_name",
    key: "customer_name",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string, record: any) => {
      if (status === APPROVED_BY_VALIDATOR || status === DECLINED_BY_VALIDATOR)
        return (
          <Popover
            placement="left"
            title={record.validator_name}
            content={
              <>
                <p>{record.validator_email}</p>
                <p>{record.detail}</p>
              </>
            }
            trigger="click"
          >
            <Button type="text" className="p-0">
              {status}
            </Button>
          </Popover>
        );
      return status;
    },
  },
];

const weather_columns: ColumnsType<DataType> = [
  {
    title: "Event ID",
    dataIndex: "ID",
    key: "ID",
  },
  {
    title: "Weather Event",
    dataIndex: "weather",
    key: "weather",
    render: (text) => capitalizeFLetter(text),
  },
  {
    title: "Area",
    dataIndex: "city",
    key: "city",
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
    title: "Url",
    dataIndex: "url",
    key: "url",
    render: (url) => (
      <a href={url} className="text-[#00f] underline">
        link
      </a>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Type",
    dataIndex: "fake",
    key: "fake",
    render: (value: string) => (value === "Fake" ? "Test Event" : value),
  },
  {
    title: "Claims Raised",
    dataIndex: "raised",
    key: "raised",
  },
  {
    title: "Confirmed Damage",
    dataIndex: "confirmed",
    key: "confirmed",
    render: (_, record) => {
      if (record.raised)
        return _ + "(" + ((_ * 100) / record.raised).toFixed(2) + "%)";
      else return _;
    },
  },
  {
    title: "Validator",
    dataIndex: "validator",
    key: "validator",
  },
];

const Claims: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { claims } = useSelector((state: RootState) => state.claim);
  const { weathers } = useSelector((state: RootState) => state.weather);
  const { filter } = useSelector((state: RootState) => state.auth);
  const tableRef = useRef(null);

  const getWidth = (ref: any) => {
    return ref?.current?.offsetWidth;
  };

  useEffect(() => {
    dispatch(allClaims());
    dispatch(getWeatherEvents());
  }, []);

  return (
    <Layout>
      <>
        <div className="relative">
          <p className="absolute flex gap-2 items-center top-0 right-0 float-right border px-4 py-1.5 bg-[#53c4e0] rounded-md">
            <TiWeatherPartlySunny className="w-6 h-6" /> Active Weather Events :{" "}
            {
              weathers.filter((weather: any) => weather.status === "Active")
                .length
            }
          </p>
          <div className="flex items-center text-black gap-2">
            <FcViewDetails className="w-8 h-8" />
            Weather Events
          </div>
          <div ref={tableRef}>
            <Table
              className="mt-4"
              bordered
              columns={weather_columns}
              dataSource={Filter(weathers, filter)}
              pagination={{ pageSize: 5 }}
              scroll={{ x: getWidth(tableRef) }}
            />
          </div>
        </div>
        <div className="relative mt-5">
          <p className="absolute flex gap-2 items-center top-0 right-0 float-right border px-4 py-1.5 bg-[#831616] rounded-md">
            <PiWarningOctagonBold className="w-6 h-6" /> Pending claims :{" "}
            {claims.filter((claim: any) => claim.status === PENDING).length}
          </p>
          <div className="flex items-center text-black gap-2">
            <FcViewDetails className="w-8 h-8" />
            Claim Details
          </div>
          <Table
            className="mt-4"
            bordered
            columns={columns}
            dataSource={Filter(claims, filter)}
            pagination={{ pageSize: 5 }}
            scroll={{ x: getWidth(tableRef) }}
          />
        </div>
      </>
    </Layout>
  );
};

export default Claims;
