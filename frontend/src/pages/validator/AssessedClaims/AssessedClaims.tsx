import { useEffect, useRef, useState } from "react";
import { Col, Row, Table } from "antd";
import Layout from "../../../components/Layout";
import Card from "../../../components/Card";
import { BarChartOutlined, PieChartOutlined } from "@ant-design/icons";
import ReactEcharts from "echarts-for-react";
import type { ColumnsType } from "antd/es/table";
import { FcViewDetails } from "react-icons/fc";
import { assessedClaims } from "../../../store/claim";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import moment from "moment";
import { Filter, capitalizeFLetter } from "../../../utils/string";
import {
  APPROVED_BY_VALIDATOR,
  DECLINED_BY_VALIDATOR,
} from "../../../config/const";

const option = {
  tooltip: {
    trigger: "item",
  },
  series: [
    {
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: false,
        position: "center",
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 0, name: "Approved" },
        { value: 0, name: "Declined" },
      ],
    },
  ],
};

const option1 = {
  tooltip: {},
  dataset: {
    source: [
      ["product", "Approved", "Declined"],
      ["Jul", 43.3, 85.8],
      ["Aug", 83.1, 73.4],
      ["Sep", 86.4, 65.2],
    ],
  },
  xAxis: { type: "category" },
  yAxis: {},
  // Declare several bar series, each will be mapped
  // to a column of dataset.source by default.
  series: [{ type: "bar" }, { type: "bar" }],
  legend: [
    {
      textStyle: {
        color: "#fff",
      },
    },
  ],
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
    title: "Date of Change",
    dataIndex: "date",
    key: "date",
    render: (date) => moment(date).format("l"),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
];

const AssessedClaims: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { assessed } = useSelector((state: RootState) => state.claim);
  const { filter } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState({});
  const [data1, setData1] = useState({});
  const tableRef = useRef(null);

  const getWidth = (ref: any) => {
    return ref?.current?.offsetWidth;
  };

  useEffect(() => {
    dispatch(assessedClaims());
  }, []);

  useEffect(() => {
    option.series[0].data[0].value = assessed.filter(
      (claim: any) => claim.status === APPROVED_BY_VALIDATOR
    ).length;
    option.series[0].data[1].value = assessed.filter(
      (claim: any) => claim.status === DECLINED_BY_VALIDATOR
    ).length;
    const start = moment().startOf("month").subtract(2, "months");
    const data: any[][] = [["product", "Approved", "Declined"], [], [], []];
    for (let i = 0; i < 3; i++) {
      data[i + 1].push(start.format("MMM"));
      const end = moment(start);
      data[i + 1].push(
        assessed.filter(
          (claim: any) =>
            claim.status === APPROVED_BY_VALIDATOR &&
            moment(claim.date).isSameOrAfter(start) &&
            moment(claim.date).isSameOrBefore(end.endOf("month"))
        ).length
      );
      data[i + 1].push(
        assessed.filter(
          (claim: any) =>
            claim.status === DECLINED_BY_VALIDATOR &&
            moment(claim.date).isSameOrAfter(start) &&
            moment(claim.date).isSameOrBefore(end.endOf("month"))
        ).length
      );
      start.add(1, "months");
    }
    option1.dataset.source = data;
    setData({ ...option });
    setData1({ ...option1 });
  }, [assessed]);

  return (
    <Layout>
      <>
        <Row gutter={[0, 64]} className="mt-5 text-left">
          <Col span={24} xl={12} className="p-4">
            <Card>
              <>
                <PieChartOutlined
                  style={{ fontSize: "48px" }}
                  className="absolute -top-6 right-6 p-2 bg-[#1f9978] rounded-md"
                />
                <p className="text-[24px]">Statistics</p>
                <div className="mt-5 mb-20">
                  <p className="p-2">
                    Total number of claims : {assessed.length}
                  </p>
                  <p className="p-2">
                    Approved claims :{" "}
                    {
                      assessed.filter(
                        (claim: any) => claim.status === APPROVED_BY_VALIDATOR
                      ).length
                    }
                  </p>
                  <p className="p-2">
                    Denied claims :{" "}
                    {
                      assessed.filter(
                        (claim: any) => claim.status === DECLINED_BY_VALIDATOR
                      ).length
                    }
                  </p>
                </div>
                <ReactEcharts
                  option={data}
                  className="!w-[240px] !h-[240px] !absolute right-0 bottom-0"
                />
              </>
            </Card>
          </Col>
          <Col span={24} xl={12} className="p-4">
            <Card>
              <>
                <BarChartOutlined
                  style={{ fontSize: "48px" }}
                  className="absolute -top-6 right-6 p-2 bg-[#1f9978] rounded-md"
                />
                <p className="text-[24px]">Last 3 months</p>
                <div className="w-full flex justify-center">
                  <ReactEcharts
                    option={data1}
                    className="mt-4 w-[420px] !h-[250px]"
                  />
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
              dataSource={Filter(assessed, filter)}
              scroll={{ x: getWidth(tableRef) }}
            />
          </div>
        </div>
      </>
    </Layout>
  );
};

export default AssessedClaims;
